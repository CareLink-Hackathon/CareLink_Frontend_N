'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Search,
	Calendar,
	Filter,
	CheckCircle,
	XCircle,
	Clock,
	UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/contexts/admin-context';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';

function AdminAppointments() {
	const router = useRouter();
	const { user } = useAuth();
	const {
		appointments,
		doctors,
		loading,
		error,
		loadAppointments,
		loadDoctors,
		updateAppointmentStatus,
		assignDoctorToAppointment,
	} = useAdmin();

	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [isAssigning, setIsAssigning] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
	const [selectedDoctor, setSelectedDoctor] = useState<string>('');

	// Load data on component mount
	useEffect(() => {
		if (user?.user_id || user?._id) {
			loadAppointments();
			loadDoctors();
		}
	}, [user]);

	// Show loading screen on initial load
	if (loading && !appointments.length) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
					<div className="text-lg font-medium text-gray-900 mb-2">
						Loading Appointments
					</div>
					<p className="text-gray-600">
						Fetching appointment data...
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

	const sidebarItems = getAdminSidebarItems('appointments');
	const userInfo = getAdminUserInfo(user);

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Appointments Management"
		>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Appointments Management
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Manage and track all hospital appointments
				</p>
			</div>

			{/* Search and Filter Controls */}
			<Card className="mb-6">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg">Search & Filter</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search by patient or doctor name..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<Select value={filterStatus} onValueChange={setFilterStatus}>
								<SelectTrigger className="w-40">
									<Filter className="w-4 h-4 mr-2" />
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
							<Button variant="outline" className="whitespace-nowrap">
								<UserPlus className="w-4 h-4 mr-2" />
								Add Appointment
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Appointments List */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle className="text-lg sm:text-xl">
						All Appointments ({filteredAppointments.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-4">
							{[1, 2, 3, 4, 5].map((i) => (
								<div
									key={i}
									className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse"
								>
									<div className="w-12 h-12 bg-gray-200 rounded-full"></div>
									<div className="flex-1 space-y-2">
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										<div className="h-3 bg-gray-200 rounded w-1/2"></div>
									</div>
									<div className="w-20 h-6 bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					) : filteredAppointments.length > 0 ? (
						<div className="space-y-4">
							{filteredAppointments.map((appointment: any) => (
								<div
									key={appointment._id}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center space-x-4 flex-1 min-w-0">
										<Avatar className="w-12 h-12 flex-shrink-0">
											<AvatarImage src="/placeholder.svg?height=48&width=48" />
											<AvatarFallback>
												{appointment.patient_name
													?.split(' ')
													.map((n: string) => n[0])
													.join('') || 'P'}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<h4 className="font-semibold text-sm sm:text-base truncate">
												{appointment.patient_name || 'Unknown Patient'}
											</h4>
											<p className="text-xs sm:text-sm text-gray-600 truncate">
												Dr. {appointment.doctor_name || appointment.doctor || 'Unassigned'}
											</p>
											<p className="text-xs text-gray-500">
												{appointment.date} at {appointment.time}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{appointment.type || 'General'} - {appointment.reason_for_visit || 'No reason specified'}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-2 flex-shrink-0">
										<Badge
											className={
												appointment.status === 'completed'
													? 'bg-green-100 text-green-800'
													: appointment.status === 'pending'
													? 'bg-yellow-100 text-yellow-800'
													: appointment.status === 'scheduled'
													? 'bg-blue-100 text-blue-800'
													: 'bg-red-100 text-red-800'
											}
										>
											{appointment.status}
										</Badge>
										{appointment.status === 'pending' && (
											<div className="flex space-x-1">
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleStatusUpdate(appointment._id, 'scheduled')}
													className="p-2"
												>
													<CheckCircle className="w-4 h-4 text-green-600" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
													className="p-2"
												>
													<XCircle className="w-4 h-4 text-red-600" />
												</Button>
											</div>
										)}
										{appointment.status === 'scheduled' && (
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleStatusUpdate(appointment._id, 'completed')}
											>
												<Clock className="w-4 h-4 mr-1" />
												Complete
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No appointments found
							</h3>
							<p className="text-gray-500 mb-4">
								{searchTerm || filterStatus !== 'all'
									? 'Try adjusting your search or filter criteria'
									: 'No appointments have been scheduled yet'}
							</p>
							<Button>
								<UserPlus className="w-4 h-4 mr-2" />
								Schedule New Appointment
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Doctor Assignment Dialog */}
			<Dialog open={isAssigning} onOpenChange={setIsAssigning}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Doctor</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="doctor-select">Select Doctor</Label>
							<Select onValueChange={(value) => setSelectedDoctor(value)}>
								<SelectTrigger>
									<SelectValue placeholder="Choose a doctor" />
								</SelectTrigger>
								<SelectContent>
									{doctors.map((doctor: any) => (
										<SelectItem key={doctor._id} value={doctor._id}>
											Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex justify-end space-x-2">
							<Button variant="outline" onClick={() => setIsAssigning(false)}>
								Cancel
							</Button>
							<Button
								onClick={() =>
									selectedDoctor &&
									selectedAppointment &&
									handleDoctorAssignment(selectedAppointment, selectedDoctor)
								}
								disabled={!selectedDoctor}
							>
								Assign Doctor
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</ResponsiveDashboardLayout>
	);
}

export default function ProtectedAdminAppointments() {
	return (
		<ProtectedRoute allowedRoles={['admin', 'hospital']}>
			<AdminAppointments />
		</ProtectedRoute>
	);
}
