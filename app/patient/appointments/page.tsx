'use client';

import type React from 'react';

import { useState } from 'react';
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
import { ResponsiveTable, StatusBadge } from '@/components/ui/responsive-table';
import {
	Calendar,
	Star,
	Clock,
	FileText,
	Activity,
	Plus,
	Filter,
	Bot,
	Bell,
	Settings,
	HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientAppointments() {
	const router = useRouter();
	const [isBookingOpen, setIsBookingOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
