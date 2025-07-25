'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
	const router = useRouter();

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
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
	];

	const userInfo = {
		name: 'DR. SARAH JOHNSON',
		id: 'Doctor ID: D001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback: 'SJ',
		role: 'Cardiologist',
	};

	const todayStats = {
		totalAppointments: 12,
		completed: 8,
		ongoing: 1,
		upcoming: 3,
	};

	const todayAppointments = [
		{
			id: 1,
			patient: 'John Doe',
			patientId: 'P001',
			time: '9:00 AM',
			type: 'Check-up',
			status: 'completed',
			duration: '30 min',
		},
		{
			id: 2,
			patient: 'Jane Smith',
			patientId: 'P002',
			time: '10:30 AM',
			type: 'Consultation',
			status: 'ongoing',
			duration: '45 min',
		},
		{
			id: 3,
			patient: 'Bob Wilson',
			patientId: 'P003',
			time: '2:00 PM',
			type: 'Follow-up',
			status: 'upcoming',
			duration: '30 min',
		},
		{
			id: 4,
			patient: 'Alice Brown',
			patientId: 'P004',
			time: '3:30 PM',
			type: 'Check-up',
			status: 'upcoming',
			duration: '30 min',
		},
	];

	const recentPatients = [
		{
			id: 1,
			name: 'John Doe',
			age: 45,
			lastVisit: '2025-01-27',
			condition: 'Hypertension',
			status: 'stable',
		},
		{
			id: 2,
			name: 'Jane Smith',
			age: 32,
			lastVisit: '2025-01-26',
			condition: 'Diabetes',
			status: 'monitoring',
		},
		{
			id: 3,
			name: 'Bob Wilson',
			age: 58,
			lastVisit: '2025-01-25',
			condition: 'Heart Disease',
			status: 'critical',
		},
	];

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Doctor Dashboard"
		>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Good morning, Dr. Johnson!
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Here's your schedule for today, January 28, 2025
				</p>
			</div>

			{/* Today's Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Appointments</p>
								<p className="text-lg sm:text-2xl font-bold">
									{todayStats.totalAppointments}
								</p>
							</div>
							<Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Completed</p>
								<p className="text-lg sm:text-2xl font-bold text-green-600">
									{todayStats.completed}
								</p>
							</div>
							<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Ongoing</p>
								<p className="text-lg sm:text-2xl font-bold text-orange-600">
									{todayStats.ongoing}
								</p>
							</div>
							<Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Upcoming</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-600">
									{todayStats.upcoming}
								</p>
							</div>
							<Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
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
								Today's Appointments
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
							<div className="space-y-4">
								{todayAppointments.map((appointment) => (
									<div
										key={appointment.id}
										className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0"
									>
										<div className="flex items-center space-x-3 sm:space-x-4">
											<Avatar className="w-10 h-10 sm:w-12 sm:h-12">
												<AvatarImage src="/placeholder.svg?height=48&width=48" />
												<AvatarFallback>
													{appointment.patient
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0 flex-1">
												<h4 className="font-semibold text-sm sm:text-base">
													{appointment.patient}
												</h4>
												<p className="text-xs sm:text-sm text-gray-600">
													ID: {appointment.patientId}
												</p>
												<p className="text-xs text-gray-500">
													{appointment.type} • {appointment.duration}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-start sm:items-end space-y-2">
											<div className="flex items-center space-x-2">
												<p className="font-medium text-sm sm:text-base">
													{appointment.time}
												</p>
												<Badge
													className={
														appointment.status === 'completed'
															? 'bg-green-100 text-green-800'
															: appointment.status === 'ongoing'
															? 'bg-orange-100 text-orange-800'
															: 'bg-blue-100 text-blue-800'
													}
												>
													{appointment.status}
												</Badge>
											</div>
											{appointment.status === 'ongoing' && (
												<Button
													size="sm"
													className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-xs"
												>
													Continue
												</Button>
											)}
											{appointment.status === 'upcoming' && (
												<Button
													size="sm"
													variant="outline"
													className="w-full sm:w-auto text-xs"
												>
													Start
												</Button>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Patients */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg sm:text-xl">
								Recent Patients
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentPatients.map((patient) => (
									<div
										key={patient.id}
										className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
									>
										<Avatar className="w-8 h-8 sm:w-10 sm:h-10">
											<AvatarImage src="/placeholder.svg?height=40&width=40" />
											<AvatarFallback>
												{patient.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<h4 className="font-semibold text-xs sm:text-sm truncate">
												{patient.name}
											</h4>
											<p className="text-xs text-gray-600">
												Age: {patient.age}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{patient.condition}
											</p>
										</div>
										<Badge
											className={
												patient.status === 'stable'
													? 'bg-green-100 text-green-800'
													: patient.status === 'monitoring'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'
											}
										>
											{patient.status}
										</Badge>
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
								<FileText className="w-4 h-4 mr-2" />
								Write Prescription
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
							>
								<User className="w-4 h-4 mr-2" />
								Add Patient Notes
							</Button>
							<Button
								className="w-full justify-start text-sm sm:text-base"
								variant="outline"
							>
								<Stethoscope className="w-4 h-4 mr-2" />
								Schedule Follow-up
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</ResponsiveDashboardLayout>
	);
}
