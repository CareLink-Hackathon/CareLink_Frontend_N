'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { doctorService } from '@/lib/services/doctor-service';
import {
	Calendar,
	Users,
	Activity,
	FileText,
	Bell,
	Settings,
	HelpCircle,
	Clock,
	CheckCircle,
	User,
	Stethoscope,
	AlertTriangle,
	TrendingUp,
	Eye,
	UserCheck,
	RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardStats {
	total_appointments: number;
	today_appointments: number;
	pending_appointments: number;
	approved_appointments: number;
	completed_appointments: number;
	upcoming_appointments: number;
	this_week_appointments: number;
	this_month_appointments: number;
	recent_patients_count: number;
}

interface TodayAppointment {
	_id: string;
	patient_id: string;
	patient_name: string;
	patient_email: string;
	type: string;
	time: string;
	reason_for_visit: string;
	status: string;
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

function DoctorDashboard() {
	const router = useRouter();
	const { user } = useAuth();
	
	// State management
	const [loading, setLoading] = useState(true);
	const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
	const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
	const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Get doctor ID from user
	const getDoctorId = () => {
		return user?.user_id || user?._id || (user as any)?.id;
	};

	// Load dashboard data
	const loadDashboardData = async () => {
		const doctorId = getDoctorId();
		if (!doctorId) {
			console.warn('⚠️ No doctor ID found');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log('🚀 Loading dashboard data for doctor:', doctorId);

			// Load all data in parallel
			const [stats, appointments] = await Promise.all([
				doctorService.getDashboardStats(doctorId),
				doctorService.getTodayAppointments(doctorId)
			]);

			console.log('📊 Dashboard stats loaded:', stats);
			console.log('📅 Today appointments loaded:', appointments);

			setDashboardStats(stats);
			setTodayAppointments(appointments);

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
			console.error('❌ Error loading dashboard data:', error);
			setError('Failed to load dashboard data');
		} finally {
			setLoading(false);
		}
	};

	// Load data on component mount
	useEffect(() => {
		if (user?.role === 'doctor') {
			console.log('🚀 DoctorDashboard - Loading data for doctor:', user);
			loadDashboardData();
		} else {
			console.log('❌ DoctorDashboard - User is not a doctor:', user);
			setLoading(false);
		}
	}, [user]);

	const sidebarItems = [
		{
			icon: Activity,
			label: 'Dashboard',
			href: '/doctor/dashboard',
			active: true,
		},
		{ icon: Calendar, label: 'My Appointments', href: '/doctor/appointments' },
		{ icon: Users, label: 'My Patients', href: '/doctor/patients' },
		{ icon: FileText, label: 'Medical Records', href: '/doctor/records' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/doctor/notifications',
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
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

	// Helper functions
	const getStatusBadge = (status: string) => {
		const statusConfig = {
			pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
			approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
			completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
			cancelled: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
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

	const getCurrentTime = () => {
		return new Date().toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	const getCurrentDate = () => {
		return new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Loading state
	if (loading) {
		return (
			<ProtectedRoute allowedRoles={['doctor']}>
				<ResponsiveDashboardLayout
					sidebarItems={sidebarItems}
					userInfo={userInfo}
					pageTitle="Doctor Dashboard"
				>
					<div className="flex items-center justify-center h-64">
						<RefreshCw className="w-8 h-8 animate-spin mr-2" />
						<span>Loading dashboard...</span>
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
					pageTitle="Doctor Dashboard"
				>
					<div className="text-center py-8">
						<AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
						<p className="text-gray-600 mb-4">{error}</p>
						<Button onClick={loadDashboardData} variant="outline">
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
				pageTitle="Doctor Dashboard"
			>
				{/* Header Section */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
								Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},
								{doctorProfile ? ` Dr. ${doctorProfile.first_name}` : ' Doctor'}!
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Today is {getCurrentDate()} • {getCurrentTime()}
							</p>
							{doctorProfile && (
								<p className="text-xs sm:text-sm text-blue-600 mt-1">
									{doctorProfile.specialty} • {doctorProfile.department.name}
								</p>
							)}
						</div>
						
						<div className="flex gap-2">
							<Button
								onClick={loadDashboardData}
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
							>
								<RefreshCw className="w-4 h-4" />
								Refresh
							</Button>
							<Button
								onClick={() => router.push('/doctor/appointments')}
								size="sm"
								className="flex items-center gap-2"
							>
								<Calendar className="w-4 h-4" />
								View All Appointments
							</Button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
					<Card>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total Appointments</p>
									<p className="text-lg sm:text-2xl font-bold">
										{dashboardStats?.total_appointments || 0}
									</p>
									<p className="text-xs text-gray-500">All time</p>
								</div>
								<Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Today's Appointments</p>
									<p className="text-lg sm:text-2xl font-bold text-blue-600">
										{dashboardStats?.today_appointments || 0}
									</p>
									<p className="text-xs text-gray-500">Scheduled for today</p>
								</div>
								<Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Completed</p>
									<p className="text-lg sm:text-2xl font-bold text-green-600">
										{dashboardStats?.completed_appointments || 0}
									</p>
									<p className="text-xs text-gray-500">This month</p>
								</div>
								<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Pending</p>
									<p className="text-lg sm:text-2xl font-bold text-orange-600">
										{dashboardStats?.pending_appointments || 0}
									</p>
									<p className="text-xs text-gray-500">Awaiting action</p>
								</div>
								<Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Today's Appointments */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
								<CardTitle className="text-lg sm:text-xl">
									Today's Schedule
								</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={() => router.push('/doctor/appointments')}
									className="text-xs sm:text-sm"
								>
									View All
								</Button>
							</CardHeader>
							<CardContent>
								{todayAppointments.length === 0 ? (
									<div className="text-center py-8">
										<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
										<p className="text-gray-500 mb-4">No appointments scheduled for today</p>
										<p className="text-sm text-gray-400">Take some time to review patient records or prepare for upcoming appointments.</p>
									</div>
								) : (
									<div className="space-y-4">
										{todayAppointments.slice(0, 4).map((appointment) => (
											<div
												key={appointment._id}
												className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0"
											>
												<div className="flex items-center space-x-3 sm:space-x-4">
													<Avatar className="w-10 h-10 sm:w-12 sm:h-12">
														<AvatarImage src="/placeholder.svg?height=48&width=48" />
														<AvatarFallback>
															{appointment.patient_name
																.split(' ')
																.map((n) => n[0])
																.join('')
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0 flex-1">
														<h4 className="font-semibold text-sm sm:text-base">
															{appointment.patient_name}
														</h4>
														<p className="text-xs sm:text-sm text-gray-600">
															{appointment.type}
														</p>
														<p className="text-xs text-gray-500 truncate">
															{appointment.reason_for_visit}
														</p>
													</div>
												</div>
												<div className="flex flex-col items-start sm:items-end space-y-2">
													<div className="flex items-center space-x-2">
														<p className="font-medium text-sm sm:text-base">
															{formatTime(appointment.time)}
														</p>
														{getStatusBadge(appointment.status)}
													</div>
													<div className="flex gap-2">
														{appointment.status === 'pending' && (
															<>
																<Button
																	size="sm"
																	className="bg-green-600 hover:bg-green-700 text-xs"
																	onClick={() => router.push(`/doctor/appointments?action=approve&id=${appointment._id}`)}
																>
																	Approve
																</Button>
																<Button
																	size="sm"
																	variant="outline"
																	className="text-xs"
																	onClick={() => router.push(`/doctor/appointments?action=view&id=${appointment._id}`)}
																>
																	<Eye className="w-3 h-3 mr-1" />
																	View
																</Button>
															</>
														)}
														{appointment.status === 'approved' && (
															<Button
																size="sm"
																className="bg-blue-600 hover:bg-blue-700 text-xs"
																onClick={() => router.push(`/doctor/appointments?action=start&id=${appointment._id}`)}
															>
																Start
															</Button>
														)}
														{appointment.status === 'completed' && (
															<Button
																size="sm"
																variant="outline"
																className="text-xs"
																onClick={() => router.push(`/doctor/patients/${appointment.patient_id}`)}
															>
																<User className="w-3 h-3 mr-1" />
																View Patient
															</Button>
														)}
													</div>
												</div>
											</div>
										))}
										{todayAppointments.length > 4 && (
											<div className="text-center pt-4">
												<Button
													variant="outline"
													size="sm"
													onClick={() => router.push('/doctor/appointments')}
													className="text-xs"
												>
													View {todayAppointments.length - 4} more appointments
												</Button>
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Quick Stats & Actions */}
					<div className="space-y-6">
						{/* This Week Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									This Week
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Appointments</span>
									<span className="font-semibold">{dashboardStats?.this_week_appointments || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Patients</span>
									<span className="font-semibold">{dashboardStats?.recent_patients_count || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Completion Rate</span>
									<span className="font-semibold text-green-600">
										{dashboardStats?.completed_appointments && dashboardStats?.total_appointments
											? Math.round((dashboardStats.completed_appointments / dashboardStats.total_appointments) * 100)
											: 0}%
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									className="w-full justify-start"
									variant="outline"
									onClick={() => router.push('/doctor/appointments')}
								>
									<Calendar className="w-4 h-4 mr-2" />
									View All Appointments
								</Button>
								<Button
									className="w-full justify-start"
									variant="outline"
									onClick={() => router.push('/doctor/patients')}
								>
									<Users className="w-4 h-4 mr-2" />
									Manage Patients
								</Button>
								<Button
									className="w-full justify-start"
									variant="outline"
									onClick={() => router.push('/doctor/appointments?filter=pending')}
								>
									<Clock className="w-4 h-4 mr-2" />
									Pending Approvals ({dashboardStats?.pending_appointments || 0})
								</Button>
								<Button
									className="w-full justify-start"
									variant="outline"
									onClick={() => router.push('/doctor/records')}
								>
									<FileText className="w-4 h-4 mr-2" />
									Medical Records
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}

export default function ProtectedDoctorDashboard() {
	return <DoctorDashboard />;
}
