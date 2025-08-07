'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authService } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
	Calendar,
	Clock,
	User,
	Plus,
	Activity,
	FileText,
	Star,
	Bell,
	Settings,
	HelpCircle,
	AlertCircle,
	CheckCircle,
	XCircle,
	Loader2,
	Edit,
	Trash2,
	UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
	_id: string;
	user_id: string;
	full_name: string;
	specialty: string;
	department_name: string;
	years_of_experience: number;
	qualification: string;
	profile_image_url?: string;
}

interface Appointment {
	_id: string;
	patient_id: string;
	patient_name: string;
	doctor_id: string;
	doctor_name: string;
	doctor_specialty: string;
	type: string;
	date: string;
	time: string;
	reason_for_visit: string;
	notes: string;
	status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
	doctor_notes?: string;
}

interface AppointmentForm {
	type: string;
	doctor_id: string;
	date: string;
	time: string;
	reason_for_visit: string;
	notes: string;
}

const APPOINTMENT_TYPES = [
	'Checkup',
	'Emergency',
	'Consultation',
	'Follow-up',
	'Vaccination',
	'Lab Tests',
	'Surgery Consultation',
	'Mental Health',
	'Pediatric Care',
	'Elderly Care'
];

export default function PatientAppointments() {
	const router = useRouter();
	const { user } = useAuth();
	const { toast } = useToast();

	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false); // Track if initial data has been loaded
	
	const [form, setForm] = useState<AppointmentForm>({
		type: '',
		doctor_id: '',
		date: '',
		time: '',
		reason_for_visit: '',
		notes: ''
	});

	// Get patient ID from user
	const getPatientId = () => {
		console.log('🔍 Getting patient ID from user:', user);
		
		// The login response returns user_id, but the auth context might store it as _id
		// Try user_id first (from login response), then _id (common pattern)
		const patientId = user?.user_id || user?._id || (user as any)?.id;
		
		console.log('🔍 Resolved patient ID:', patientId);
		return patientId;
	};

	// Get auth headers for API calls
	const getAuthHeaders = (): Record<string, string> => {
		const token = authService.getToken();
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		return headers;
	};

	// Fetch doctors
	const fetchDoctors = async () => {
		try {
			console.log('🏥 Fetching doctors...');
			const response = await fetch(`${API_BASE_URL}/doctors`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (response.ok) {
				const data = await response.json();
				console.log('✅ Doctors fetched successfully:', data.doctors?.length || 0);
				setDoctors(data.doctors || []);
			} else {
				console.error('❌ Failed to fetch doctors:', response.status);
			}
		} catch (error) {
			console.error('❌ Error fetching doctors:', error);
		}
	};

	// Fetch appointments
	const fetchAppointments = async () => {
		const patientId = getPatientId();
		if (!patientId) {
			console.warn('⚠️ Cannot fetch appointments: No patient ID');
			return;
		}
		
		try {
			console.log('📅 Fetching appointments for patient:', patientId);
			const response = await fetch(`${API_BASE_URL}/patient/${patientId}/appointments`, {
				headers: getAuthHeaders()
			});
			
			console.log('📅 Appointments API response status:', response.status);
			
			if (response.ok) {
				const data = await response.json();
				console.log('✅ Appointments fetched successfully:', data.appointments?.length || 0, 'appointments');
				setAppointments(data.appointments || []);
			} else {
				console.error('❌ Failed to fetch appointments:', response.status, response.statusText);
				const errorData = await response.json().catch(() => ({}));
				console.error('❌ Error details:', errorData);
			}
		} catch (error) {
			console.error('❌ Error fetching appointments:', error);
		}
	};

	// Fetch doctor availability
	const fetchAvailability = async (doctorId: string, date: string) => {
		if (!doctorId || !date) return;
		
		try {
			const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/availability/${date}`, {
				headers: getAuthHeaders()
			});
			if (response.ok) {
				const data = await response.json();
				setAvailableSlots(data.available_slots || []);
			}
		} catch (error) {
			console.error('Error fetching availability:', error);
			setAvailableSlots([]);
		}
	};

	useEffect(() => {
		// Debug the user object to see what fields are available
		console.log('👤 Full user object:', user);
		console.log('👤 User keys:', user ? Object.keys(user) : 'No user');
		
		// Always fetch doctors since the endpoint doesn't require auth
		if (!dataLoaded) {
			console.log('📊 Loading appointment data...');
			const loadData = async () => {
				try {
					setLoading(true);
					
					// Always fetch doctors
					await fetchDoctors();
					
					// Fetch appointments if user is authenticated
					if (user && getPatientId() && authService.isAuthenticated()) {
						console.log('🏥 Fetching appointments for patient:', getPatientId());
						await fetchAppointments();
					} else {
						console.log('⚠️ User not authenticated or no patient ID, skipping appointments fetch');
						console.log('⚠️ Debug info:', {
							hasUser: !!user,
							patientId: getPatientId(),
							isAuthenticated: authService.isAuthenticated()
						});
					}
					
					setDataLoaded(true);
				} catch (error) {
					console.error('Error loading data:', error);
				} finally {
					setLoading(false);
				}
			};
			loadData();
		}
	}, [user?._id, user?.user_id, dataLoaded]);

	// Watch for doctor or date changes to fetch availability
	useEffect(() => {
		if (form.doctor_id && form.date) {
			fetchAvailability(form.doctor_id, form.date);
		} else {
			setAvailableSlots([]);
		}
	}, [form.doctor_id, form.date]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('🚀 Form submission started');
		console.log('📝 Form data:', form);
		
		const patientId = getPatientId();
		console.log('👤 Patient ID:', patientId);
		
		if (!patientId) {
			console.error('❌ No patient ID found');
			toast({
				title: 'Error',
				description: 'Patient ID not found. Please log in again.',
				variant: 'destructive',
			});
			return;
		}

		// Validate required fields
		if (!form.type || !form.doctor_id || !form.date || !form.time || !form.reason_for_visit) {
			console.error('❌ Missing required fields:', {
				type: !!form.type,
				doctor_id: !!form.doctor_id,
				date: !!form.date,
				time: !!form.time,
				reason_for_visit: !!form.reason_for_visit
			});
			toast({
				title: 'Error',
				description: 'Please fill in all required fields',
				variant: 'destructive',
			});
			return;
		}

		setSubmitting(true);
		try {
			const url = editingAppointment 
				? `${API_BASE_URL}/patient/${patientId}/appointments/${editingAppointment._id}`
				: `${API_BASE_URL}/patient/${patientId}/appointments`;
			
			const method = editingAppointment ? 'PUT' : 'POST';
			
			console.log('📡 Making API request:', { method, url, form });
			
			const response = await fetch(url, {
				method,
				headers: getAuthHeaders(),
				body: JSON.stringify(form),
			});

			console.log('📨 API response status:', response.status);

			if (response.ok) {
				const responseData = await response.json();
				console.log('✅ Appointment created successfully:', responseData);
				
				toast({
					title: 'Success',
					description: editingAppointment 
						? 'Appointment updated successfully' 
						: 'Appointment booked successfully',
				});
				
				// Reset form and close dialog
				resetForm();
				setDialogOpen(false);
				
				// Refresh appointments
				await fetchAppointments();
			} else {
				const errorData = await response.json();
				console.error('❌ API error response:', errorData);
				toast({
					title: 'Error',
					description: errorData.detail || 'Failed to save appointment',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('❌ Unexpected error:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (appointment: Appointment) => {
		if (appointment.status !== 'pending') {
			toast({
				title: 'Cannot Edit',
				description: 'Only pending appointments can be edited',
				variant: 'destructive',
			});
			return;
		}

		setEditingAppointment(appointment);
		setForm({
			type: appointment.type,
			doctor_id: appointment.doctor_id,
			date: appointment.date,
			time: appointment.time,
			reason_for_visit: appointment.reason_for_visit,
			notes: appointment.notes || ''
		});
		setDialogOpen(true);
	};

	const handleCancel = async (appointmentId: string) => {
		const patientId = getPatientId();
		if (!patientId) return;

		try {
			const response = await fetch(`${API_BASE_URL}/patient/${patientId}/appointments/${appointmentId}`, {
				method: 'DELETE',
				headers: getAuthHeaders(),
			});

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Appointment cancelled successfully',
				});
				await fetchAppointments();
			} else {
				const error = await response.json();
				toast({
					title: 'Error',
					description: error.detail || 'Failed to cancel appointment',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
			approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
			rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
			completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
			cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		const Icon = config?.icon || AlertCircle;

		return (
			<Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
				<Icon className="w-3 h-3 mr-1" />
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	const resetForm = () => {
		setForm({
			type: '',
			doctor_id: '',
			date: '',
			time: '',
			reason_for_visit: '',
			notes: ''
		});
		setEditingAppointment(null);
		setAvailableSlots([]);
	};

	const handleDialogClose = (open: boolean) => {
		setDialogOpen(open);
		if (!open) {
			resetForm();
		}
	};

	// Create user info object for layout
	const userInfo = {
		name: user ? `${user.first_name} ${user.last_name}` : 'Patient',
		fallback: user ? user.first_name.charAt(0) + user.last_name.charAt(0) : 'P',
		role: user?.role || user?.account_type || 'patient',
		id: user?._id || ''
	};

	// Sidebar items for patient
	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments', active: true },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{ icon: Bell, label: 'Notifications', href: '/patient/notifications' },
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().split('T')[0];

	if (loading || !user) {
		return (
			<ProtectedRoute>
				<ResponsiveDashboardLayout
					userInfo={userInfo}
					sidebarItems={sidebarItems}
					pageTitle="Appointments"
				>
					<div className="flex items-center justify-center h-64">
						<Loader2 className="w-8 h-8 animate-spin" />
					</div>
				</ResponsiveDashboardLayout>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				pageTitle="My Appointments"
			>
				<div className="space-y-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
							<p className="text-gray-600">Book and manage your medical appointments</p>
						</div>

						<div className="flex gap-2">
							<Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
								<DialogTrigger asChild>
									<Button className="flex items-center gap-2">
										<Plus className="w-4 h-4" />
										Book Appointment
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>
										{editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
									</DialogTitle>
								</DialogHeader>

								<form onSubmit={handleSubmit} className="space-y-4">
									{/* Appointment Type */}
									<div>
										<Label htmlFor="type">Appointment Type</Label>
										<Select 
											value={form.type} 
											onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select appointment type" />
											</SelectTrigger>
											<SelectContent>
												{APPOINTMENT_TYPES.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Doctor Selection */}
									<div>
										<Label htmlFor="doctor">Doctor</Label>
										<Select 
											value={form.doctor_id} 
											onValueChange={(value) => setForm(prev => ({ ...prev, doctor_id: value }))}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a doctor" />
											</SelectTrigger>
											<SelectContent>
												{doctors.length > 0 ? (
													doctors.map((doctor) => (
														<SelectItem key={doctor._id} value={doctor._id}>
															<div className="flex flex-col">
																<span className="font-medium">{doctor.full_name}</span>
																<span className="text-sm text-gray-500">
																	{doctor.specialty} • {doctor.department_name}
																</span>
															</div>
														</SelectItem>
													))
												) : (
													<div className="p-2 text-sm text-gray-500 text-center">
														No doctors available
													</div>
												)}
											</SelectContent>
										</Select>
									</div>

									{/* Date */}
									<div>
										<Label htmlFor="date">Date</Label>
										<Input
											type="date"
											value={form.date}
											min={today}
											onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
											required
										/>
									</div>

									{/* Time */}
									<div>
										<Label htmlFor="time">Time</Label>
										<Select 
											value={form.time} 
											onValueChange={(value) => setForm(prev => ({ ...prev, time: value }))}
											disabled={!form.doctor_id || !form.date}
										>
											<SelectTrigger>
												<SelectValue placeholder={
													!form.doctor_id || !form.date 
														? "Select doctor and date first"
														: availableSlots.length === 0 
														? "No available slots"
														: "Select time slot"
												} />
											</SelectTrigger>
											<SelectContent>
												{availableSlots.length > 0 ? (
													availableSlots.map((slot) => (
														<SelectItem key={slot} value={slot}>
															{slot}
														</SelectItem>
													))
												) : (
													<div className="p-2 text-sm text-gray-500 text-center">
														{form.doctor_id && form.date ? 'No available slots' : 'Select doctor and date first'}
													</div>
												)}
											</SelectContent>
										</Select>
									</div>

									{/* Reason for Visit */}
									<div>
										<Label htmlFor="reason">Reason for Visit</Label>
										<Textarea
											value={form.reason_for_visit}
											onChange={(e) => setForm(prev => ({ ...prev, reason_for_visit: e.target.value }))}
											placeholder="Please describe your symptoms or reason for visit"
											required
										/>
									</div>

									{/* Additional Notes */}
									<div>
										<Label htmlFor="notes">Additional Notes (Optional)</Label>
										<Textarea
											value={form.notes}
											onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
											placeholder="Any additional information you'd like the doctor to know"
										/>
									</div>

									<div className="flex gap-2 pt-4">
										<Button 
											type="button" 
											variant="outline" 
											onClick={() => handleDialogClose(false)}
											className="flex-1"
										>
											Cancel
										</Button>
										<Button 
											type="submit" 
											disabled={submitting}
											className="flex-1"
										>
											{submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
											{editingAppointment ? 'Update' : 'Book'} Appointment
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>

					{/* Appointments List */}
					<div className="grid gap-4">
						{appointments.length === 0 ? (
							<Card>
								<CardContent className="text-center py-12">
									<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments</h3>
									<p className="text-gray-500 mb-4">You haven't booked any appointments yet.</p>
									<Button onClick={() => setDialogOpen(true)}>
										<Plus className="w-4 h-4 mr-2" />
										Book Your First Appointment
									</Button>
								</CardContent>
							</Card>
						) : (
							appointments.map((appointment) => (
								<Card key={appointment._id} className="overflow-hidden">
									<CardContent className="p-6">
										<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
											<div className="flex-1 space-y-3">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
															<UserCheck className="w-5 h-5 text-blue-600" />
														</div>
														<div>
															<h3 className="font-semibold text-gray-900">
																{appointment.doctor_name}
															</h3>
															<p className="text-sm text-gray-500">
																{appointment.doctor_specialty}
															</p>
														</div>
													</div>
													{getStatusBadge(appointment.status)}
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-gray-400" />
														<span>{new Date(appointment.date).toLocaleDateString()}</span>
													</div>
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4 text-gray-400" />
														<span>{appointment.time}</span>
													</div>
													<div className="flex items-center gap-2">
														<Activity className="w-4 h-4 text-gray-400" />
														<span>{appointment.type}</span>
													</div>
												</div>

												<div>
													<p className="text-sm text-gray-600">
														<strong>Reason:</strong> {appointment.reason_for_visit}
													</p>
													{appointment.notes && (
														<p className="text-sm text-gray-600 mt-1">
															<strong>Notes:</strong> {appointment.notes}
														</p>
													)}
													{appointment.doctor_notes && (
														<p className="text-sm text-blue-600 mt-1">
															<strong>Doctor's Notes:</strong> {appointment.doctor_notes}
														</p>
													)}
												</div>
											</div>

											{/* Actions */}
											{appointment.status === 'pending' && (
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleEdit(appointment)}
													>
														<Edit className="w-4 h-4 mr-1" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleCancel(appointment._id)}
													>
														<Trash2 className="w-4 h-4 mr-1" />
														Cancel
													</Button>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}
