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
	User,
	Heart,
	Clock,
	CalendarDays,
	Stethoscope,
	Droplets,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPatients() {
	const router = useRouter();
	const [selectedPatient, setSelectedPatient] = useState<any>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [isLoading, setIsLoading] = useState(false);

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients', active: true },
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

	const [patients, setPatients] = useState([
		{
			id: 'P001',
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@email.com',
			phone: '+1 (555) 123-4567',
			dateOfBirth: '1985-03-15',
			gender: 'Male',
			address: '123 Main St, City, State 12345',
			emergencyContact: '+1 (555) 987-6543',
			emergencyContactName: 'Jane Doe',
			emergencyContactRelation: 'Spouse',
			bloodType: 'O+',
			allergies: 'Penicillin, Peanuts',
			medicalHistory: 'Hypertension, Type 2 Diabetes',
			status: 'active',
			assignedDoctor: 'Dr. Sarah Johnson',
			doctorId: 'D001',
			registrationDate: '2023-01-15',
			lastVisit: '2025-01-20',
			totalAppointments: 12,
			condition: 'Stable',
		},
		{
			id: 'P002',
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane.smith@email.com',
			phone: '+1 (555) 234-5678',
			dateOfBirth: '1990-07-22',
			gender: 'Female',
			address: '456 Oak Ave, City, State 12345',
			emergencyContact: '+1 (555) 876-5432',
			emergencyContactName: 'Robert Smith',
			emergencyContactRelation: 'Brother',
			bloodType: 'A-',
			allergies: 'None',
			medicalHistory: 'Asthma',
			status: 'active',
			assignedDoctor: 'Dr. Michael Chen',
			doctorId: 'D002',
			registrationDate: '2023-05-20',
			lastVisit: '2025-01-18',
			totalAppointments: 8,
			condition: 'Monitoring',
		},
		{
			id: 'P003',
			firstName: 'Bob',
			lastName: 'Wilson',
			email: 'bob.wilson@email.com',
			phone: '+1 (555) 345-6789',
			dateOfBirth: '1978-11-08',
			gender: 'Male',
			address: '789 Pine St, City, State 12345',
			emergencyContact: '+1 (555) 765-4321',
			emergencyContactName: 'Mary Wilson',
			emergencyContactRelation: 'Wife',
			bloodType: 'B+',
			allergies: 'Shellfish',
			medicalHistory: 'Heart Disease, High Cholesterol',
			status: 'critical',
			assignedDoctor: 'Dr. Emily Davis',
			doctorId: 'D003',
			registrationDate: '2022-12-10',
			lastVisit: '2025-01-25',
			totalAppointments: 25,
			condition: 'Critical',
		},
		{
			id: 'P004',
			firstName: 'Alice',
			lastName: 'Brown',
			email: 'alice.brown@email.com',
			phone: '+1 (555) 456-7890',
			dateOfBirth: '1995-02-14',
			gender: 'Female',
			address: '321 Elm Dr, City, State 12345',
			emergencyContact: '+1 (555) 654-3210',
			emergencyContactName: 'Carol Brown',
			emergencyContactRelation: 'Mother',
			bloodType: 'AB+',
			allergies: 'Latex',
			medicalHistory: 'None',
			status: 'inactive',
			assignedDoctor: 'Dr. Robert Kim',
			doctorId: 'D004',
			registrationDate: '2024-08-05',
			lastVisit: '2024-12-15',
			totalAppointments: 3,
			condition: 'Healthy',
		},
	]);

	const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
	const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
	const statusOptions = ['active', 'inactive', 'critical'];

	const doctors = [
		{ id: 'D001', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
		{ id: 'D002', name: 'Dr. Michael Chen', specialty: 'Dermatology' },
		{ id: 'D003', name: 'Dr. Emily Davis', specialty: 'Gynecology' },
		{ id: 'D004', name: 'Dr. Robert Kim', specialty: 'Pediatrics' },
	];

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: '',
		address: '',
		emergencyContact: '',
		emergencyContactName: '',
		emergencyContactRelation: '',
		bloodType: '',
		allergies: '',
		medicalHistory: '',
		assignedDoctor: '',
		doctorId: '',
	});

	const filteredPatients = patients.filter((patient) => {
		const matchesSearch =
			patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.id.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			filterStatus === 'all' || patient.status === filterStatus;

		return matchesSearch && matchesStatus;
	});

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
			const newPatient = {
				id: `P${String(patients.length + 1).padStart(3, '0')}`,
				...formData,
				assignedDoctor: selectedDoctor?.name || '',
				status: 'active',
				registrationDate: new Date().toISOString().split('T')[0],
				lastVisit: '',
				totalAppointments: 0,
				condition: 'Healthy',
			};

			setPatients([...patients, newPatient]);
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				dateOfBirth: '',
				gender: '',
				address: '',
				emergencyContact: '',
				emergencyContactName: '',
				emergencyContactRelation: '',
				bloodType: '',
				allergies: '',
				medicalHistory: '',
				assignedDoctor: '',
				doctorId: '',
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
			const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
			setPatients(
				patients.map((patient) =>
					patient.id === selectedPatient.id
						? {
								...patient,
								...formData,
								assignedDoctor: selectedDoctor?.name || '',
						  }
						: patient
				)
			);
			setIsEditOpen(false);
			setIsLoading(false);
		}, 1000);
	};

	const handleDelete = async (patientId: string) => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setPatients(patients.filter((patient) => patient.id !== patientId));
			setIsLoading(false);
		}, 1000);
	};

	const openEditDialog = (patient: any) => {
		setSelectedPatient(patient);
		setFormData({
			firstName: patient.firstName,
			lastName: patient.lastName,
			email: patient.email,
			phone: patient.phone,
			dateOfBirth: patient.dateOfBirth,
			gender: patient.gender,
			address: patient.address,
			emergencyContact: patient.emergencyContact,
			emergencyContactName: patient.emergencyContactName,
			emergencyContactRelation: patient.emergencyContactRelation,
			bloodType: patient.bloodType,
			allergies: patient.allergies,
			medicalHistory: patient.medicalHistory,
			assignedDoctor: patient.assignedDoctor,
			doctorId: patient.doctorId,
		});
		setIsEditOpen(true);
	};

	const openViewDialog = (patient: any) => {
		setSelectedPatient(patient);
		setIsViewOpen(true);
	};

	const calculateAge = (dateOfBirth: string) => {
		const today = new Date();
		const birth = new Date(dateOfBirth);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}
		return age;
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
									placeholder="Search patients..."
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

				{/* Patients Content */}
				<div className="flex-1 p-4 md:p-6 overflow-y-auto">
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Patient Management
							</h1>
							<p className="text-gray-600">
								Manage hospital patients and their information
							</p>
						</div>

						<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
							<DialogTrigger asChild>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">
									<Plus className="w-4 h-4 mr-2" />
									Add Patient
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Add New Patient</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleCreate} className="space-y-6">
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

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="dateOfBirth">Date of Birth</Label>
											<Input
												id="dateOfBirth"
												type="date"
												value={formData.dateOfBirth}
												onChange={(e) =>
													setFormData({
														...formData,
														dateOfBirth: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="gender">Gender</Label>
											<Select
												value={formData.gender}
												onValueChange={(value) =>
													setFormData({ ...formData, gender: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													{genders.map((gender) => (
														<SelectItem key={gender} value={gender}>
															{gender}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="bloodType">Blood Type</Label>
											<Select
												value={formData.bloodType}
												onValueChange={(value) =>
													setFormData({ ...formData, bloodType: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select blood type" />
												</SelectTrigger>
												<SelectContent>
													{bloodTypes.map((type) => (
														<SelectItem key={type} value={type}>
															{type}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="emergencyContactName">
												Emergency Contact Name
											</Label>
											<Input
												id="emergencyContactName"
												value={formData.emergencyContactName}
												onChange={(e) =>
													setFormData({
														...formData,
														emergencyContactName: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="emergencyContact">
												Emergency Contact Phone
											</Label>
											<Input
												id="emergencyContact"
												value={formData.emergencyContact}
												onChange={(e) =>
													setFormData({
														...formData,
														emergencyContact: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="emergencyContactRelation">
												Relationship
											</Label>
											<Input
												id="emergencyContactRelation"
												value={formData.emergencyContactRelation}
												onChange={(e) =>
													setFormData({
														...formData,
														emergencyContactRelation: e.target.value,
													})
												}
												placeholder="e.g., Spouse, Parent, Sibling"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="assignedDoctor">Assigned Doctor</Label>
										<Select
											value={formData.doctorId}
											onValueChange={(value) => {
												const doctor = doctors.find((d) => d.id === value);
												setFormData({
													...formData,
													doctorId: value,
													assignedDoctor: doctor?.name || '',
												});
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select assigned doctor" />
											</SelectTrigger>
											<SelectContent>
												{doctors.map((doctor) => (
													<SelectItem key={doctor.id} value={doctor.id}>
														{doctor.name} - {doctor.specialty}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="allergies">Allergies</Label>
										<Textarea
											id="allergies"
											value={formData.allergies}
											onChange={(e) =>
												setFormData({ ...formData, allergies: e.target.value })
											}
											placeholder="List any known allergies (or 'None')"
											rows={2}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="medicalHistory">Medical History</Label>
										<Textarea
											id="medicalHistory"
											value={formData.medicalHistory}
											onChange={(e) =>
												setFormData({
													...formData,
													medicalHistory: e.target.value,
												})
											}
											placeholder="Brief medical history and conditions"
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
											{isLoading ? 'Creating...' : 'Create Patient'}
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
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Patients</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="critical">Critical</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex flex-wrap gap-2">
							<Badge className="bg-green-100 text-green-800">
								Active: {patients.filter((p) => p.status === 'active').length}
							</Badge>
							<Badge className="bg-red-100 text-red-800">
								Critical:{' '}
								{patients.filter((p) => p.status === 'critical').length}
							</Badge>
							<Badge className="bg-gray-100 text-gray-800">
								Inactive:{' '}
								{patients.filter((p) => p.status === 'inactive').length}
							</Badge>
						</div>
					</div>

					{/* Patients Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredPatients.map((patient) => (
							<Card
								key={patient.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<Avatar className="w-16 h-16">
											<AvatarImage
												src={`/placeholder.svg?height=64&width=64`}
											/>
											<AvatarFallback>
												{patient.firstName[0]}
												{patient.lastName[0]}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-2">
												<h3 className="font-semibold text-lg truncate">
													{patient.firstName} {patient.lastName}
												</h3>
												<Badge
													className={
														patient.status === 'active'
															? 'bg-green-100 text-green-800'
															: patient.status === 'critical'
															? 'bg-red-100 text-red-800'
															: 'bg-gray-100 text-gray-800'
													}
												>
													{patient.status}
												</Badge>
											</div>
											<p className="text-sm text-gray-600 mb-1">
												ID: {patient.id}
											</p>
											<p className="text-sm text-gray-600 mb-1">
												Age: {calculateAge(patient.dateOfBirth)}
											</p>
											<p className="text-sm text-blue-600 font-medium mb-2">
												{patient.assignedDoctor}
											</p>

											<div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
												<div className="flex items-center space-x-1">
													<CalendarDays className="w-4 h-4" />
													<span>{patient.totalAppointments}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Heart className="w-4 h-4" />
													<span>{patient.bloodType}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Stethoscope className="w-4 h-4" />
													<span>{patient.condition}</span>
												</div>
											</div>

											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => openViewDialog(patient)}
												>
													<Eye className="w-4 h-4 mr-1" />
													View
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => openEditDialog(patient)}
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
															<AlertDialogTitle>
																Delete Patient
															</AlertDialogTitle>
															<AlertDialogDescription>
																Are you sure you want to delete{' '}
																{patient.firstName} {patient.lastName}? This
																action cannot be undone and will remove all
																associated medical records and appointments.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(patient.id)}
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

					{filteredPatients.length === 0 && (
						<div className="text-center py-12">
							<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No patients found
							</h3>
							<p className="text-gray-600">
								Try adjusting your search or filter criteria.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* View Patient Dialog */}
			<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Patient Details</DialogTitle>
					</DialogHeader>
					{selectedPatient && (
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<Avatar className="w-20 h-20">
									<AvatarImage src={`/placeholder.svg?height=80&width=80`} />
									<AvatarFallback className="text-lg">
										{selectedPatient.firstName[0]}
										{selectedPatient.lastName[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-xl font-semibold">
										{selectedPatient.firstName} {selectedPatient.lastName}
									</h3>
									<p className="text-gray-600">
										Patient ID: {selectedPatient.id}
									</p>
									<p className="text-sm text-gray-600">
										Age: {calculateAge(selectedPatient.dateOfBirth)} •{' '}
										{selectedPatient.gender}
									</p>
									<Badge
										className={
											selectedPatient.status === 'active'
												? 'bg-green-100 text-green-800'
												: selectedPatient.status === 'critical'
												? 'bg-red-100 text-red-800'
												: 'bg-gray-100 text-gray-800'
										}
									>
										{selectedPatient.status}
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
											<span className="text-sm">{selectedPatient.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Phone className="w-4 h-4 text-gray-500" />
											<span className="text-sm">{selectedPatient.phone}</span>
										</div>
										<div className="flex items-center space-x-2">
											<MapPin className="w-4 h-4 text-gray-500" />
											<span className="text-sm">{selectedPatient.address}</span>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900">
										Emergency Contact
									</h4>
									<div className="space-y-3">
										<div className="flex items-center space-x-2">
											<User className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												{selectedPatient.emergencyContactName}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Phone className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												{selectedPatient.emergencyContact}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Heart className="w-4 h-4 text-gray-500" />
											<span className="text-sm">
												{selectedPatient.emergencyContactRelation}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Card>
									<CardContent className="p-4 text-center">
										<CalendarDays className="w-8 h-8 text-blue-600 mx-auto mb-2" />
										<p className="text-2xl font-bold">
											{selectedPatient.totalAppointments}
										</p>
										<p className="text-sm text-gray-600">Total Appointments</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
										<p className="text-2xl font-bold">
											{selectedPatient.bloodType}
										</p>
										<p className="text-sm text-gray-600">Blood Type</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<Stethoscope className="w-8 h-8 text-green-600 mx-auto mb-2" />
										<p className="text-lg font-bold">
											{selectedPatient.condition}
										</p>
										<p className="text-sm text-gray-600">Current Condition</p>
									</CardContent>
								</Card>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Medical Information
									</h4>
									<div className="space-y-2">
										<div>
											<p className="text-sm font-medium text-gray-700">
												Assigned Doctor:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.assignedDoctor}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700">
												Allergies:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.allergies}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700">
												Medical History:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.medicalHistory}
											</p>
										</div>
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Registration Info
									</h4>
									<div className="space-y-2">
										<div>
											<p className="text-sm font-medium text-gray-700">
												Registration Date:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.registrationDate}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700">
												Last Visit:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.lastVisit || 'No visits yet'}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700">
												Date of Birth:
											</p>
											<p className="text-sm text-gray-600">
												{selectedPatient.dateOfBirth}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Patient Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Patient</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEdit} className="space-y-6">
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

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editDateOfBirth">Date of Birth</Label>
								<Input
									id="editDateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={(e) =>
										setFormData({ ...formData, dateOfBirth: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editGender">Gender</Label>
								<Select
									value={formData.gender}
									onValueChange={(value) =>
										setFormData({ ...formData, gender: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										{genders.map((gender) => (
											<SelectItem key={gender} value={gender}>
												{gender}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editBloodType">Blood Type</Label>
								<Select
									value={formData.bloodType}
									onValueChange={(value) =>
										setFormData({ ...formData, bloodType: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select blood type" />
									</SelectTrigger>
									<SelectContent>
										{bloodTypes.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="editEmergencyContactName">
									Emergency Contact Name
								</Label>
								<Input
									id="editEmergencyContactName"
									value={formData.emergencyContactName}
									onChange={(e) =>
										setFormData({
											...formData,
											emergencyContactName: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editEmergencyContact">
									Emergency Contact Phone
								</Label>
								<Input
									id="editEmergencyContact"
									value={formData.emergencyContact}
									onChange={(e) =>
										setFormData({
											...formData,
											emergencyContact: e.target.value,
										})
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editEmergencyContactRelation">
									Relationship
								</Label>
								<Input
									id="editEmergencyContactRelation"
									value={formData.emergencyContactRelation}
									onChange={(e) =>
										setFormData({
											...formData,
											emergencyContactRelation: e.target.value,
										})
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editAssignedDoctor">Assigned Doctor</Label>
							<Select
								value={formData.doctorId}
								onValueChange={(value) => {
									const doctor = doctors.find((d) => d.id === value);
									setFormData({
										...formData,
										doctorId: value,
										assignedDoctor: doctor?.name || '',
									});
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select assigned doctor" />
								</SelectTrigger>
								<SelectContent>
									{doctors.map((doctor) => (
										<SelectItem key={doctor.id} value={doctor.id}>
											{doctor.name} - {doctor.specialty}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editAllergies">Allergies</Label>
							<Textarea
								id="editAllergies"
								value={formData.allergies}
								onChange={(e) =>
									setFormData({ ...formData, allergies: e.target.value })
								}
								placeholder="List any known allergies (or 'None')"
								rows={2}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editMedicalHistory">Medical History</Label>
							<Textarea
								id="editMedicalHistory"
								value={formData.medicalHistory}
								onChange={(e) =>
									setFormData({ ...formData, medicalHistory: e.target.value })
								}
								placeholder="Brief medical history and conditions"
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
								{isLoading ? 'Updating...' : 'Update Patient'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
