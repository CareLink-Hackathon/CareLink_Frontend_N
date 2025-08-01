'use client';

import { useState, useEffect } from 'react';
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
import { useDoctor } from '@/lib/contexts/doctor-context';
import { useAuth } from '@/lib/auth-context';
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
	Clock,
	Filter,
	Play,
	Square,
	AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorAppointments() {
	const router = useRouter();
	const { user } = useAuth();
	const {
		state,
		loadAppointments,
		selectAppointment,
		updateAppointmentStatus,
		acceptAppointment,
	} = useDoctor();
	const [isCompleting, setIsCompleting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');

	// Load appointments on component mount
	useEffect(() => {
		if (user?.account_type === 'doctor') {
			loadAppointments();
		}
	}, [user]);

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
		{
			icon: Bell,
			label: 'Notifications',
			href: '/doctor/notifications',
			badge:
				state.unreadNotifications > 0
					? state.unreadNotifications.toString()
					: undefined,
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
	];

	// Filter appointments based on search and status
	const filteredAppointments = state.appointments.filter((appointment) => {
		const matchesSearch =
			appointment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			filterStatus === 'all' || appointment.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	// Handle appointment actions
	const handleAcceptAppointment = async (appointmentId: string) => {
		try {
			await acceptAppointment(appointmentId);
		} catch (error) {
			console.error('Error accepting appointment:', error);
		}
	};

	const handleCompleteAppointment = async (appointmentId: string) => {
		try {
			await updateAppointmentStatus(appointmentId, 'completed');
			setIsCompleting(false);
		} catch (error) {
			console.error('Error completing appointment:', error);
		}
	};

	// Mock data structure for compatibility with existing UI
	const appointments = filteredAppointments.map((apt) => ({
		id: apt._id,
		patient: apt.user_email.split('@')[0], // Extract name from email
		patientId: apt.user_id.slice(-6),
		age: 0, // This would need to come from patient data
		time: apt.time,
		date: apt.date,
		type: apt.type,
		status: apt.status,
		reason: apt.reason_for_visit || '',
		notes: '',
		duration: '30 min', // Default duration
	}));

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>
								{state.profile
									? `${state.profile.first_name[0]}${state.profile.last_name[0]}`
									: 'DR'}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">
								{state.profile
									? `DR. ${state.profile.first_name.toUpperCase()} ${state.profile.last_name.toUpperCase()}`
									: 'Doctor'}
							</h3>
							<p className="text-blue-100 text-sm">
								{state.profile?.specialization || 'Doctor'}
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
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button variant="outline" size="sm">
								Export Schedule
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
								My Appointments
							</h1>
							<p className="text-gray-600">
								Manage your patient appointments and consultations
							</p>
						</div>
					</div>

					{/* Loading State */}
					{state.appointmentsLoading && (
						<div className="text-center py-8">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<p className="mt-2 text-gray-600">Loading appointments...</p>
						</div>
					)}

					{/* Error State */}
					{state.error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-center">
								<AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
								<p className="text-red-800">{state.error}</p>
							</div>
						</div>
					)}

					{/* Filter and Sort */}
					<div className="flex items-center space-x-4 mb-6">
						<Button variant="outline" size="sm">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</Button>
						<div className="flex space-x-2">
							<Badge className="bg-green-100 text-green-800">
								Completed:{' '}
								{appointments.filter((a) => a.status === 'completed').length}
							</Badge>
							<Badge className="bg-orange-100 text-orange-800">
								Ongoing:{' '}
								{appointments.filter((a) => a.status === 'ongoing').length}
							</Badge>
							<Badge className="bg-blue-100 text-blue-800">
								Upcoming:{' '}
								{appointments.filter((a) => a.status === 'upcoming').length}
							</Badge>
						</div>
					</div>

					{/* Appointments List */}
					<div className="space-y-4">
						{appointments.map((appointment) => (
							<Card
								key={appointment.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<Avatar className="w-12 h-12">
												<AvatarImage src="/placeholder.svg?height=48&width=48" />
												<AvatarFallback>
													{appointment.patient
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-semibold text-lg">
													{appointment.patient}
												</h3>
												<p className="text-gray-600">
													ID: {appointment.patientId} • Age: {appointment.age}
												</p>
												<p className="text-sm text-gray-500">
													{appointment.reason}
												</p>
											</div>
										</div>
										<div className="text-center">
											<div className="flex items-center space-x-2 mb-2">
												<Calendar className="w-4 h-4 text-gray-500" />
												<span className="font-medium">{appointment.date}</span>
											</div>
											<div className="flex items-center space-x-2 mb-2">
												<Clock className="w-4 h-4 text-gray-500" />
												<span>
													{appointment.time} ({appointment.duration})
												</span>
											</div>
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
										<div className="text-right">
											<p className="font-medium mb-1">{appointment.type}</p>
										</div>
									</div>

									<div className="mt-4 pt-4 border-t border-gray-200">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												{appointment.notes && (
													<div>
														<p className="text-sm text-gray-600 mb-1">Notes:</p>
														<p className="text-sm">{appointment.notes}</p>
													</div>
												)}
											</div>
											<div className="flex space-x-2 ml-4">
												{appointment.status === 'upcoming' && (
													<Button
														size="sm"
														className="bg-green-600 hover:bg-green-700"
													>
														<Play className="w-4 h-4 mr-1" />
														Start
													</Button>
												)}
												{appointment.status === 'ongoing' && (
													<Dialog>
														<DialogTrigger asChild>
															<Button
																size="sm"
																className="bg-blue-600 hover:bg-blue-700"
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
																	<Label>Patient: {appointment.patient}</Label>
																</div>
																<div>
																	<Label htmlFor="diagnosis">Diagnosis</Label>
																	<Textarea
																		id="diagnosis"
																		placeholder="Enter diagnosis..."
																	/>
																</div>
																<div>
																	<Label htmlFor="treatment">
																		Treatment Plan
																	</Label>
																	<Textarea
																		id="treatment"
																		placeholder="Enter treatment plan..."
																	/>
																</div>
																<div>
																	<Label htmlFor="notes">
																		Additional Notes
																	</Label>
																	<Textarea
																		id="notes"
																		placeholder="Enter additional notes..."
																	/>
																</div>
																<Button
																	className="w-full"
																	onClick={() =>
																		handleCompleteAppointment(appointment.id)
																	}
																	disabled={isCompleting}
																>
																	{isCompleting
																		? 'Completing...'
																		: 'Complete Appointment'}
																</Button>
															</div>
														</DialogContent>
													</Dialog>
												)}
												<Button size="sm" variant="outline">
													View Patient
												</Button>
												<Button size="sm" variant="outline">
													Medical Records
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
