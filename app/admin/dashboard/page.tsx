'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAdmin } from '@/lib/contexts/admin-context';
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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
	const router = useRouter();
	const { user } = useAuth();
	const {
		dashboardStats,
		appointments,
		feedbackAnalytics,
		unreadNotifications,
		loading,
		error,
		loadDashboardStats,
		loadAppointments,
		loadFeedbackAnalytics,
	} = useAdmin();

	// Load data on component mount
	useEffect(() => {
		if (user?.account_type === 'hospital' && (user as any).isAdmin) {
			loadDashboardStats();
			loadAppointments();
			loadFeedbackAnalytics();
		}
	}, [user]);

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
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge:
				unreadNotifications > 0 ? unreadNotifications.toString() : undefined,
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

	// Use real data from context or fallback to defaults
	const stats = [
		{
			label: 'Total Patients',
			value: dashboardStats?.totalPatients.toString() || '0',
			change: '+12%', // Would need historical data
			icon: Users,
			color: 'text-blue-600',
		},
		{
			label: 'Active Doctors',
			value: dashboardStats?.totalDoctors.toString() || '0',
			change: '+3%',
			icon: UserCheck,
			color: 'text-green-600',
		},
		{
			label: 'Appointments Today',
			value: dashboardStats?.totalAppointments.toString() || '0',
			change: '+8%',
			icon: Calendar,
			color: 'text-purple-600',
		},
		{
			label: 'Pending Reviews',
			value: dashboardStats?.pendingAppointments.toString() || '0',
			change: '-5%',
			icon: Clock,
			color: 'text-orange-600',
		},
	];

	// Recent appointments from context
	const recentAppointments = appointments.slice(0, 3).map((apt: any) => ({
		id: apt._id,
		patient: apt.patient_name || apt.user_email.split('@')[0],
		doctor: apt.doctor_name || apt.doctor,
		time: apt.time,
		status: apt.status,
		type: apt.type,
	}));

	// Feedback categories from context
	const feedbackCategories = feedbackAnalytics?.categoryBreakdown || [
		{ category: 'Wait Time', count: 45, percentage: 35, color: 'bg-red-500' },
		{
			category: 'Staff Behavior',
			count: 32,
			percentage: 25,
			color: 'bg-orange-500',
		},
		{
			category: 'Facility Cleanliness',
			count: 28,
			percentage: 22,
			color: 'bg-yellow-500',
		},
		{
			category: 'Appointment Scheduling',
			count: 23,
			percentage: 18,
			color: 'bg-blue-500',
		},
	];

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
									<p
										className={`text-xs sm:text-sm ${
											stat.change.startsWith('+')
												? 'text-green-600'
												: 'text-red-600'
										}`}
									>
										{stat.change} from last month
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
							<div className="space-y-4">
								{recentAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
											<Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
												<AvatarImage src="/placeholder.svg?height=40&width=40" />
												<AvatarFallback>
													{appointment.patient
														.split(' ')
														.map((n: string) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0 flex-1">
												<h4 className="font-semibold text-sm sm:text-base truncate">
													{appointment.patient}
												</h4>
												<p className="text-xs sm:text-sm text-gray-600 truncate">
													{appointment.doctor}
												</p>
												<p className="text-xs text-gray-500 truncate">
													{appointment.type}
												</p>
											</div>
										</div>
										<div className="text-right flex-shrink-0">
											<p className="font-medium text-sm sm:text-base">
												{appointment.time}
											</p>
											<Badge
												className={
													appointment.status === 'confirmed'
														? 'bg-green-100 text-green-800'
														: appointment.status === 'pending'
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-gray-100 text-gray-800'
												}
											>
												{appointment.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Feedback Analytics */}
				<div>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
							<CardTitle className="text-lg sm:text-xl">
								Top Feedback Categories
							</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => router.push('/admin/feedback')}
								className="text-xs sm:text-sm"
							>
								Details
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{loading ? (
									<div className="flex items-center justify-center py-8">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
									</div>
								) : feedbackCategories.length > 0 ? (
									feedbackCategories.map((item: any, index: number) => (
										<div key={index} className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-xs sm:text-sm font-medium truncate pr-2">
													{item.category}
												</span>
												<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
													{item.count}
												</span>
											</div>
											<Progress value={item.percentage} className="h-2" />
										</div>
									))
								) : (
									<p className="text-center text-gray-500 py-8">
										No feedback data available
									</p>
								)}
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
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
							>
								<Users className="w-4 h-4 mr-2" />
								Add New Doctor
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
							>
								<Calendar className="w-4 h-4 mr-2" />
								Manage Schedules
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
							>
								<FileText className="w-4 h-4 mr-2" />
								Generate Report
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</ResponsiveDashboardLayout>
	);
}
