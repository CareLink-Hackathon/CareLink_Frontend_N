'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { doctorService } from '@/lib/services/doctor-service';
import {
	Search,
	Calendar,
	Users,
	Activity,
	FileText,
	Clock,
	Filter,
	Play,
	Square,
	AlertTriangle,
	CheckCircle,
	Eye,
	User,
	RefreshCw,
	X,
} from 'lucide-react';

// Types
interface Appointment {
	_id: string;
	user_id: string;
	user_email: string;
	patient_name?: string;
	patient_phone?: string;
	patient_age?: number;
	patient_gender?: string;
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit?: string;
	// Update the status interface to match backend
	status: 'pending' | 'approved' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
	doctor_notes?: string;
}

interface DoctorProfile {
	user_id: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
	specialty: string;
	department: {
		id: string;
		name: string;
	};
	years_of_experience: number;
	qualification: string;
}

function DoctorAppointments() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();
	
	// State management
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [isUpdating, setIsUpdating] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [doctorNotes, setDoctorNotes] = useState('');

	// Get doctor ID from user
	const getDoctorId = () => {
		return user?.user_id || user?._id || (user as any)?.id;
	};

	// Load appointments data
	const loadAppointments = async () => {
		const doctorId = getDoctorId();
		if (!doctorId) {
			console.warn('⚠️ No doctor ID found');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log('🚀 Loading appointments for doctor:', doctorId);

			const appointmentsData = await doctorService.getAppointments(doctorId);

			console.log('📅 Appointments loaded:', appointmentsData);
			setAppointments(appointmentsData);

			// Set basic profile info from user data
			if (user) {
				setDoctorProfile({
					user_id: doctorId,
					email: user.email || '',
					first_name: user.first_name || '',
					last_name: user.last_name || '',
					full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
					specialty: (user as any).specialty || 'General Medicine',
					department: {
						id: '',
						name: (user as any).department || 'Medical Department'
					},
					years_of_experience: 0,
					qualification: 'MD'
				});
			}

		} catch (error) {
			console.error('❌ Error loading appointments:', error);
			setError('Failed to load appointments');
		} finally {
			setLoading(false);
		}
	};

	// Handle appointment status updates
	const handleStatusUpdate = async (appointmentId: string, newStatus: string, notes?: string) => {
		const doctorId = getDoctorId();
		if (!doctorId) return;

		try {
			setIsUpdating(true);
			console.log('🔄 Updating appointment status:', { appointmentId, newStatus, notes });
			
			await doctorService.updateAppointmentStatus(appointmentId, newStatus, doctorId, notes);
			
			// Reload appointments to get updated data
			await loadAppointments();
			
			console.log('✅ Appointment status updated successfully');
		} catch (error) {
			console.error('❌ Error updating appointment status:', error);
			setError('Failed to update appointment status');
		} finally {
			setIsUpdating(false);
			setSelectedAppointment(null);
			setDoctorNotes('');
		}
	};

	// Load data on component mount
	useEffect(() => {
		if (user?.role === 'doctor') {
			console.log('🚀 DoctorAppointments - Loading data for doctor:', user);
			loadAppointments();
		} else {
			console.log('❌ DoctorAppointments - User is not a doctor:', user);
			setLoading(false);
		}
	}, [user]);

	// Handle URL parameters for actions
	useEffect(() => {
		const action = searchParams.get('action');
		const appointmentId = searchParams.get('id');
		
		if (action && appointmentId && appointments.length > 0) {
			const appointment = appointments.find(apt => apt._id === appointmentId);
			if (appointment) {
				setSelectedAppointment(appointment);
				if (action === 'approve') {
					handleStatusUpdate(appointmentId, 'approved');
				}
			}
		}
	}, [searchParams, appointments]);

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/doctor/dashboard' },
		{
			icon: Calendar,
			label: 'My Appointments',
			href: '/doctor/appointments',
			active: true,
		},
		{ icon: Users, label: 'My Patients', href: '/doctor/patients' },
		{ icon: FileText, label: 'Medical Records', href: '/doctor/records' },
	];

	const userInfo = {
		name: doctorProfile
			? `DR. ${doctorProfile.first_name.toUpperCase()} ${doctorProfile.last_name.toUpperCase()}`
			: 'Doctor',
		id: doctorProfile
			? `Doctor ID: ${doctorProfile.user_id.slice(-6)}`
			: 'Loading...',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback: doctorProfile
			? `${doctorProfile.first_name[0]}${doctorProfile.last_name[0]}`
			: 'DR',
		role: doctorProfile?.specialty || 'Doctor',
	};

	// Filter appointments based on search and status
	const filteredAppointments = appointments.filter((appointment) => {
		const matchesSearch =
			(appointment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(appointment.user_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()));
		const matchesStatus =
			filterStatus === 'all' || appointment.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	// Helper functions
	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
			approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
			completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
			cancelled: { color: 'bg-red-100 text-red-800', icon: X },
		};

		const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
		const IconComponent = config.icon;

		return (
			<Badge className={config.color}>
				<IconComponent className="w-3 h-3 mr-1" />
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</Badge>
		);
	};

	const formatTime = (time: string) => {
		try {
			const [hours, minutes] = time.split(':');
			const hour = parseInt(hours);
			const ampm = hour >= 12 ? 'PM' : 'AM';
			const displayHour = hour % 12 || 12;
			return `${displayHour}:${minutes} ${ampm}`;
		} catch {
			return time;
		}
	};

	const formatDate = (date: string) => {
		try {
			return new Date(date).toLocaleDateString('en-US', {
				weekday: 'short',
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return date;
		}
	};

	// Loading state
	if (loading) {
		return (
			<ProtectedRoute allowedRoles={['doctor']}>
				<ResponsiveDashboardLayout
					sidebarItems={sidebarItems}
					userInfo={userInfo}
					pageTitle="Doctor Appointments"
				>
					<div className="flex items-center justify-center h-64">
						<RefreshCw className="w-8 h-8 animate-spin mr-2" />
						<span>Loading appointments...</span>
					</div>
				</ResponsiveDashboardLayout>
			</ProtectedRoute>
		);
	}

	// Error state
	if (error) {
		return (
			<ProtectedRoute allowedRoles={['doctor']}>
				<ResponsiveDashboardLayout
					sidebarItems={sidebarItems}
					userInfo={userInfo}
					pageTitle="Doctor Appointments"
				>
					<div className="text-center py-8">
						<AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
						<p className="text-gray-600 mb-4">{error}</p>
						<Button onClick={loadAppointments} variant="outline">
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
					</div>
				</ResponsiveDashboardLayout>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute allowedRoles={['doctor']}>
			<ResponsiveDashboardLayout
				sidebarItems={sidebarItems}
				userInfo={userInfo}
				pageTitle="Doctor Appointments"
			>
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
								My Appointments
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Manage your patient appointments and consultations
							</p>
						</div>
						
						<div className="flex gap-2">
							<Button
								onClick={loadAppointments}
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
								disabled={loading}
							>
								<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								Refresh
							</Button>
							<Button
								onClick={() => router.push('/doctor/dashboard')}
								size="sm"
								variant="outline"
								className="flex items-center gap-2"
							>
								<Activity className="w-4 h-4" />
								Dashboard
							</Button>
						</div>
					</div>
				</div>

				{/* Search and Filter Section */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search appointments..."
								className="pl-10 border-gray-300"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Button
								variant={filterStatus === 'all' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setFilterStatus('all')}
							>
								All
							</Button>
							<Button
								variant={filterStatus === 'pending' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setFilterStatus('pending')}
							>
								Pending
							</Button>
							<Button
								variant={filterStatus === 'approved' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setFilterStatus('approved')}
							>
								Approved
							</Button>
							<Button
								variant={filterStatus === 'completed' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setFilterStatus('completed')}
							>
								Completed
							</Button>
						</div>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total</p>
									<p className="text-2xl font-bold">{appointments.length}</p>
								</div>
								<Calendar className="w-8 h-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Pending</p>
									<p className="text-2xl font-bold text-yellow-600">
										{appointments.filter((a) => a.status === 'pending').length}
									</p>
								</div>
								<Clock className="w-8 h-8 text-yellow-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Approved</p>
									<p className="text-2xl font-bold text-blue-600">
										{appointments.filter((a) => a.status === 'approved').length}
									</p>
								</div>
								<CheckCircle className="w-8 h-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Completed</p>
									<p className="text-2xl font-bold text-green-600">
										{appointments.filter((a) => a.status === 'completed').length}
									</p>
								</div>
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Appointments List */}
				<div className="space-y-4">
					{filteredAppointments.length === 0 ? (
						<div className="text-center py-12">
							<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
							<p className="text-gray-600 mb-4">
								{searchTerm || filterStatus !== 'all' 
									? 'No appointments match your current filters.' 
									: 'You have no appointments.'}
							</p>
							{(searchTerm || filterStatus !== 'all') && (
								<Button
									variant="outline"
									onClick={() => {
										setSearchTerm('');
										setFilterStatus('all');
									}}
								>
									Clear Filters
								</Button>
							)}
						</div>
					) : (
						filteredAppointments.map((appointment) => (
							<Card
								key={appointment._id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
										<div className="flex items-center space-x-4">
											<Avatar className="w-12 h-12">
												<AvatarImage src="/placeholder.svg?height=48&width=48" />
												<AvatarFallback>
													{(appointment.patient_name || 'Unknown Patient')
														.split(' ')
														.map((n: string) => n[0])
														.join('')
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-lg">
													{appointment.patient_name || 'Unknown Patient'}
												</h3>
												<p className="text-gray-600">
													{appointment.user_email}
												</p>
												{appointment.patient_phone && (
													<p className="text-sm text-gray-500">
														📞 {appointment.patient_phone}
													</p>
												)}
												<p className="text-sm text-gray-500 mt-1">
													{appointment.reason_for_visit || 'No reason provided'}
												</p>
											</div>
										</div>
										
										<div className="flex flex-col lg:flex-row lg:items-center gap-4">
											<div className="text-center lg:text-right">
												<div className="flex items-center justify-center lg:justify-end space-x-2 mb-2">
													<Calendar className="w-4 h-4 text-gray-500" />
													<span className="font-medium">{formatDate(appointment.date)}</span>
												</div>
												<div className="flex items-center justify-center lg:justify-end space-x-2 mb-2">
													<Clock className="w-4 h-4 text-gray-500" />
													<span>{formatTime(appointment.time)}</span>
												</div>
												<div className="flex justify-center lg:justify-end">
													{getStatusBadge(appointment.status)}
												</div>
											</div>
											
											<div className="text-center lg:text-right">
												<p className="font-medium mb-2 text-blue-600">{appointment.type}</p>
												{appointment.patient_age && (
													<p className="text-sm text-gray-500 mb-2">
														Age: {appointment.patient_age}
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="mt-4 pt-4 border-t border-gray-200">
										<div className="flex flex-wrap gap-2 justify-end">
											{appointment.status === 'pending' && (
												<>
													<Button
														size="sm"
														className="bg-green-600 hover:bg-green-700"
														onClick={() => handleStatusUpdate(appointment._id, 'approved')}
														disabled={isUpdating}
													>
														<CheckCircle className="w-4 h-4 mr-1" />
														Approve
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
														disabled={isUpdating}
													>
														<X className="w-4 h-4 mr-1" />
														Decline
													</Button>
												</>
											)}
											{appointment.status === 'approved' && (
												<Dialog>
													<DialogTrigger asChild>
														<Button
															size="sm"
															className="bg-blue-600 hover:bg-blue-700"
															onClick={() => setSelectedAppointment(appointment)}
														>
															<Square className="w-4 h-4 mr-1" />
															Complete
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Complete Appointment</DialogTitle>
														</DialogHeader>
														<div className="space-y-4">
															<div>
																<Label>Patient: {appointment.patient_name}</Label>
															</div>
															<div>
																<Label>Date & Time: {formatDate(appointment.date)} at {formatTime(appointment.time)}</Label>
															</div>
															<div>
																<Label htmlFor="notes">Doctor Notes</Label>
																<Textarea
																	id="notes"
																	placeholder="Enter appointment notes and diagnosis..."
																	value={doctorNotes}
																	onChange={(e) => setDoctorNotes(e.target.value)}
																	rows={4}
																/>
															</div>
															<Button
																className="w-full"
																onClick={() => handleStatusUpdate(appointment._id, 'completed', doctorNotes)}
																disabled={isUpdating}
															>
																{isUpdating ? 'Completing...' : 'Complete Appointment'}
															</Button>
														</div>
													</DialogContent>
												</Dialog>
											)}
											<Button
												size="sm"
												variant="outline"
												onClick={() => setSelectedAppointment(appointment)}
											>
												<Eye className="w-4 h-4 mr-1" />
												Details
											</Button>
										</div>
									</div>

									{/* Doctor Notes Display */}
									{appointment.doctor_notes && (
										<div className="mt-4 pt-4 border-t border-gray-200">
											<p className="text-sm text-gray-600 mb-1">Doctor Notes:</p>
											<p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.doctor_notes}</p>
										</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Appointment Details Modal */}
				{selectedAppointment && (
					<Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Appointment Details</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="font-semibold">Patient Name</Label>
										<p>{selectedAppointment.patient_name || 'Unknown'}</p>
									</div>
									<div>
										<Label className="font-semibold">Email</Label>
										<p>{selectedAppointment.user_email}</p>
									</div>
									<div>
										<Label className="font-semibold">Phone</Label>
										<p>{selectedAppointment.patient_phone || 'Not provided'}</p>
									</div>
									<div>
										<Label className="font-semibold">Age</Label>
										<p>{selectedAppointment.patient_age || 'Not provided'}</p>
									</div>
									<div>
										<Label className="font-semibold">Appointment Type</Label>
										<p>{selectedAppointment.type}</p>
									</div>
									<div>
										<Label className="font-semibold">Status</Label>
										<div className="mt-1">
											{getStatusBadge(selectedAppointment.status)}
										</div>
									</div>
									<div>
										<Label className="font-semibold">Date</Label>
										<p>{formatDate(selectedAppointment.date)}</p>
									</div>
									<div>
										<Label className="font-semibold">Time</Label>
										<p>{formatTime(selectedAppointment.time)}</p>
									</div>
								</div>
								<div>
									<Label className="font-semibold">Reason for Visit</Label>
									<p className="mt-1">{selectedAppointment.reason_for_visit || 'No reason provided'}</p>
								</div>
								{selectedAppointment.doctor_notes && (
									<div>
										<Label className="font-semibold">Doctor Notes</Label>
										<p className="mt-1 bg-gray-50 p-3 rounded-lg">{selectedAppointment.doctor_notes}</p>
									</div>
								)}
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() => setSelectedAppointment(null)}
									>
										Close
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}

export default DoctorAppointments;
