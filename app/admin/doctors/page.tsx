'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
	Plus,
	Edit,
	Trash2,
	Eye,
	Mail,
	Phone,
	MapPin,
	GraduationCap,
	Award,
	Clock,
	Droplets,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDoctors() {
	const router = useRouter();
	const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSpecialty, setFilterSpecialty] = useState('all');
	const [isLoading, setIsLoading] = useState(false);

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors', active: true },
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

	const [doctors, setDoctors] = useState([
		{
			id: 'D001',
			firstName: 'Sarah',
			lastName: 'Johnson',
			email: 'sarah.johnson@carelink.com',
			phone: '+1 (555) 123-4567',
			specialty: 'Cardiology',
			licenseNumber: 'MD123456789',
			experience: '15 years',
			education: 'Harvard Medical School',
			address: '123 Medical Center Dr, City, State 12345',
			status: 'active',
			patientsCount: 234,
			appointmentsToday: 8,
			rating: 4.9,
			joinDate: '2018-03-15',
			bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases.',
		},
		{
			id: 'D002',
			firstName: 'Michael',
			lastName: 'Chen',
			email: 'michael.chen@carelink.com',
			phone: '+1 (555) 234-5678',
			specialty: 'Dermatology',
			licenseNumber: 'MD987654321',
			experience: '12 years',
			education: 'Johns Hopkins University',
			address: '456 Health Plaza, City, State 12345',
			status: 'active',
			patientsCount: 189,
			appointmentsToday: 6,
			rating: 4.8,
			joinDate: '2020-01-20',
			bio: 'Dr. Michael Chen specializes in dermatological conditions and cosmetic procedures.',
		},
		{
			id: 'D003',
			firstName: 'Emily',
			lastName: 'Davis',
			email: 'emily.davis@carelink.com',
			phone: '+1 (555) 345-6789',
			specialty: 'Gynecology',
			licenseNumber: 'MD456789123',
			experience: '10 years',
			education: 'Stanford Medical School',
			address: "789 Women's Health Center, City, State 12345",
			status: 'active',
			patientsCount: 156,
			appointmentsToday: 5,
			rating: 4.7,
			joinDate: '2021-06-10',
			bio: "Dr. Emily Davis provides comprehensive women's healthcare services.",
		},
		{
			id: 'D004',
			firstName: 'Robert',
			lastName: 'Kim',
			email: 'robert.kim@carelink.com',
			phone: '+1 (555) 456-7890',
			specialty: 'Pediatrics',
			licenseNumber: 'MD789123456',
			experience: '8 years',
			education: 'UCLA Medical School',
			address: "321 Children's Hospital, City, State 12345",
			status: 'inactive',
			patientsCount: 98,
			appointmentsToday: 0,
			rating: 4.6,
			joinDate: '2022-09-05',
			bio: 'Dr. Robert Kim is dedicated to providing excellent pediatric care.',
		},
	]);

	const specialties = [
		'Cardiology',
		'Dermatology',
		'Gynecology',
		'Pediatrics',
		'Neurology',
		'Orthopedics',
		'Psychiatry',
		'Radiology',
	];

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		specialty: '',
		licenseNumber: '',
		experience: '',
		education: '',
		address: '',
		bio: '',
	});

	const filteredDoctors = doctors.filter((doctor) => {
		const matchesSearch =
			doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesSpecialty =
			filterSpecialty === 'all' || doctor.specialty === filterSpecialty;

		return matchesSearch && matchesSpecialty;
	});

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			const newDoctor = {
				id: `D${String(doctors.length + 1).padStart(3, '0')}`,
				...formData,
				status: 'active',
				patientsCount: 0,
				appointmentsToday: 0,
				rating: 5.0,
				joinDate: new Date().toISOString().split('T')[0],
			};

			setDoctors([...doctors, newDoctor]);
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				specialty: '',
				licenseNumber: '',
				experience: '',
				education: '',
				address: '',
				bio: '',
			});
			setIsCreateOpen(false);
			setIsLoading(false);
		}, 1000);
	};

	const handleEdit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setDoctors(
				doctors.map((doctor) =>
					doctor.id === selectedDoctor.id ? { ...doctor, ...formData } : doctor
				)
			);
			setIsEditOpen(false);
			setIsLoading(false);
		}, 1000);
	};

	const handleDelete = async (doctorId: string) => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
			setIsLoading(false);
		}, 1000);
	};

	const openEditDialog = (doctor: any) => {
		setSelectedDoctor(doctor);
		setFormData({
			firstName: doctor.firstName,
			lastName: doctor.lastName,
			email: doctor.email,
			phone: doctor.phone,
			specialty: doctor.specialty,
			licenseNumber: doctor.licenseNumber,
			experience: doctor.experience,
			education: doctor.education,
			address: doctor.address,
			bio: doctor.bio,
		});
		setIsEditOpen(true);
	};

	const openViewDialog = (doctor: any) => {
		setSelectedDoctor(doctor);
		setIsViewOpen(true);
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white hidden md:block">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
							<div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
								<div className="w-4 h-4 bg-white rounded-sm"></div>
							</div>
						</div>
						<div>
							<h2 className="text-xl font-bold">CareLink</h2>
							<p className="text-blue-100 text-sm">Admin Portal</p>
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
				<header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search doctors..."
									className="pl-10 w-64 md:w-96 border-gray-300"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="icon" className="md:hidden">
								<Settings className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="relative hidden md:flex"
							>
								<Bell className="w-5 h-5" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
							</Button>
						</div>
					</div>
				</header>

				{/* Doctors Content */}
				<div className="flex-1 p-4 md:p-6 overflow-y-auto">
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Doctor Management
							</h1>
							<p className="text-gray-600">
								Manage hospital doctors and their information
							</p>
						</div>

						<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
							<DialogTrigger asChild>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">
									<Plus className="w-4 h-4 mr-2" />
									Add Doctor
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Add New Doctor</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleCreate} className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="firstName">First Name</Label>
											<Input
												id="firstName"
												value={formData.firstName}
												onChange={(e) =>
													setFormData({
														...formData,
														firstName: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last Name</Label>
											<Input
												id="lastName"
												value={formData.lastName}
												onChange={(e) =>
													setFormData({ ...formData, lastName: e.target.value })
												}
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="phone">Phone</Label>
											<Input
												id="phone"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="specialty">Specialty</Label>
											<Select
												value={formData.specialty}
												onValueChange={(value) =>
													setFormData({ ...formData, specialty: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select specialty" />
												</SelectTrigger>
												<SelectContent>
													{specialties.map((specialty) => (
														<SelectItem key={specialty} value={specialty}>
															{specialty}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="experience">Experience</Label>
											<Input
												id="experience"
												value={formData.experience}
												onChange={(e) =>
													setFormData({
														...formData,
														experience: e.target.value,
													})
												}
												placeholder="e.g., 10 years"
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="licenseNumber">License Number</Label>
											<Input
												id="licenseNumber"
												value={formData.licenseNumber}
												onChange={(e) =>
													setFormData({
														...formData,
														licenseNumber: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="education">Education</Label>
											<Input
												id="education"
												value={formData.education}
												onChange={(e) =>
													setFormData({
														...formData,
														education: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="address">Address</Label>
										<Input
											id="address"
											value={formData.address}
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="bio">Bio</Label>
										<Textarea
											id="bio"
											value={formData.bio}
											onChange={(e) =>
												setFormData({ ...formData, bio: e.target.value })
											}
											placeholder="Brief professional bio..."
											rows={3}
										/>
									</div>

									<div className="flex justify-end space-x-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsCreateOpen(false)}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={isLoading}>
											{isLoading ? 'Creating...' : 'Create Doctor'}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{/* Filter and Sort */}
					<div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
						<Button variant="outline" size="sm">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</Button>
						<Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Specialties</SelectItem>
								{specialties.map((specialty) => (
									<SelectItem key={specialty} value={specialty}>
										{specialty}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="flex flex-wrap gap-2">
							<Badge className="bg-green-100 text-green-800">
								Active: {doctors.filter((d) => d.status === 'active').length}
							</Badge>
							<Badge className="bg-gray-100 text-gray-800">
								Inactive:{' '}
								{doctors.filter((d) => d.status === 'inactive').length}
							</Badge>
						</div>
					</div>

					{/* Doctors Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredDoctors.map((doctor) => (
							<Card
								key={doctor.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<Avatar className="w-16 h-16">
											<AvatarImage
												src={`/placeholder.svg?height=64&width=64`}
											/>
											<AvatarFallback>
												{doctor.firstName[0]}
												{doctor.lastName[0]}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-2">
												<h3 className="font-semibold text-lg truncate">
													Dr. {doctor.firstName} {doctor.lastName}
												</h3>
												<Badge
													className={
														doctor.status === 'active'
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}
												>
													{doctor.status}
												</Badge>
											</div>
											<p className="text-blue-600 font-medium mb-1">
												{doctor.specialty}
											</p>
											<p className="text-sm text-gray-600 mb-2">
												ID: {doctor.id}
											</p>

											<div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
												<div className="flex items-center space-x-1">
													<Users className="w-4 h-4" />
													<span>{doctor.patientsCount}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Calendar className="w-4 h-4" />
													<span>{doctor.appointmentsToday}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Award className="w-4 h-4" />
													<span>{doctor.rating}/5</span>
												</div>
											</div>

											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => openViewDialog(doctor)}
												>
													<Eye className="w-4 h-4 mr-1" />
													View
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => openEditDialog(doctor)}
												>
													<Edit className="w-4 h-4 mr-1" />
													Edit
												</Button>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															size="sm"
															variant="outline"
															className="text-red-600 hover:text-red-700"
														>
															<Trash2 className="w-4 h-4 mr-1" />
															Delete
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Delete Doctor</AlertDialogTitle>
															<AlertDialogDescription>
																Are you sure you want to delete Dr.{' '}
																{doctor.firstName} {doctor.lastName}? This
																action cannot be undone and will affect all
																associated appointments and records.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(doctor.id)}
																className="bg-red-600 hover:bg-red-700"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{filteredDoctors.length === 0 && (
						<div className="text-center py-12">
							<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No doctors found
							</h3>
							<p className="text-gray-600">
								Try adjusting your search or filter criteria.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* View Doctor Dialog */}
			<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Doctor Details</DialogTitle>
					</DialogHeader>
					{selectedDoctor && (
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<Avatar className="w-20 h-20">
									<AvatarImage src={`/placeholder.svg?height=80&width=80`} />
									<AvatarFallback className="text-lg">
										{selectedDoctor.firstName[0]}
										{selectedDoctor.lastName[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-xl font-semibold">
										Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
									</h3>
									<p className="text-blue-600 font-medium">
										{selectedDoctor.specialty}
									</p>
									<Badge
										className={
											selectedDoctor.status === 'active'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}
									>
										{selectedDoctor.status}
									</Badge>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900">
										Contact Information
									</h4>
									<div className="space-y-3">
										<div className="flex items-center space-x-2">
											<Mail className="w-4 h-4 text-gray-500" />
											<span className="text-sm">{selectedDoctor.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Phone className="w-4 h-4 text-gray-500" />
											<span className="text-sm">{selectedDoctor.phone}</span>
										</div>
										<div className="flex items-center space-x-2">
											<MapPin className="w-4 h-4 text-gray-500" />
											<span className="text-sm">{selectedDoctor.address}</span>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900">
										Professional Information
									</h4>
									<div className="space-y-3">
										<div className="flex items-center space-x-2">
											<GraduationCap className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												{selectedDoctor.education}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Clock className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												{selectedDoctor.experience}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Award className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												License: {selectedDoctor.licenseNumber}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Card>
									<CardContent className="p-4 text-center">
										<Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
										<p className="text-2xl font-bold">
											{selectedDoctor.patientsCount}
										</p>
										<p className="text-sm text-gray-600">Total Patients</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
										<p className="text-2xl font-bold">
											{selectedDoctor.appointmentsToday}
										</p>
										<p className="text-sm text-gray-600">
											Today's Appointments
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
										<p className="text-2xl font-bold">
											{selectedDoctor.rating}/5
										</p>
										<p className="text-sm text-gray-600">Rating</p>
									</CardContent>
								</Card>
							</div>

							{selectedDoctor.bio && (
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Biography
									</h4>
									<p className="text-gray-600">{selectedDoctor.bio}</p>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Doctor Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Doctor</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEdit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editFirstName">First Name</Label>
								<Input
									id="editFirstName"
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editLastName">Last Name</Label>
								<Input
									id="editLastName"
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editEmail">Email</Label>
								<Input
									id="editEmail"
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editPhone">Phone</Label>
								<Input
									id="editPhone"
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editSpecialty">Specialty</Label>
								<Select
									value={formData.specialty}
									onValueChange={(value) =>
										setFormData({ ...formData, specialty: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select specialty" />
									</SelectTrigger>
									<SelectContent>
										{specialties.map((specialty) => (
											<SelectItem key={specialty} value={specialty}>
												{specialty}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editExperience">Experience</Label>
								<Input
									id="editExperience"
									value={formData.experience}
									onChange={(e) =>
										setFormData({ ...formData, experience: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editLicenseNumber">License Number</Label>
								<Input
									id="editLicenseNumber"
									value={formData.licenseNumber}
									onChange={(e) =>
										setFormData({ ...formData, licenseNumber: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editEducation">Education</Label>
								<Input
									id="editEducation"
									value={formData.education}
									onChange={(e) =>
										setFormData({ ...formData, education: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editAddress">Address</Label>
							<Input
								id="editAddress"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editBio">Bio</Label>
							<Textarea
								id="editBio"
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								placeholder="Brief professional bio..."
								rows={3}
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Doctor'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
