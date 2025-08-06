'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import {
	Calendar,
	Users,
	Activity,
	FileText,
	UserCheck,
	Clock,
	Bell,
	Settings,
	HelpCircle,
	AlertTriangle,
	Droplets,
	Building2,
	Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '@/lib/services/admin-service';

function AdminDashboard() {
	console.log('=== AdminDashboard component rendered ===');
	
	const router = useRouter();
	const { user } = useAuth();
	
	console.log('Current user from useAuth:', user);
	console.log('User ID:', user?.user_id || user?._id);
	console.log('User account type:', user?.role || user?.account_type);
	console.log('Is admin?:', (user as any)?.isAdmin);
	
	// Local state for dashboard data
	const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
	const [appointments, setAppointments] = useState<any[]>([]);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [patients, setPatients] = useState<any[]>([]);
	const [departments, setDepartments] = useState<any[]>([]);
	const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
	const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
	const [feedbackAnalysis, setFeedbackAnalysis] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load all data
	useEffect(() => {
		console.log('=== useEffect triggered ===');
		console.log('User in useEffect:', user);
		
		const loadData = async () => {
			console.log('=== loadData function called ===');
			
			// Fix the property names - user has user_id and role, not _id and account_type
			const userId = user?.user_id || user?._id;
			const userRole = user?.role || user?.account_type;
			
			console.log('User check:', {
				userId: userId,
				userRole: userRole,
				hasUser: !!user,
				condition: userId && (userRole === 'hospital' || userRole === 'admin')
			});
			
			if (!userId || (userRole !== 'hospital' && userRole !== 'admin')) {
				console.log('❌ Skipping data load - user check failed');
				setLoading(false);
				return;
			}

			try {
				console.log('✅ Starting data load...');
				setLoading(true);
				setError(null);

				console.log('Loading dashboard data for admin:', userId);

				// Load dashboard stats
				console.log('📊 Calling getDashboardStats...');
				const stats = await adminService.getDashboardStats(userId);
				console.log('Dashboard stats loaded:', stats);
				setDashboardStats(stats);

				// Load appointments
				console.log('📅 Calling getAllAppointments...');
				const appointmentsData = await adminService.getAllAppointments(userId);
				console.log('Appointments loaded:', appointmentsData);
				setAppointments(appointmentsData);

				// Load doctors
				console.log('👩‍⚕️ Calling getDoctors...');
				const doctorsData = await adminService.getDoctors(userId);
				console.log('Doctors loaded:', doctorsData);
				setDoctors(doctorsData);

				// Load patients
				console.log('🏥 Calling getPatients...');
				const patientsData = await adminService.getPatients(userId);
				console.log('Patients loaded:', patientsData);
				setPatients(patientsData);

				// Load recent appointments for dashboard
				console.log('📅 Loading recent appointments...');
				const recentAppointmentsData = await adminService.getRecentAppointments();
				console.log('Recent appointments loaded:', recentAppointmentsData);
				setRecentAppointments(recentAppointmentsData);

				// Load recent feedback with analysis
				console.log('💬 Loading recent feedback...');
				const feedbackData = await adminService.getRecentFeedbackWithAnalysis();
				console.log('Recent feedback loaded:', feedbackData);
				setRecentFeedback(feedbackData.feedback);
				setFeedbackAnalysis(feedbackData.sentiment_analysis);

			} catch (err) {
				console.error('❌ Error loading dashboard data:', err);
				setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
			} finally {
				console.log('✅ Data loading completed, setting loading to false');
				setLoading(false);
			}
		};

		loadData();
	}, [user]);

	// Show loading screen on initial load
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
					<div className="text-lg font-medium text-gray-900 mb-2">
						Loading Dashboard
					</div>
					<p className="text-gray-600">
						Fetching real-time hospital metrics...
					</p>
				</div>
			</div>
		);
	}

	// Show error state if there's an error
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						Error loading admin dashboard
					</div>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	const sidebarItems = [
		{
			icon: Activity,
			label: 'Dashboard',
			href: '/admin/dashboard',
			active: true,
		},
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Building2, label: 'Departments', href: '/admin/departments' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge: '0', // Will be updated when notifications are implemented
		},
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	const userInfo = {
		name:
			user?.first_name && user?.last_name
				? `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
				: 'ADMIN USER',
		id: user?._id ? `Admin ID: ${user._id.slice(-6)}` : 'Admin ID: A001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback:
			user?.first_name && user?.last_name
				? `${user.first_name[0]}${user.last_name[0]}`
				: 'AU',
		role: user?.hospital_name
			? `${user.hospital_name} Administrator`
			: 'Hospital Administrator',
	};

	// Use real data from backend dashboard stats
	const stats = [
		{
			label: 'Total Patients',
			value: dashboardStats?.totalPatients?.toString() || '0',
			change: dashboardStats?.recentPatients ? `+${dashboardStats.recentPatients} this month` : 'No recent data',
			icon: Users,
			color: 'text-blue-600',
		},
		{
			label: 'Active Doctors', 
			value: dashboardStats?.activeDoctors?.toString() || '0',
			change: dashboardStats?.recentDoctors ? `+${dashboardStats.recentDoctors} this month` : 'No recent data',
			icon: UserCheck,
			color: 'text-green-600',
		},
		{
			label: 'Departments',
			value: dashboardStats?.totalDepartments?.toString() || '0',
			change: 'Total departments',
			icon: Building2,
			color: 'text-purple-600',
		},
		{
			label: 'Pending Appointments',
			value: dashboardStats?.pendingAppointments?.toString() || '0',
			change: dashboardStats?.pendingAppointments && dashboardStats?.totalAppointments 
				? `${Math.round((dashboardStats.pendingAppointments / dashboardStats.totalAppointments) * 100)}% of total`
				: '0% of total',
			icon: Clock,
			color: 'text-orange-600',
		},
	];

	// Feedback categories from backend dashboard stats
	const feedbackCategories = dashboardStats?.feedbackCategories || [];

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Hospital Dashboard"
		>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Hospital Dashboard
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Monitor hospital operations and performance
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div className="min-w-0 flex-1">
									<p className="text-sm text-gray-600 truncate">{stat.label}</p>
									<p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
									<p className="text-xs sm:text-sm text-gray-500">
										{stat.change}
									</p>
								</div>
								<div
									className={`p-2 sm:p-3 rounded-lg bg-gray-100 ${stat.color} flex-shrink-0`}
								>
									<stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Appointments */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-lg sm:text-xl">
								Recent Appointments
							</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push('/admin/appointments')}
								className="text-xs sm:text-sm"
							>
								View All
							</Button>
						</CardHeader>
						<CardContent>
							{recentAppointments.length > 0 ? (
								<div className="space-y-4">
									{recentAppointments.map((appointment: any) => (
										<div
											key={appointment._id}
											className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
										>
											<div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
												<Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
													<AvatarImage src="/placeholder.svg?height=40&width=40" />
													<AvatarFallback>
														{appointment.patient_name
															?.split(' ')
															.map((n: string) => n[0])
															.join('') || 'PA'}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<h4 className="font-semibold text-sm sm:text-base truncate">
														{appointment.patient_name || 'Unknown Patient'}
													</h4>
													<p className="text-xs sm:text-sm text-gray-600 truncate">
														{appointment.doctor_name || 'Unknown Doctor'}
													</p>
													<p className="text-xs text-gray-500 truncate">
														{appointment.specialty || appointment.type || 'General'}
													</p>
												</div>
											</div>
											<div className="text-right flex-shrink-0">
												<p className="font-medium text-sm sm:text-base">
													{appointment.time || 'TBD'}
												</p>
												<p className="text-xs text-gray-500 mb-1">
													{appointment.date || 'TBD'}
												</p>
												<Badge
													className={
														appointment.status === 'confirmed' || appointment.status === 'approved'
															? 'bg-green-100 text-green-800'
															: appointment.status === 'pending'
															? 'bg-yellow-100 text-yellow-800'
															: appointment.status === 'completed'
															? 'bg-blue-100 text-blue-800'
															: 'bg-gray-100 text-gray-800'
													}
												>
													{appointment.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500">No recent appointments</p>
									<Button
										variant="outline"
										size="sm"
										onClick={() => router.push('/admin/appointments')}
										className="mt-2"
									>
										View All Appointments
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Recent Feedback Analysis */}
				<div>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-lg sm:text-xl">
								Recent Feedback
							</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push('/admin/feedback')}
								className="text-xs sm:text-sm"
							>
								View All
							</Button>
						</CardHeader>
						<CardContent>
							{/* Sentiment Overview */}
							{feedbackAnalysis && (
								<div className="mb-4 p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium">Sentiment Overview</span>
										<span className="text-xs text-gray-500">{feedbackAnalysis.total_feedback} total</span>
									</div>
									<div className="flex space-x-4 text-sm">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
											<span className="text-green-700">{feedbackAnalysis.positive_percentage}% Positive</span>
										</div>
										<div className="flex items-center">
											<div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
											<span className="text-red-700">{feedbackAnalysis.negative_percentage}% Negative</span>
										</div>
									</div>
								</div>
							)}

							{/* Recent Feedback List */}
							{recentFeedback.length > 0 ? (
								<div className="space-y-3">
									{recentFeedback.map((feedback: any) => (
										<div
											key={feedback._id}
											className="p-3 border rounded-lg"
										>
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center space-x-2">
													<Avatar className="w-6 h-6 flex-shrink-0">
														<AvatarFallback className="text-xs">
															{feedback.patient_name
																?.split(' ')
																.map((n: string) => n[0])
																.join('') || 'PA'}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="text-sm font-medium">{feedback.patient_name}</p>
														<p className="text-xs text-gray-500">
															{feedback.doctor_name} • {feedback.doctor_specialty}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{/* Star Rating */}
													<div className="flex">
														{[1, 2, 3, 4, 5].map((star) => (
															<svg
																key={star}
																className={`w-3 h-3 ${
																	star <= feedback.rating
																		? 'text-yellow-400 fill-current'
																		: 'text-gray-300'
																}`}
																viewBox="0 0 20 20"
															>
																<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
															</svg>
														))}
													</div>
													{/* Sentiment Badge */}
													<Badge
														className={
															feedback.is_positive
																? 'bg-green-100 text-green-800'
																: 'bg-red-100 text-red-800'
														}
													>
														{feedback.sentiment}
													</Badge>
												</div>
											</div>
											<p className="text-sm text-gray-600 line-clamp-2">
												{feedback.message}
											</p>
											<div className="flex justify-between items-center mt-2">
												<span className="text-xs text-gray-400">
													{feedback.source === 'doctor_review' ? 'Doctor Review' : 'General Feedback'}
												</span>
												<span className="text-xs text-gray-400">
													{new Date(feedback.created_at).toLocaleDateString()}
												</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500 mb-2">No recent feedback</p>
									<p className="text-xs text-gray-400">
										Feedback will appear here once patients start submitting reviews
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Additional Metrics */}
					<Card className="mt-6">
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								System Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-3 bg-blue-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">
										{dashboardStats?.completedAppointments || '0'}
									</div>
									<div className="text-xs text-blue-700">Completed</div>
								</div>
								<div className="text-center p-3 bg-green-50 rounded-lg">
									<div className="text-2xl font-bold text-green-600">
										{dashboardStats?.totalFeedback || '0'}
									</div>
									<div className="text-xs text-green-700">Feedback</div>
								</div>
							</div>
							{dashboardStats?.negativeFeedback !== undefined && (
								<div className="pt-2 border-t">
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Negative Feedback</span>
										<span className={`text-sm font-medium ${
											dashboardStats.negativeFeedback > 0 ? 'text-red-600' : 'text-green-600'
										}`}>
											{dashboardStats.negativeFeedback}
										</span>
									</div>
									{dashboardStats.totalFeedback > 0 && (
										<Progress 
											value={(dashboardStats.negativeFeedback / dashboardStats.totalFeedback) * 100} 
											className="h-2 mt-1" 
										/>
									)}
								</div>
							)}
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
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
								onClick={() => router.push('/admin/doctors')}
							>
								<Users className="w-4 h-4 mr-2" />
								Manage Doctors
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
								onClick={() => router.push('/admin/appointments')}
							>
								<Calendar className="w-4 h-4 mr-2" />
								View Appointments
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
								onClick={() => router.push('/admin/patients')}
							>
								<UserCheck className="w-4 h-4 mr-2" />
								Manage Patients
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
								onClick={() => router.push('/admin/feedback')}
							>
								<FileText className="w-4 h-4 mr-2" />
								View Feedback
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</ResponsiveDashboardLayout>
	);
}

export default function ProtectedAdminDashboard() {
	return (
		<ProtectedRoute allowedRoles={['admin', 'hospital']}>
			<AdminDashboard />
		</ProtectedRoute>
	);
}
