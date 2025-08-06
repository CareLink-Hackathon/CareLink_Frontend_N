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
	Building2,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';
import { toast } from '@/hooks/use-toast';

function DepartmentsPage() {
	const { user } = useAuth();
	const {
		departments,
		departmentsLoading,
		departmentsError,
		loadDepartments,
		createDepartment,
		updateDepartment,
		deleteDepartment,
		unreadNotifications,
	} = useAdmin();

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});

	useEffect(() => {
		console.log('🏢 DepartmentsPage - useEffect triggered with user:', {
			hasUser: !!user,
			userId: user?._id,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin,
			currentPath: window.location.pathname
		});

		if (user && (user.account_type === 'hospital' || user.role === 'admin')) {
			console.log('✅ DepartmentsPage - Loading departments...');
			loadDepartments();
		} else {
			console.log('❌ DepartmentsPage - Not loading data - user not qualified');
		}
	}, [user]);

	const sidebarItems = getAdminSidebarItems('departments');

	const userInfo = getAdminUserInfo(user);

	const resetForm = () => {
		setFormData({ name: '', description: '' });
		setSelectedDepartment(null);
	};

	const handleCreateDepartment = async () => {
		try {
			await createDepartment(formData);
			setIsCreateDialogOpen(false);
			resetForm();
			toast({
				title: 'Success',
				description: 'Department created successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to create department',
				variant: 'destructive',
			});
		}
	};

	const handleUpdateDepartment = async () => {
		if (!selectedDepartment) return;
		
		try {
			await updateDepartment(selectedDepartment._id, formData);
			setIsEditDialogOpen(false);
			resetForm();
			toast({
				title: 'Success',
				description: 'Department updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to update department',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
		if (!confirm(`Are you sure you want to delete "${departmentName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			await deleteDepartment(departmentId);
			toast({
				title: 'Success',
				description: 'Department deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete department',
				variant: 'destructive',
			});
		}
	};

	const openEditDialog = (department: any) => {
		setSelectedDepartment(department);
		setFormData({
			name: department.name,
			description: department.description || '',
		});
		setIsEditDialogOpen(true);
	};

	if (departmentsLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading departments...</p>
				</div>
			</div>
		);
	}

	if (departmentsError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">Error loading departments</div>
					<p className="text-gray-600 mb-4">{departmentsError}</p>
					<Button onClick={() => loadDepartments()}>Retry</Button>
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
							<h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
							<p className="text-gray-600 mt-2">
								Manage hospital departments and their information
							</p>
						</div>
						<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
							<DialogTrigger asChild>
								<Button className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									Add Department
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create New Department</DialogTitle>
									<DialogDescription>
										Add a new department to your hospital system.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label htmlFor="name">Department Name</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											placeholder="e.g., Cardiology"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) =>
												setFormData({ ...formData, description: e.target.value })
											}
											placeholder="Brief description of the department"
											rows={3}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
										Cancel
									</Button>
									<Button 
										onClick={handleCreateDepartment}
										disabled={!formData.name.trim()}
									>
										Create Department
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Departments</CardTitle>
								<Building2 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{departments.length}</div>
								<p className="text-xs text-muted-foreground">
									Active departments
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Departments List */}
					<Card>
						<CardHeader>
							<CardTitle>All Departments</CardTitle>
						</CardHeader>
						<CardContent>
							{departments.length === 0 ? (
								<div className="text-center py-8">
									<Building2 className="mx-auto h-12 w-12 text-gray-400" />
									<h3 className="mt-2 text-sm font-semibold text-gray-900">
										No departments
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Get started by creating a new department.
									</p>
									<div className="mt-6">
										<Button onClick={() => setIsCreateDialogOpen(true)}>
											<Plus className="h-4 w-4 mr-2" />
											Add Department
										</Button>
									</div>
								</div>
							) : (
								<div className="grid gap-4">
									{departments.map((department) => (
										<div
											key={department._id}
											className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
										>
											<div className="flex-1">
												<h3 className="font-semibold text-gray-900">
													{department.name}
												</h3>
												{department.description && (
													<p className="text-sm text-gray-600 mt-1">
														{department.description}
													</p>
												)}
											</div>
											<div className="flex items-center gap-2">
												<Badge variant="secondary">Active</Badge>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => openEditDialog(department)}
														>
															<Edit className="h-4 w-4 mr-2" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-red-600"
															onClick={() =>
																handleDeleteDepartment(department._id, department.name)
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
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Department</DialogTitle>
								<DialogDescription>
									Update department information.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="edit-name">Department Name</Label>
									<Input
										id="edit-name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="e.g., Cardiology"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-description">Description</Label>
									<Textarea
										id="edit-description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										placeholder="Brief description of the department"
										rows={3}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
									Cancel
								</Button>
								<Button 
									onClick={handleUpdateDepartment}
									disabled={!formData.name.trim()}
								>
									Update Department
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}

export default DepartmentsPage;
