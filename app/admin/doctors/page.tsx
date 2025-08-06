'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAdmin } from '@/lib/contexts/admin-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Users,
	UserCheck,
	Building2,
	Stethoscope,
	Search,
	Filter,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';
import { toast } from '@/hooks/use-toast';
import type { Doctor } from '@/lib/services/admin-service';

function DoctorsPage() {
	const { user } = useAuth();
	const {
		doctors,
		doctorsLoading,
		doctorsError,
		departments,
		departmentsLoading,
		loadDoctors,
		loadDepartments,
		createDoctor,
		updateDoctor,
		deleteDoctor,
		suspendDoctor,
		unsuspendDoctor,
		unreadNotifications,
	} = useAdmin();

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [departmentFilter, setDepartmentFilter] = useState('all');
	
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		phone_number: '',
		gender: '',
		address: '',
		specialization: '',
		department_id: '',
		years_of_experience: 0,
		qualification: '',
		profile_image_url: '',
	});

	useEffect(() => {
		if (user && (user.account_type === 'hospital' || user.role === 'admin')) {
			console.log('✅ DoctorsPage - Loading doctors and departments for user:', user?._id);
			loadDoctors();
			loadDepartments();
		} else if (user) {
			console.log('❌ DoctorsPage - User not qualified:', {
				accountType: user?.account_type,
				role: user?.role
			});
		}
	}, [user]); // Only depend on user, not the functions

	const sidebarItems = getAdminSidebarItems('doctors');

	const userInfo = getAdminUserInfo(user);

	const resetForm = () => {
		setFormData({
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			phone_number: '',
			gender: '',
			address: '',
			specialization: '',
			department_id: '',
			years_of_experience: 0,
			qualification: '',
			profile_image_url: '',
		});
		setSelectedDoctor(null);
	};

	const handleCreateDoctor = async () => {
		try {
			await createDoctor(formData);
			setIsCreateDialogOpen(false);
			resetForm();
			toast({
				title: 'Success',
				description: 'Doctor created successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to create doctor',
				variant: 'destructive',
			});
		}
	};

	const handleUpdateDoctor = async () => {
		if (!selectedDoctor) return;
		
		try {
			await updateDoctor(selectedDoctor._id, formData);
			setIsEditDialogOpen(false);
			resetForm();
			toast({
				title: 'Success',
				description: 'Doctor updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to update doctor',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
		if (!confirm(`Are you sure you want to delete "${doctorName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			await deleteDoctor(doctorId);
			toast({
				title: 'Success',
				description: 'Doctor deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete doctor',
				variant: 'destructive',
			});
		}
	};

	const handleSuspendDoctor = async (doctorId: string, doctorName: string) => {
		if (!confirm(`Are you sure you want to suspend "${doctorName}"?`)) {
			return;
		}

		try {
			await suspendDoctor(doctorId);
			toast({
				title: 'Success',
				description: 'Doctor suspended successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to suspend doctor',
				variant: 'destructive',
			});
		}
	};

	const handleUnsuspendDoctor = async (doctorId: string, doctorName: string) => {
		if (!confirm(`Are you sure you want to unsuspend "${doctorName}"?`)) {
			return;
		}

		try {
			await unsuspendDoctor(doctorId);
			toast({
				title: 'Success',
				description: 'Doctor unsuspended successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to unsuspend doctor',
				variant: 'destructive',
			});
		}
	};

	const openEditDialog = (doctor: Doctor) => {
		setSelectedDoctor(doctor);
		setFormData({
			first_name: doctor.first_name,
			last_name: doctor.last_name,
			email: doctor.email,
			password: '', // Don't prefill password
			phone_number: doctor.phone_number,
			gender: doctor.gender || '',
			address: doctor.address || '',
			specialization: doctor.specialization,
			department_id: doctor.department_id || '',
			years_of_experience: doctor.years_of_experience,
			qualification: doctor.qualification || '',
			profile_image_url: doctor.profile_image_url || '',
		});
		setIsEditDialogOpen(true);
	};

	// Filter doctors based on search and filters
	const filteredDoctors = doctors.filter((doctor) => {
		const matchesSearch = 
			`${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
		
		const matchesDepartment = departmentFilter === 'all' || doctor.department_id === departmentFilter;
		
		return matchesSearch && matchesStatus && matchesDepartment;
	});

	if (doctorsLoading || departmentsLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading doctors...</p>
				</div>
			</div>
		);
	}

	if (doctorsError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">Error loading doctors</div>
					<p className="text-gray-600 mb-4">{doctorsError}</p>
					<Button onClick={() => loadDoctors()}>Retry</Button>
				</div>
			</div>
		);
	}

	return (
		<ProtectedRoute allowedRoles={['hospital', 'admin']}>
			<ResponsiveDashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
				<div className="space-y-8">
					{/* Header Section */}
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
							<p className="text-gray-600 mt-2">
								Manage hospital doctors and their information
							</p>
						</div>
						<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
							<DialogTrigger asChild>
								<Button className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									Add Doctor
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Create New Doctor</DialogTitle>
									<DialogDescription>
										Add a new doctor to your hospital system.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="first_name">First Name</Label>
											<Input
												id="first_name"
												value={formData.first_name}
												onChange={(e) =>
													setFormData({ ...formData, first_name: e.target.value })
												}
												placeholder="John"
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="last_name">Last Name</Label>
											<Input
												id="last_name"
												value={formData.last_name}
												onChange={(e) =>
													setFormData({ ...formData, last_name: e.target.value })
												}
												placeholder="Doe"
											/>
										</div>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											placeholder="john.doe@hospital.com"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											type="password"
											value={formData.password}
											onChange={(e) =>
												setFormData({ ...formData, password: e.target.value })
											}
											placeholder="Secure password"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="phone_number">Phone Number</Label>
											<Input
												id="phone_number"
												value={formData.phone_number}
												onChange={(e) =>
													setFormData({ ...formData, phone_number: e.target.value })
												}
												placeholder="+1 (555) 123-4567"
											/>
										</div>
										<div className="grid gap-2">
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
													<SelectItem value="male">Male</SelectItem>
													<SelectItem value="female">Female</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="address">Address</Label>
										<Textarea
											id="address"
											value={formData.address}
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
											placeholder="Full address"
											rows={2}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="specialization">Specialization</Label>
											<Input
												id="specialization"
												value={formData.specialization}
												onChange={(e) =>
													setFormData({ ...formData, specialization: e.target.value })
												}
												placeholder="e.g., Cardiology"
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="department_id">Department</Label>
											<Select
												value={formData.department_id}
												onValueChange={(value) =>
													setFormData({ ...formData, department_id: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select department" />
												</SelectTrigger>
												<SelectContent>
													{departments.map((dept) => (
														<SelectItem key={dept._id} value={dept._id}>
															{dept.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="years_of_experience">Years of Experience</Label>
											<Input
												id="years_of_experience"
												type="number"
												value={formData.years_of_experience}
												onChange={(e) =>
													setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
												}
												placeholder="5"
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="qualification">Qualification</Label>
											<Input
												id="qualification"
												value={formData.qualification}
												onChange={(e) =>
													setFormData({ ...formData, qualification: e.target.value })
												}
												placeholder="MD, PhD, etc."
											/>
										</div>
									</div>
								</div>
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
										Cancel
									</Button>
									<Button 
										onClick={handleCreateDoctor}
										disabled={!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()}
									>
										Create Doctor
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
								<UserCheck className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{doctors.length}</div>
								<p className="text-xs text-muted-foreground">
									Registered doctors
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
								<Stethoscope className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{doctors.filter(d => d.status === 'active').length}
								</div>
								<p className="text-xs text-muted-foreground">
									Currently active ({doctors.length > 0 ? Math.round((doctors.filter(d => d.status === 'active').length / doctors.length) * 100) : 0}%)
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Departments</CardTitle>
								<Building2 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{new Set(doctors.map(d => d.specialization)).size}
								</div>
								<p className="text-xs text-muted-foreground">
									Specialties covered
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{doctors.length > 0 
										? Math.round(doctors.reduce((sum, d) => sum + (d.years_of_experience || 0), 0) / doctors.length * 10) / 10
										: 0}
								</div>
								<p className="text-xs text-muted-foreground">
									Years experience
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Additional Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Most Common Specialty</CardTitle>
								<Stethoscope className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-lg font-bold">
									{doctors.length > 0 ? (() => {
										const specialties = doctors.map(d => d.specialization);
										const counts = specialties.reduce((acc, specialty) => {
											acc[specialty] = (acc[specialty] || 0) + 1;
											return acc;
										}, {} as Record<string, number>);
										const mostCommon = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
										return mostCommon ? mostCommon[0] : 'N/A';
									})() : 'N/A'}
								</div>
								<p className="text-xs text-muted-foreground">
									{doctors.length > 0 ? (() => {
										const specialties = doctors.map(d => d.specialization);
										const counts = specialties.reduce((acc, specialty) => {
											acc[specialty] = (acc[specialty] || 0) + 1;
											return acc;
										}, {} as Record<string, number>);
										const mostCommon = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
										return mostCommon ? `${mostCommon[1]} doctor${mostCommon[1] > 1 ? 's' : ''}` : '';
									})() : ''}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Experience Range</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-lg font-bold">
									{doctors.length > 0 ? (() => {
										const experiences = doctors.map(d => d.years_of_experience || 0);
										const min = Math.min(...experiences);
										const max = Math.max(...experiences);
										return `${min} - ${max} yrs`;
									})() : '0 yrs'}
								</div>
								<p className="text-xs text-muted-foreground">
									Min to max experience
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
								<Plus className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-lg font-bold">
									{(() => {
										const oneWeekAgo = new Date();
										oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
										return doctors.filter(d => new Date(d.created_at) > oneWeekAgo).length;
									})()}
								</div>
								<p className="text-xs text-muted-foreground">
									Added this week
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Filters and Search */}
					<Card>
						<CardHeader>
							<CardTitle>Search and Filter</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
										<Input
											placeholder="Search doctors..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="suspended">Suspended</SelectItem>
									</SelectContent>
								</Select>
								<Select value={departmentFilter} onValueChange={setDepartmentFilter}>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Filter by department" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Departments</SelectItem>
										{departments.map((dept) => (
											<SelectItem key={dept._id} value={dept._id}>
												{dept.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Doctors List */}
					<Card>
						<CardHeader>
							<CardTitle>All Doctors ({filteredDoctors.length})</CardTitle>
						</CardHeader>
						<CardContent>
							{filteredDoctors.length === 0 ? (
								<div className="text-center py-8">
									<UserCheck className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-2 text-sm font-semibold text-gray-900">
										No doctors found
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
											? 'Try adjusting your search or filters.'
											: 'Get started by adding a new doctor.'}
									</p>
									{!searchTerm && statusFilter === 'all' && departmentFilter === 'all' && (
										<div className="mt-6">
											<Button onClick={() => setIsCreateDialogOpen(true)}>
												<Plus className="h-4 w-4 mr-2" />
												Add Doctor
											</Button>
										</div>
									)}
								</div>
							) : (
								<div className="grid gap-4">
									{filteredDoctors.map((doctor) => (
										<div
											key={doctor._id}
											className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
										>
											<div className="flex-1">
												<div className="flex items-center gap-4">
													<div className="flex-1">
														<h3 className="font-semibold text-gray-900">
															Dr. {doctor.first_name} {doctor.last_name}
														</h3>
														<p className="text-sm text-gray-600">
															{doctor.specialization} • {doctor.email}
														</p>
														<p className="text-sm text-gray-500">
															{doctor.years_of_experience} years experience • {doctor.phone_number}
														</p>
													</div>
													<div className="text-right">
														<Badge 
															variant={
																doctor.status === 'active' ? 'default' :
																doctor.status === 'suspended' ? 'destructive' : 'secondary'
															}
														>
															{doctor.status}
														</Badge>
														<p className="text-sm text-gray-500 mt-1">
															{departments.find(d => d._id === doctor.department_id)?.name || 'No Department'}
														</p>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => openEditDialog(doctor)}
														>
															<Edit className="h-4 w-4 mr-2" />
															Edit
														</DropdownMenuItem>
														{doctor.status === 'active' ? (
															<DropdownMenuItem
																onClick={() => handleSuspendDoctor(doctor._id, `${doctor.first_name} ${doctor.last_name}`)}
															>
																<Users className="h-4 w-4 mr-2" />
																Suspend
															</DropdownMenuItem>
														) : doctor.status === 'inactive' ? (
															<DropdownMenuItem
																onClick={() => handleUnsuspendDoctor(doctor._id, `${doctor.first_name} ${doctor.last_name}`)}
															>
																<UserCheck className="h-4 w-4 mr-2" />
																Unsuspend
															</DropdownMenuItem>
														) : null}
														<DropdownMenuItem
															className="text-red-600"
															onClick={() =>
																handleDeleteDoctor(doctor._id, `${doctor.first_name} ${doctor.last_name}`)
															}
														>
															<Trash2 className="h-4 w-4 mr-2" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Edit Dialog */}
					<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
						<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Edit Doctor</DialogTitle>
								<DialogDescription>
									Update doctor information.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="edit-first_name">First Name</Label>
										<Input
											id="edit-first_name"
											value={formData.first_name}
											onChange={(e) =>
												setFormData({ ...formData, first_name: e.target.value })
											}
											placeholder="John"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="edit-last_name">Last Name</Label>
										<Input
											id="edit-last_name"
											value={formData.last_name}
											onChange={(e) =>
												setFormData({ ...formData, last_name: e.target.value })
											}
											placeholder="Doe"
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-email">Email</Label>
									<Input
										id="edit-email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="john.doe@hospital.com"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="edit-phone_number">Phone Number</Label>
										<Input
											id="edit-phone_number"
											value={formData.phone_number}
											onChange={(e) =>
												setFormData({ ...formData, phone_number: e.target.value })
											}
											placeholder="+1 (555) 123-4567"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="edit-gender">Gender</Label>
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
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-address">Address</Label>
									<Textarea
										id="edit-address"
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										placeholder="Full address"
										rows={2}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="edit-specialization">Specialization</Label>
										<Input
											id="edit-specialization"
											value={formData.specialization}
											onChange={(e) =>
												setFormData({ ...formData, specialization: e.target.value })
											}
											placeholder="e.g., Cardiology"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="edit-department_id">Department</Label>
										<Select
											value={formData.department_id}
											onValueChange={(value) =>
												setFormData({ ...formData, department_id: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select department" />
											</SelectTrigger>
											<SelectContent>
												{departments.map((dept) => (
													<SelectItem key={dept._id} value={dept._id}>
														{dept.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="edit-years_of_experience">Years of Experience</Label>
										<Input
											id="edit-years_of_experience"
											type="number"
											value={formData.years_of_experience}
											onChange={(e) =>
												setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
											}
											placeholder="5"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="edit-qualification">Qualification</Label>
										<Input
											id="edit-qualification"
											value={formData.qualification}
											onChange={(e) =>
												setFormData({ ...formData, qualification: e.target.value })
											}
											placeholder="MD, PhD, etc."
										/>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
									Cancel
								</Button>
								<Button 
									onClick={handleUpdateDoctor}
									disabled={!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()}
								>
									Update Doctor
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}

export default DoctorsPage;
