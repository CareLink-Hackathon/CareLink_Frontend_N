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
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	MoreHorizontal,
	Edit,
	Trash2,
	Search,
	UserPlus,
	UserCheck,
	Calendar,
	Users,
	Phone,
	Mail,
	MapPin,
	Clock,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';
import { toast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/services/admin-service';

function PatientsPage() {
	const { user } = useAuth();
	const {
		patients,
		patientsLoading,
		patientsError,
		loadPatients,
		updatePatient,
		deletePatient,
		suspendPatient,
		activatePatient,
		unreadNotifications,
	} = useAdmin();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [languageFilter, setLanguageFilter] = useState('all');
	
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		phone_number: '',
		language: 'en',
		date_of_birth: '',
		gender: '',
		address: '',
	});

	useEffect(() => {
		console.log('👥 PatientsPage - useEffect triggered with user:', {
			hasUser: !!user,
			userId: user?._id,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin,
			currentPath: window.location.pathname
		});

		if (user && (user.account_type === 'hospital' || user.role === 'admin')) {
			console.log('✅ PatientsPage - Loading patients...');
			loadPatients();
		} else {
			console.log('❌ PatientsPage - Not loading data - user not qualified');
		}
	}, [user]);

	const sidebarItems = getAdminSidebarItems('patients');

	const userInfo = getAdminUserInfo(user);

	const resetForm = () => {
		setFormData({
			first_name: '',
			last_name: '',
			email: '',
			phone_number: '',
			language: 'en',
			date_of_birth: '',
			gender: '',
			address: '',
		});
		setSelectedPatient(null);
	};

	const handleUpdatePatient = async () => {
		if (!selectedPatient) return;
		
		try {
			await updatePatient(selectedPatient._id, formData);
			setIsEditDialogOpen(false);
			resetForm();
			toast({
				title: 'Success',
				description: 'Patient updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to update patient',
				variant: 'destructive',
			});
		}
	};

	const handleDeletePatient = async (patientId: string, patientName: string) => {
		if (!confirm(`Are you sure you want to delete "${patientName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			await deletePatient(patientId);
			toast({
				title: 'Success',
				description: 'Patient deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete patient',
				variant: 'destructive',
			});
		}
	};

	const handleSuspendPatient = async (patientId: string, patientName: string) => {
		if (!confirm(`Are you sure you want to suspend "${patientName}"?`)) {
			return;
		}

		try {
			await suspendPatient(patientId);
			toast({
				title: 'Success',
				description: 'Patient suspended successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to suspend patient',
				variant: 'destructive',
			});
		}
	};

	const handleActivatePatient = async (patientId: string, patientName: string) => {
		try {
			await activatePatient(patientId);
			toast({
				title: 'Success',
				description: 'Patient activated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to activate patient',
				variant: 'destructive',
			});
		}
	};

	const openEditDialog = (patient: Patient) => {
		setSelectedPatient(patient);
		setFormData({
			first_name: patient.first_name,
			last_name: patient.last_name,
			email: patient.email,
			phone_number: patient.phone_number,
			language: patient.language,
			date_of_birth: (patient as any).date_of_birth || '',
			gender: (patient as any).gender || '',
			address: (patient as any).address || '',
		});
		setIsEditDialogOpen(true);
	};

	// Filter patients based on search and filters
	const filteredPatients = patients.filter((patient) => {
		const matchesSearch = 
			`${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			patient.phone_number.includes(searchTerm);
		
		const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
		
		const matchesLanguage = languageFilter === 'all' || patient.language === languageFilter;
		
		return matchesSearch && matchesStatus && matchesLanguage;
	});

	// Get unique languages for filter
	const availableLanguages = [...new Set(patients.map(p => p.language))];

	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString();
	};

	if (patientsLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading patients...</p>
				</div>
			</div>
		);
	}

	if (patientsError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">Error loading patients</div>
					<p className="text-gray-600 mb-4">{patientsError}</p>
					<Button onClick={() => loadPatients()}>Retry</Button>
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
							<h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
							<p className="text-gray-600 mt-2">
								Manage registered patients and their information
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Patients</CardTitle>
								<UserPlus className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{patients.length}</div>
								<p className="text-xs text-muted-foreground">
									Registered patients
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Active</CardTitle>
								<UserCheck className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{patients.filter(p => p.status === 'active').length}
								</div>
								<p className="text-xs text-muted-foreground">
									Currently active
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
								<Calendar className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{patients.reduce((sum, p) => sum + (p.total_appointments || 0), 0)}
								</div>
								<p className="text-xs text-muted-foreground">
									All-time appointments
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
								<Clock className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{patients.filter(p => {
										const createdAt = new Date(p.created_at);
										const weekAgo = new Date();
										weekAgo.setDate(weekAgo.getDate() - 7);
										return createdAt > weekAgo;
									}).length}
								</div>
								<p className="text-xs text-muted-foreground">
									This week
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
											placeholder="Search patients..."
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
									</SelectContent>
								</Select>
								<Select value={languageFilter} onValueChange={setLanguageFilter}>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Filter by language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Languages</SelectItem>
										{availableLanguages.map((lang) => (
											<SelectItem key={lang} value={lang}>
												{lang === 'en' ? 'English' : 
												 lang === 'es' ? 'Spanish' : 
												 lang === 'fr' ? 'French' : lang.toUpperCase()}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Patients List */}
					<Card>
						<CardHeader>
							<CardTitle>All Patients ({filteredPatients.length})</CardTitle>
						</CardHeader>
						<CardContent>
							{filteredPatients.length === 0 ? (
								<div className="text-center py-8">
									<UserPlus className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-2 text-sm font-semibold text-gray-900">
										No patients found
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{searchTerm || statusFilter !== 'all' || languageFilter !== 'all'
											? 'Try adjusting your search or filters.'
											: 'Patients will appear here when they register.'}
									</p>
								</div>
							) : (
								<div className="grid gap-4">
									{filteredPatients.map((patient) => (
										<div
											key={patient._id}
											className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
										>
											<div className="flex-1">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<h3 className="font-semibold text-gray-900">
															{patient.first_name} {patient.last_name}
														</h3>
														<div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
															<div className="flex items-center gap-1">
																<Mail className="h-3 w-3" />
																{patient.email}
															</div>
															<div className="flex items-center gap-1">
																<Phone className="h-3 w-3" />
																{patient.phone_number}
															</div>
														</div>
														<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
															<span>Language: {patient.language === 'en' ? 'English' : patient.language.toUpperCase()}</span>
															<span>Joined: {formatDate(patient.created_at)}</span>
															{patient.last_visit && (
																<span>Last visit: {formatDate(patient.last_visit)}</span>
															)}
														</div>
													</div>
													<div className="text-right">
														<Badge 
															variant={
																patient.status === 'active' ? 'default' : 'secondary'
															}
														>
															{patient.status}
														</Badge>
														<p className="text-sm text-gray-500 mt-1">
															{patient.total_appointments || 0} appointments
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
															onClick={() => openEditDialog(patient)}
														>
															<Edit className="h-4 w-4 mr-2" />
															Edit
														</DropdownMenuItem>
														{patient.status === 'active' ? (
															<DropdownMenuItem
																onClick={() => handleSuspendPatient(patient._id, `${patient.first_name} ${patient.last_name}`)}
															>
																<Users className="h-4 w-4 mr-2" />
																Suspend
															</DropdownMenuItem>
														) : (
															<DropdownMenuItem
																onClick={() => handleActivatePatient(patient._id, `${patient.first_name} ${patient.last_name}`)}
															>
																<UserCheck className="h-4 w-4 mr-2" />
																Activate
															</DropdownMenuItem>
														)}
														<DropdownMenuItem
															className="text-red-600"
															onClick={() =>
																handleDeletePatient(patient._id, `${patient.first_name} ${patient.last_name}`)
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
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Edit Patient</DialogTitle>
								<DialogDescription>
									Update patient information.
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
										placeholder="john.doe@email.com"
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
										<Label htmlFor="edit-language">Language</Label>
										<Select
											value={formData.language}
											onValueChange={(value) =>
												setFormData({ ...formData, language: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select language" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="en">English</SelectItem>
												<SelectItem value="es">Spanish</SelectItem>
												<SelectItem value="fr">French</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="edit-date_of_birth">Date of Birth</Label>
										<Input
											id="edit-date_of_birth"
											type="date"
											value={formData.date_of_birth}
											onChange={(e) =>
												setFormData({ ...formData, date_of_birth: e.target.value })
											}
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
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
									Cancel
								</Button>
								<Button 
									onClick={handleUpdatePatient}
									disabled={!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()}
								>
									Update Patient
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}

export default PatientsPage;
