'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth-context';
import { authService } from '@/lib/auth';
import {
	Calendar,
	MessageSquare,
	Star,
	Clock,
	FileText,
	Heart,
	Activity,
	Thermometer,
	Weight,
	Bot,
	Loader2,
	CheckCircle,
	XCircle,
	AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

function PatientDashboard() {
	const router = useRouter();
	const { user, logout } = useAuth();

	// State for real appointment data
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [appointmentStats, setAppointmentStats] = useState({
		total: 0,
		pending: 0,
		approved: 0,
		completed: 0,
	});

	// Get patient ID from user
	const getPatientId = () => {
		return user?.user_id || user?._id || (user as any)?.id;
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

	// Fetch appointments
	const fetchAppointments = async () => {
		const patientId = getPatientId();
		if (!patientId) {
			console.warn('⚠️ Cannot fetch appointments: No patient ID');
			setLoading(false);
			return;
		}
		
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patient/${patientId}/appointments`, {
				headers: getAuthHeaders()
			});
			
			if (response.ok) {
				const data = await response.json();
				const fetchedAppointments = data.appointments || [];
				setAppointments(fetchedAppointments);
				
				// Calculate stats
				const stats = {
					total: fetchedAppointments.length,
					pending: fetchedAppointments.filter((apt: Appointment) => apt.status === 'pending').length,
					approved: fetchedAppointments.filter((apt: Appointment) => apt.status === 'approved').length,
					completed: fetchedAppointments.filter((apt: Appointment) => apt.status === 'completed').length,
				};
				setAppointmentStats(stats);
			} else {
				console.error('❌ Failed to fetch appointments:', response.status);
			}
		} catch (error) {
			console.error('❌ Error fetching appointments:', error);
		} finally {
			setLoading(false);
		}
	};

	// Load data on component mount
	useEffect(() => {
		if (user && getPatientId() && authService.isAuthenticated()) {
			fetchAppointments();
		} else {
			setLoading(false);
		}
	}, [user]);

	// Helper function to get next appointment
	const getNextAppointment = () => {
		const today = new Date();
		const upcomingAppointments = appointments
			.filter(apt => apt.status === 'approved' || apt.status === 'pending')
			.filter(apt => new Date(apt.date) >= today)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		
		return upcomingAppointments[0] || null;
	};

	// Helper function to format date for display
	const formatDateForDisplay = (dateString: string) => {
		const appointmentDate = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		
		if (appointmentDate.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			// Format as "Fri 20 August"
			const options: Intl.DateTimeFormatOptions = {
				weekday: 'short',
				day: 'numeric',
				month: 'long'
			};
			return appointmentDate.toLocaleDateString('en-US', options);
		}
	};

	const nextAppointment = getNextAppointment();

	const sidebarItems = [
		{
			icon: Activity,
			label: 'Dashboard',
			href: '/patient/dashboard',
			active: true,
		},
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
	];

	const userInfo = {
		name: user
			? `${user.first_name} ${user.last_name}`.toUpperCase()
			: 'JOHN DOE',
		id: user ? `Patient ID: ${(user._id || user.user_id || 'Unknown').slice(-6)}` : 'Patient ID: P001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback: user ? `${user.first_name[0]}${user.last_name[0]}` : 'JD',
		role: 'Patient',
	};

	// Get upcoming appointments (next 5)
	const getUpcomingAppointments = () => {
		const today = new Date();
		return appointments
			.filter(apt => apt.status === 'approved' || apt.status === 'pending')
			.filter(apt => new Date(apt.date) >= today)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.slice(0, 5);
	};

	const upcomingAppointments = getUpcomingAppointments();

	// Helper function to get status badge
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

	const healthMetrics = [
		{
			label: 'Heart Rate',
			value: '72 bpm',
			icon: Heart,
			color: 'text-red-500',
		},
		{
			label: 'Blood Pressure',
			value: '120/80',
			icon: Activity,
			color: 'text-blue-500',
		},
		{
			label: 'Temperature',
			value: '98.6°F',
			icon: Thermometer,
			color: 'text-orange-500',
		},
		{
			label: 'Weight',
			value: '165 lbs',
			icon: Weight,
			color: 'text-green-500',
		},
	];

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Patient Dashboard"
		>
			{/* Quick Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Next Appointment</p>
								{loading ? (
									<div className="flex items-center space-x-2">
										<Loader2 className="w-4 h-4 animate-spin" />
										<span className="text-sm">Loading...</span>
									</div>
								) : nextAppointment ? (
									<>
										<p className="text-lg sm:text-2xl font-bold text-blue-600">
											{formatDateForDisplay(nextAppointment.date)}
										</p>
										<p className="text-xs sm:text-sm text-gray-500">{nextAppointment.time}</p>
									</>
								) : (
									<>
										<p className="text-lg sm:text-2xl font-bold text-gray-400">
											None
										</p>
										<p className="text-xs sm:text-sm text-gray-500">Book one</p>
									</>
								)}
							</div>
							<Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Appointments</p>
								<p className="text-lg sm:text-2xl font-bold text-green-600">
									{loading ? '...' : appointmentStats.total}
								</p>
								<p className="text-xs sm:text-sm text-gray-500">All time</p>
							</div>
							<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Pending</p>
								<p className="text-lg sm:text-2xl font-bold text-orange-600">
									{loading ? '...' : appointmentStats.pending}
								</p>
								<p className="text-xs sm:text-sm text-gray-500">Awaiting approval</p>
							</div>
							<Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Completed</p>
								<p className="text-lg sm:text-2xl font-bold text-purple-600">
									{loading ? '...' : appointmentStats.completed}
								</p>
								<p className="text-xs sm:text-sm text-gray-500">Visits done</p>
							</div>
							<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Upcoming Appointments */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-lg sm:text-xl">
								Upcoming Appointments
							</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push('/patient/appointments')}
								className="text-xs sm:text-sm"
							>
								View All
							</Button>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-6 h-6 animate-spin mr-2" />
									<span>Loading appointments...</span>
								</div>
							) : upcomingAppointments.length === 0 ? (
								<div className="text-center py-8">
									<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500 mb-4">No upcoming appointments</p>
									<Button 
										size="sm"
										onClick={() => router.push('/patient/appointments')}
									>
										Book Your First Appointment
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									{upcomingAppointments.map((appointment) => (
										<div
											key={appointment._id}
											className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
										>
											<div className="flex items-center space-x-3 sm:space-x-4">
												<Avatar className="w-10 h-10 sm:w-12 sm:h-12">
													<AvatarImage src="/placeholder.svg?height=48&width=48" />
													<AvatarFallback>
														{appointment.doctor_name
															.split(' ')
															.map((n: string) => n[0])
															.join('')}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<h4 className="font-semibold text-sm sm:text-base">
														{appointment.doctor_name}
													</h4>
													<p className="text-xs sm:text-sm text-gray-600">
														{appointment.doctor_specialty}
													</p>
													<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mt-1">
														<div className="flex items-center">
															<Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
															<span>{formatDateForDisplay(appointment.date)}</span>
														</div>
														<div className="flex items-center">
															<Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
															<span>{appointment.time}</span>
														</div>
													</div>
												</div>
											</div>
											<div className="flex flex-col items-start sm:items-end space-y-2">
												{getStatusBadge(appointment.status)}
												<Button
													size="sm"
													variant="outline"
													className="w-full sm:w-auto text-xs"
													onClick={() => router.push('/patient/appointments')}
												>
													View Details
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Health Metrics */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								Health Metrics
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{healthMetrics.map((metric, index) => (
									<div key={index} className="flex items-center space-x-3">
										<div
											className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}
										>
											<metric.icon className="w-4 h-4 sm:w-5 sm:h-5" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">
												{metric.label}
											</p>
											<p className="text-lg sm:text-xl font-bold text-gray-700">
												{metric.value}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className="mt-6">
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								Quick Actions
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button
								className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
								onClick={() => router.push('/patient/appointments')}
							>
								<Calendar className="w-4 h-4 mr-2" />
								Book Appointment
							</Button>
							<Button
								className="w-full justify-start"
								variant="outline"
								onClick={() => router.push('/patient/chatbot')}
							>
								<Bot className="w-4 h-4 mr-2" />
								Chat with AI Assistant
							</Button>
							<Button
								className="w-full justify-start"
								variant="outline"
								onClick={() => router.push('/patient/records')}
							>
								<FileText className="w-4 h-4 mr-2" />
								View Medical Records
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Activity */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className="w-4 h-4 animate-spin mr-2" />
							<span className="text-sm">Loading activity...</span>
						</div>
					) : appointments.length === 0 ? (
						<div className="text-center py-4">
							<p className="text-gray-500">No recent activity</p>
						</div>
					) : (
						<div className="space-y-4">
							{appointments
								.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
								.slice(0, 5)
								.map((appointment, index) => {
									const timeAgo = () => {
										const now = new Date();
										const created = new Date(appointment.created_at);
										const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
										
										if (diffInMinutes < 60) {
											return `${diffInMinutes} minutes ago`;
										} else if (diffInMinutes < 1440) {
											return `${Math.floor(diffInMinutes / 60)} hours ago`;
										} else {
											return `${Math.floor(diffInMinutes / 1440)} days ago`;
										}
									};

									const getActivityColor = () => {
										switch (appointment.status) {
											case 'approved': return 'bg-green-500';
											case 'completed': return 'bg-blue-500';
											case 'cancelled': return 'bg-red-500';
											case 'rejected': return 'bg-red-500';
											default: return 'bg-yellow-500';
										}
									};

									const getActivityText = () => {
										switch (appointment.status) {
											case 'approved': return `Appointment with ${appointment.doctor_name} approved`;
											case 'completed': return `Consultation with ${appointment.doctor_name} completed`;
											case 'cancelled': return `Appointment with ${appointment.doctor_name} cancelled`;
											case 'rejected': return `Appointment with ${appointment.doctor_name} rejected`;
											default: return `Appointment scheduled with ${appointment.doctor_name}`;
										}
									};

									return (
										<div key={appointment._id} className="flex items-center space-x-3 text-sm">
											<div className={`w-2 h-2 rounded-full ${getActivityColor()}`}></div>
											<span className="flex-1">{getActivityText()}</span>
											<span className="text-gray-500 text-xs">{timeAgo()}</span>
										</div>
									);
								})
							}
						</div>
					)}
				</CardContent>
			</Card>
		</ResponsiveDashboardLayout>
	);
}

export default function ProtectedPatientDashboard() {
	return (
		<ProtectedRoute allowedRoles={['patient']}>
			<PatientDashboard />
		</ProtectedRoute>
	);
}
