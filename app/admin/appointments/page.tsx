'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Search,
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Calendar,
	Users,
	Activity,
	FileText,
	Filter,
	CheckCircle,
	XCircle,
	Clock,
	UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/contexts/admin-context';

export default function AdminAppointments() {
	const router = useRouter();
	const { user } = useAuth();
	const {
		appointments,
		doctors,
		loading,
		error,
		loadAppointments,
		updateAppointmentStatus,
		assignDoctorToAppointment,
		loadDoctors,
		acceptAppointment,
	} = useAdmin();

	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [isAssigning, setIsAssigning] = useState(false);
	const [filterStatus, setFilterStatus] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	// Load data on component mount
	useEffect(() => {
		if (user?.account_type === 'hospital' && (user as any).isAdmin) {
			loadAppointments();
			loadDoctors();
		}
	}, [user]);

	// Show error state if there's an error
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						Error loading appointments
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

	// Filter appointments based on status and search term
	const filteredAppointments = appointments.filter((appointment: any) => {
		const matchesStatus =
			filterStatus === 'all' || appointment.status === filterStatus;
		const matchesSearch =
			!searchTerm ||
			appointment.patient_name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			appointment.user_email
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const handleStatusUpdate = async (
		appointmentId: string,
		newStatus: string
	) => {
		try {
			await updateAppointmentStatus(appointmentId, newStatus);
		} catch (error) {
			console.error('Failed to update appointment status:', error);
		}
	};

	const handleDoctorAssignment = async (
		appointmentId: string,
		doctorId: string
	) => {
		try {
			await assignDoctorToAppointment(appointmentId, doctorId);
			setIsAssigning(false);
			setSelectedAppointment(null);
		} catch (error) {
			console.error('Failed to assign doctor:', error);
		}
	};

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{
			icon: Calendar,
			label: 'Appointments',
			href: '/admin/appointments',
			active: true,
		},
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge: undefined, // Will need to get from context when available
		},
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>
								{user?.first_name && user?.last_name
									? `${user.first_name[0]}${user.last_name[0]}`
									: 'AD'}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">
								{user?.first_name && user?.last_name
									? `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
									: 'ADMIN USER'}
							</h3>
							<p className="text-blue-100 text-sm">
								{user?.hospital_name
									? `${user.hospital_name} Administrator`
									: 'Hospital Administrator'}
							</p>
						</div>
					</div>

					<nav className="space-y-2">
						{sidebarItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
									item.active
										? 'bg-white text-blue-600'
										: 'text-white hover:bg-blue-500'
								}`}
							>
								<item.icon className="w-5 h-5" />
								<span className="flex-1">{item.label}</span>
								{item.badge && (
									<Badge className="bg-red-500 text-white text-xs">
										{item.badge}
									</Badge>
								)}
							</Link>
						))}
					</nav>
				</div>

				<div className="absolute bottom-6 left-6">
					<Button
						variant="ghost"
						className="text-white hover:bg-blue-500 w-full justify-start"
						onClick={() => router.push('/login')}
					>
						<LogOut className="w-5 h-5 mr-3" />
						Sign-out
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="bg-white border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search appointments..."
									className="pl-10 w-96 border-gray-300"
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button variant="outline" size="sm">
								Export Report
							</Button>
							<Button variant="ghost" size="icon">
								<Settings className="w-5 h-5" />
							</Button>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
							</Button>
						</div>
					</div>
				</header>

				{/* Appointments Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Appointment Management
							</h1>
							<p className="text-gray-600">
								Manage and assign appointments to doctors
							</p>
						</div>
					</div>

					{/* Filter and Sort */}
					<div className="flex items-center space-x-4 mb-6">
						<Button variant="outline" size="sm">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</Button>
						<Select defaultValue="all">
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Appointments</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="confirmed">Confirmed</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
						<Select defaultValue="today">
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="tomorrow">Tomorrow</SelectItem>
								<SelectItem value="week">This Week</SelectItem>
								<SelectItem value="month">This Month</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Search and Filter Controls */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search by patient name, email, or doctor..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="scheduled">Scheduled</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Appointments List */}
					<div className="space-y-4">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
							</div>
						) : filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment: any) => (
								<Card
									key={appointment._id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<Avatar className="w-12 h-12">
													<AvatarImage src="/placeholder.svg?height=48&width=48" />
													<AvatarFallback>
														{appointment.patient_name
															? appointment.patient_name
																	.split(' ')
																	.map((n: string) => n[0])
																	.join('')
															: appointment.user_email
																	.split('@')[0]
																	.substring(0, 2)
																	.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<h3 className="font-semibold text-lg">
														{appointment.patient_name ||
															appointment.user_email.split('@')[0]}
													</h3>
													<p className="text-gray-600">
														Email: {appointment.user_email}
													</p>
													<p className="text-sm text-gray-500">
														{appointment.specialty}
													</p>
												</div>
											</div>
											<div className="text-center">
												<div className="flex items-center space-x-2 mb-2">
													<Calendar className="w-4 h-4 text-gray-500" />
													<span className="font-medium">
														{appointment.date}
													</span>
												</div>
												<div className="flex items-center space-x-2 mb-2">
													<Clock className="w-4 h-4 text-gray-500" />
													<span>{appointment.time}</span>
												</div>
												<Badge
													className={
														appointment.status === 'scheduled'
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
											<div className="text-right">
												<p className="font-medium mb-1">
													{!appointment.doctor ||
													appointment.doctor === 'Unassigned' ? (
														<span className="text-red-600">Unassigned</span>
													) : (
														appointment.doctor_name || appointment.doctor
													)}
												</p>
												<p className="text-sm text-gray-600 mb-2">
													{appointment.type}
												</p>
											</div>
										</div>

										<div className="mt-4 pt-4 border-t border-gray-200">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<p className="text-sm text-gray-600">
														<strong>Reason:</strong>{' '}
														{appointment.reason ||
															appointment.description ||
															'No reason provided'}
													</p>
												</div>
												<div className="flex space-x-2">
													{(!appointment.doctor ||
														appointment.doctor === 'Unassigned') && (
														<Dialog>
															<DialogTrigger asChild>
																<Button
																	size="sm"
																	className="bg-blue-600 hover:bg-blue-700"
																>
																	<UserPlus className="w-4 h-4 mr-1" />
																	Assign Doctor
																</Button>
															</DialogTrigger>
															<DialogContent>
																<DialogHeader>
																	<DialogTitle>
																		Assign Doctor to Appointment
																	</DialogTitle>
																</DialogHeader>
																<div className="space-y-4">
																	<div>
																		<Label>Select Doctor</Label>
																		<Select
																			onValueChange={(doctorId) => {
																				if (doctorId) {
																					handleDoctorAssignment(
																						appointment._id,
																						doctorId
																					);
																				}
																			}}
																		>
																			<SelectTrigger>
																				<SelectValue placeholder="Choose a doctor" />
																			</SelectTrigger>
																			<SelectContent>
																				{doctors
																					.filter(
																						(doc: any) =>
																							doc.specialty ===
																							appointment.specialty
																					)
																					.map((doctor: any) => (
																						<SelectItem
																							key={doctor._id}
																							value={doctor._id}
																						>
																							{doctor.first_name}{' '}
																							{doctor.last_name} -{' '}
																							{doctor.specialty}
																						</SelectItem>
																					))}
																			</SelectContent>
																		</Select>
																	</div>
																	{doctors.filter(
																		(doc: any) =>
																			doc.specialty === appointment.specialty
																	).length === 0 && (
																		<p className="text-sm text-amber-600">
																			No doctors available for{' '}
																			{appointment.specialty}
																		</p>
																	)}
																</div>
															</DialogContent>
														</Dialog>
													)}

													{appointment.status === 'pending' && (
														<>
															<Button
																size="sm"
																variant="outline"
																className="text-green-600 border-green-600 hover:bg-green-50"
																onClick={() =>
																	handleStatusUpdate(
																		appointment._id,
																		'confirmed'
																	)
																}
															>
																<CheckCircle className="w-4 h-4 mr-1" />
																Confirm
															</Button>
															<Button
																size="sm"
																variant="outline"
																className="text-red-600 border-red-600 hover:bg-red-50"
																onClick={() =>
																	handleStatusUpdate(
																		appointment._id,
																		'cancelled'
																	)
																}
															>
																<XCircle className="w-4 h-4 mr-1" />
																Cancel
															</Button>
														</>
													)}

													{appointment.status === 'scheduled' && (
														<Button
															size="sm"
															variant="outline"
															className="text-blue-600 border-blue-600 hover:bg-blue-50"
															onClick={() =>
																handleStatusUpdate(appointment._id, 'completed')
															}
														>
															<CheckCircle className="w-4 h-4 mr-1" />
															Mark Complete
														</Button>
													)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<div className="text-center py-12">
								<Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No appointments found
								</h3>
								<p className="text-gray-500">
									{searchTerm || filterStatus !== 'all'
										? 'Try adjusting your search or filter criteria.'
										: 'No appointments have been scheduled yet.'}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
