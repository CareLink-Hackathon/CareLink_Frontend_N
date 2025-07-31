'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/lib/contexts/patient-context';
import { useAuth } from '@/lib/auth-context';
import { patientService } from '@/lib/services/patient-service';
import { AppointmentRequest } from '@/lib/types';
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
	MapPin,
	Plus,
	Bot,
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
} from 'lucide-react';

export default function PatientAppointments() {
	const router = useRouter();
	const { user } = useAuth();
	const { 
		appointments, 
		requestAppointment, 
		loadAppointments, 
		isLoading, 
		error,
		clearError 
	} = usePatient();
	
	const [isBookingOpen, setIsBookingOpen] = useState(false);
	const [formData, setFormData] = useState<Partial<AppointmentRequest>>({
		type: '',
		doctor: '',
		date: '',
		time: '',
		reason_for_visit: '',
	});
	const [formErrors, setFormErrors] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// User info for responsive layout
	const userInfo = user ? {
		name: `${user.first_name} ${user.last_name}`.toUpperCase(),
		fallback: `${user.first_name[0]}${user.last_name[0]}`,
		role: 'Patient',
		id: user._id,
	} : null;

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{
			icon: Calendar,
			label: 'Appointments',
			href: '/patient/appointments',
			active: true,
		},
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	// Available doctors (this could come from API in future)
	const availableDoctors = [
		'Dr. Sarah Johnson - Cardiologist',
		'Dr. Michael Chen - General Practitioner',
		'Dr. Emily Rodriguez - Dermatologist',
		'Dr. David Thompson - Orthopedic Surgeon',
		'Dr. Lisa Park - Pediatrician',
		'Dr. James Wilson - Neurologist',
	];

	// Appointment types
	const appointmentTypes = [
		{ value: 'checkup', label: 'General Checkup' },
		{ value: 'consultation', label: 'Consultation' },
		{ value: 'followup', label: 'Follow-up' },
		{ value: 'specialist', label: 'Specialist Visit' },
		{ value: 'emergency', label: 'Emergency' },
	];

	const handleBookAppointment = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormErrors([]);
		
		// Validate form
		const errors = patientService.validateAppointmentData(formData);
		if (errors.length > 0) {
			setFormErrors(errors);
			return;
		}

		setIsSubmitting(true);
		
		const success = await requestAppointment(formData as AppointmentRequest);
		
		if (success) {
			setIsBookingOpen(false);
			setFormData({
				type: '',
				doctor: '',
				date: '',
				time: '',
				reason_for_visit: '',
			});
			setFormErrors([]);
		}
		
		setIsSubmitting(false);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <AlertCircle className="w-4 h-4 text-yellow-600" />;
			case 'scheduled':
				return <CheckCircle className="w-4 h-4 text-blue-600" />;
			case 'completed':
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case 'cancelled':
				return <XCircle className="w-4 h-4 text-red-600" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-600" />;
		}
	};

	// Generate time slots
	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 8; hour < 18; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
				slots.push(time);
			}
		}
		return slots;
	};

	// Get minimum date (tomorrow)
	const getMinDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split('T')[0];
	};

	return (
		<ProtectedRoute allowedRoles={['patient']}>
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				showSearch={true}
				onSearch={(query) => console.log('Search:', query)}
			>
				<div className="space-y-4 sm:space-y-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
								My Appointments
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Manage your healthcare appointments
							</p>
						</div>

						<Button
							onClick={() => router.push('/patient/chatbot')}
							className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
						>
							<Bot className="w-4 h-4 mr-2" />
							<span className="sm:inline">AI Assistant</span>
						</Button>
					</div>

					{/* Error Display */}
					{error && (
						<Card className="border-red-200 bg-red-50">
							<CardContent className="pt-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<AlertCircle className="w-5 h-5 text-red-600" />
										<p className="text-red-700">{error}</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={clearError}
										className="text-red-600 hover:bg-red-100"
									>
										Dismiss
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Action buttons */}
					<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
						<Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
							<DialogTrigger asChild>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
									<Plus className="w-4 h-4 mr-2" />
									Book Appointment
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Book New Appointment</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleBookAppointment} className="space-y-4">
									{/* Form Errors */}
									{formErrors.length > 0 && (
										<div className="bg-red-50 border border-red-200 rounded-lg p-3">
											<div className="flex items-center space-x-2 mb-2">
												<AlertCircle className="w-4 h-4 text-red-600" />
												<span className="text-sm font-medium text-red-700">
													Please fix the following errors:
												</span>
											</div>
											<ul className="list-disc list-inside text-sm text-red-600 space-y-1">
												{formErrors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										</div>
									)}

									<div>
										<Label htmlFor="type">Appointment Type</Label>
										<Select
											value={formData.type}
											onValueChange={(value) =>
												setFormData(prev => ({ ...prev, type: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select appointment type" />
											</SelectTrigger>
											<SelectContent>
												{appointmentTypes.map((type) => (
													<SelectItem key={type.value} value={type.value}>
														{type.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="doctor">Select Doctor</Label>
										<Select
											value={formData.doctor}
											onValueChange={(value) =>
												setFormData(prev => ({ ...prev, doctor: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Choose a doctor" />
											</SelectTrigger>
											<SelectContent>
												{availableDoctors.map((doctor) => (
													<SelectItem key={doctor} value={doctor}>
														{doctor}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="date">Preferred Date</Label>
										<Input
											id="date"
											type="date"
											min={getMinDate()}
											value={formData.date}
											onChange={(e) =>
												setFormData(prev => ({ ...prev, date: e.target.value }))
											}
										/>
									</div>

									<div>
										<Label htmlFor="time">Preferred Time</Label>
										<Select
											value={formData.time}
											onValueChange={(value) =>
												setFormData(prev => ({ ...prev, time: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select time" />
											</SelectTrigger>
											<SelectContent>
												{generateTimeSlots().map((time) => (
													<SelectItem key={time} value={time}>
														{patientService.formatTime(time)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="reason">Reason for Visit</Label>
										<Textarea
											id="reason"
											placeholder="Describe your symptoms or reason for the appointment..."
											value={formData.reason_for_visit}
											onChange={(e) =>
												setFormData(prev => ({ ...prev, reason_for_visit: e.target.value }))
											}
											className="min-h-[80px]"
										/>
									</div>

									<div className="flex space-x-2 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsBookingOpen(false)}
											className="flex-1"
											disabled={isSubmitting}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="flex-1 bg-blue-600 hover:bg-blue-700"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Booking...
												</>
											) : (
												'Book Appointment'
											)}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{/* Appointments List */}
					<div className="space-y-4">
						{isLoading ? (
							<Card>
								<CardContent className="pt-6">
									<div className="flex items-center justify-center py-8">
										<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
										<span className="ml-2 text-gray-600">Loading appointments...</span>
									</div>
								</CardContent>
							</Card>
						) : appointments.length === 0 ? (
							<Card>
								<CardContent className="pt-6">
									<div className="text-center py-8">
										<Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No appointments yet
										</h3>
										<p className="text-gray-600 mb-4">
											You haven't booked any appointments. Start by booking your first appointment.
										</p>
										<Button
											onClick={() => setIsBookingOpen(true)}
											className="bg-blue-600 hover:bg-blue-700 text-white"
										>
											<Plus className="w-4 h-4 mr-2" />
											Book Your First Appointment
										</Button>
									</div>
								</CardContent>
							</Card>
						) : (
							appointments.map((appointment) => (
								<Card key={appointment._id} className="hover:shadow-md transition-shadow">
									<CardContent className="pt-6">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
											<div className="space-y-3 flex-1">
												<div className="flex items-center justify-between">
													<h3 className="font-semibold text-gray-900">
														{patientService.formatAppointmentType(appointment.type)}
													</h3>
													<Badge
														className={patientService.getStatusColor(appointment.status)}
														variant="secondary"
													>
														<div className="flex items-center space-x-1">
															{getStatusIcon(appointment.status)}
															<span>{patientService.formatAppointmentStatus(appointment.status)}</span>
														</div>
													</Badge>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
													<div className="flex items-center space-x-2">
														<User className="w-4 h-4 text-gray-500" />
														<span className="text-gray-700">{appointment.doctor}</span>
													</div>
													<div className="flex items-center space-x-2">
														<Calendar className="w-4 h-4 text-gray-500" />
														<span className="text-gray-700">
															{patientService.formatDate(appointment.date)}
														</span>
													</div>
													<div className="flex items-center space-x-2">
														<Clock className="w-4 h-4 text-gray-500" />
														<span className="text-gray-700">
															{patientService.formatTime(appointment.time)}
														</span>
													</div>
													<div className="flex items-center space-x-2">
														<MapPin className="w-4 h-4 text-gray-500" />
														<span className="text-gray-700">Douala General Hospital</span>
													</div>
												</div>

												{appointment.reason_for_visit && (
													<div className="bg-gray-50 rounded-lg p-3">
														<p className="text-sm text-gray-700">
															<strong>Reason:</strong> {appointment.reason_for_visit}
														</p>
													</div>
												)}
											</div>
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
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{
			icon: Calendar,
			label: 'Appointments',
			href: '/patient/appointments',
			active: true,
		},
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	const userInfo = {
		name: 'JOHN DOE',
		id: 'Patient ID: P001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback: 'JD',
		role: 'Patient',
	};

	const appointments = [
		{
			id: 1,
			doctor: 'Dr. Sarah Johnson',
			specialty: 'Cardiologist',
			date: '2025-01-28',
			time: '2:30 PM',
			type: 'Check-up',
			status: 'confirmed',
			hospital: 'City General Hospital',
		},
		{
			id: 2,
			doctor: 'Dr. Michael Chen',
			specialty: 'Dermatologist',
			date: '2025-01-29',
			time: '10:00 AM',
			type: 'Consultation',
			status: 'pending',
			hospital: 'Skin Care Clinic',
		},
		{
			id: 3,
			doctor: 'Dr. Emily Davis',
			specialty: 'Gynecologist',
			date: '2025-01-25',
			time: '3:00 PM',
			type: 'Follow-up',
			status: 'completed',
			hospital: "Women's Health Center",
		},
	];

	const handleBookAppointment = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate booking
		setTimeout(() => {
			setIsLoading(false);
			setIsBookingOpen(false);
			// Show success message or refresh appointments
		}, 2000);
	};

	return (
		<ResponsiveDashboardLayout
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={true}
			onSearch={(query) => console.log('Search:', query)}
		>
			<div className="space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							My Appointments
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Manage your healthcare appointments
						</p>
					</div>

					<Button
						onClick={() => router.push('/patient/chatbot')}
						className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
					>
						<Bot className="w-4 h-4 mr-2" />
						<span className="sm:inline">AI Assistant</span>
					</Button>
				</div>

				{/* Action buttons - Mobile responsive */}
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
						<DialogTrigger asChild>
							<Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
								<Plus className="w-4 h-4 mr-2" />
								Book Appointment
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md mx-4 sm:mx-auto">
							<DialogHeader>
								<DialogTitle>Book New Appointment</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleBookAppointment} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="specialty">Medical Specialty</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select specialty" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cardiology">Cardiology</SelectItem>
											<SelectItem value="dermatology">Dermatology</SelectItem>
											<SelectItem value="gynecology">Gynecology</SelectItem>
											<SelectItem value="pediatrics">Pediatrics</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="doctor">Preferred Doctor</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select doctor" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="dr-johnson">
												Dr. Sarah Johnson
											</SelectItem>
											<SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
											<SelectItem value="dr-davis">Dr. Emily Davis</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="date">Preferred Date</Label>
									<Input type="date" id="date" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="time">Preferred Time</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select time" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="09:00">9:00 AM</SelectItem>
											<SelectItem value="10:00">10:00 AM</SelectItem>
											<SelectItem value="11:00">11:00 AM</SelectItem>
											<SelectItem value="14:00">2:00 PM</SelectItem>
											<SelectItem value="15:00">3:00 PM</SelectItem>
											<SelectItem value="16:00">4:00 PM</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="reason">Reason for Visit</Label>
									<Textarea
										id="reason"
										placeholder="Describe your symptoms or reason for visit..."
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? 'Booking...' : 'Book Appointment'}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				{/* Filter and Sort - Mobile responsive */}
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<Button variant="outline" size="sm" className="w-full sm:w-auto">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
					<Select defaultValue="all">
						<SelectTrigger className="w-full sm:w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Appointments</SelectItem>
							<SelectItem value="upcoming">Upcoming</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Appointments Display - Mobile optimized cards */}
				<div className="space-y-4">
					{appointments.map((appointment) => (
						<Card
							key={appointment.id}
							className="hover:shadow-lg transition-shadow"
						>
							<CardContent className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div className="flex items-center space-x-3">
										<Avatar className="w-10 h-10 sm:w-12 sm:h-12">
											<AvatarImage src="/placeholder.svg?height=48&width=48" />
											<AvatarFallback>
												{appointment.doctor
													.split(' ')
													.map((n: string) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<h3 className="font-semibold text-sm sm:text-lg truncate">
												{appointment.doctor}
											</h3>
											<p className="text-gray-600 text-xs sm:text-sm">
												{appointment.specialty}
											</p>
											<p className="text-xs text-gray-500">
												{appointment.hospital}
											</p>
										</div>
									</div>

									<div className="flex flex-col sm:text-right space-y-1">
										<div className="flex items-center space-x-2 text-xs sm:text-sm">
											<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
											<span className="font-medium">{appointment.date}</span>
										</div>
										<div className="flex items-center space-x-2 text-xs sm:text-sm">
											<Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
											<span>{appointment.time}</span>
										</div>
										<StatusBadge status={appointment.status} />
									</div>
								</div>

								<div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
									<div className="flex items-center space-x-2">
										<span className="text-xs sm:text-sm text-gray-600">
											Type:
										</span>
										<span className="text-xs sm:text-sm font-medium">
											{appointment.type}
										</span>
									</div>
									<div className="flex space-x-2">
										{appointment.status === 'pending' && (
											<Button
												variant="outline"
												size="sm"
												className="text-xs flex-1 sm:flex-none"
											>
												Cancel
											</Button>
										)}
										{appointment.status === 'confirmed' && (
											<Button
												variant="outline"
												size="sm"
												className="text-xs flex-1 sm:flex-none"
											>
												Reschedule
											</Button>
										)}
										<Button size="sm" className="text-xs flex-1 sm:flex-none">
											View Details
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</ResponsiveDashboardLayout>
	);
}
