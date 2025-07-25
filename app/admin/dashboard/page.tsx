'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
	const router = useRouter();

	const sidebarItems = [
		{
			icon: Activity,
			label: 'Dashboard',
			href: '/admin/dashboard',
			active: true,
		},
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge: '5',
		},
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	const userInfo = {
		name: 'ADMIN USER',
		id: 'Admin ID: A001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback: 'AU',
		role: 'Hospital Administrator',
	};

	const stats = [
		{
			label: 'Total Patients',
			value: '1,234',
			change: '+12%',
			icon: Users,
			color: 'text-blue-600',
		},
		{
			label: 'Active Doctors',
			value: '45',
			change: '+3%',
			icon: UserCheck,
			color: 'text-green-600',
		},
		{
			label: 'Appointments Today',
			value: '89',
			change: '+8%',
			icon: Calendar,
			color: 'text-purple-600',
		},
		{
			label: 'Pending Reviews',
			value: '23',
			change: '-5%',
			icon: Clock,
			color: 'text-orange-600',
		},
	];

	const recentAppointments = [
		{
			id: 1,
			patient: 'John Doe',
			doctor: 'Dr. Sarah Johnson',
			time: '10:00 AM',
			status: 'confirmed',
			type: 'Check-up',
		},
		{
			id: 2,
			patient: 'Jane Smith',
			doctor: 'Dr. Michael Chen',
			time: '11:30 AM',
			status: 'pending',
			type: 'Consultation',
		},
		{
			id: 3,
			patient: 'Bob Wilson',
			doctor: 'Dr. Emily Davis',
			time: '2:00 PM',
			status: 'completed',
			type: 'Follow-up',
		},
	];

	const feedbackCategories = [
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
														.map((n) => n[0])
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
								{feedbackCategories.map((item, index) => (
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
