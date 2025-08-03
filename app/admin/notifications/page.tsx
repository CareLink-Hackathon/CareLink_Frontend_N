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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
	Send,
	Eye,
	Trash2,
	AlertCircle,
	CheckCircle,
	Info,
	MessageSquare,
	Clock,
	User,
	Droplets,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNotifications() {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			active: true,
			badge: '5',
		},
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	const [notifications, setNotifications] = useState([
		{
			id: 1,
			title: 'System Maintenance Scheduled',
			message:
				'The hospital management system will undergo scheduled maintenance on January 30, 2025, from 2:00 AM to 4:00 AM.',
			type: 'system',
			priority: 'high',
			recipients: 'all',
			sentBy: 'System Administrator',
			sentAt: '2025-01-28T10:30:00Z',
			status: 'sent',
			readCount: 45,
			totalRecipients: 89,
		},
		{
			id: 2,
			title: 'New Doctor Onboarded',
			message:
				'Dr. Maria Rodriguez has joined our cardiology department. Please welcome her to the team.',
			type: 'announcement',
			priority: 'medium',
			recipients: 'doctors',
			sentBy: 'HR Department',
			sentAt: '2025-01-28T09:15:00Z',
			status: 'sent',
			readCount: 23,
			totalRecipients: 45,
		},
		{
			id: 3,
			title: 'Emergency Protocol Update',
			message:
				'New emergency protocols have been implemented. All staff must review the updated procedures by February 1st.',
			type: 'emergency',
			priority: 'high',
			recipients: 'all',
			sentBy: 'Medical Director',
			sentAt: '2025-01-28T08:45:00Z',
			status: 'sent',
			readCount: 67,
			totalRecipients: 134,
		},
		{
			id: 4,
			title: 'Patient Record System Update',
			message:
				'The patient record system has been updated with new features. Training sessions will be scheduled soon.',
			type: 'system',
			priority: 'medium',
			recipients: 'all',
			sentBy: 'IT Department',
			sentAt: '2025-01-27T14:20:00Z',
			status: 'sent',
			readCount: 89,
			totalRecipients: 134,
		},
		{
			id: 5,
			title: 'Appointment Reminder Settings',
			message:
				'Patients can now customize their appointment reminder preferences. Please inform them about this new feature.',
			type: 'feature',
			priority: 'low',
			recipients: 'reception',
			sentBy: 'Product Team',
			sentAt: '2025-01-27T11:30:00Z',
			status: 'draft',
			readCount: 0,
			totalRecipients: 12,
		},
	]);

	const [formData, setFormData] = useState({
		title: '',
		message: '',
		type: 'announcement',
		priority: 'medium',
		recipients: 'all',
	});

	const notificationTypes = [
		{
			value: 'system',
			label: 'System',
			icon: Settings,
			color: 'text-blue-600',
		},
		{
			value: 'announcement',
			label: 'Announcement',
			icon: MessageSquare,
			color: 'text-green-600',
		},
		{
			value: 'emergency',
			label: 'Emergency',
			icon: AlertCircle,
			color: 'text-red-600',
		},
		{
			value: 'feature',
			label: 'Feature Update',
			icon: Info,
			color: 'text-purple-600',
		},
	];

	const priorityLevels = [
		{ value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
		{
			value: 'medium',
			label: 'Medium',
			color: 'bg-yellow-100 text-yellow-800',
		},
		{ value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
	];

	const recipientOptions = [
		{ value: 'all', label: 'All Users' },
		{ value: 'doctors', label: 'Doctors Only' },
		{ value: 'patients', label: 'Patients Only' },
		{ value: 'reception', label: 'Reception Staff' },
		{ value: 'admin', label: 'Administrators' },
	];

	const filteredNotifications = notifications.filter((notification) => {
		const matchesSearch =
			notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
			notification.sentBy.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesTab =
			selectedTab === 'all' ||
			(selectedTab === 'sent' && notification.status === 'sent') ||
			(selectedTab === 'draft' && notification.status === 'draft') ||
			selectedTab === notification.type;

		return matchesSearch && matchesTab;
	});

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			const newNotification = {
				id: notifications.length + 1,
				...formData,
				sentBy: 'Admin',
				sentAt: new Date().toISOString(),
				status: 'sent',
				readCount: 0,
				totalRecipients:
					formData.recipients === 'all'
						? 134
						: formData.recipients === 'doctors'
						? 45
						: 89,
			};

			setNotifications([newNotification, ...notifications]);
			setFormData({
				title: '',
				message: '',
				type: 'announcement',
				priority: 'medium',
				recipients: 'all',
			});
			setIsCreateOpen(false);
			setIsLoading(false);
		}, 1000);
	};

	const handleDelete = (notificationId: number) => {
		setNotifications(notifications.filter((n) => n.id !== notificationId));
	};

	const getTypeIcon = (type: string) => {
		const typeConfig = notificationTypes.find((t) => t.value === type);
		if (!typeConfig) return MessageSquare;
		return typeConfig.icon;
	};

	const getTypeColor = (type: string) => {
		const typeConfig = notificationTypes.find((t) => t.value === type);
		if (!typeConfig) return 'text-gray-600';
		return typeConfig.color;
	};

	const getPriorityColor = (priority: string) => {
		const priorityConfig = priorityLevels.find((p) => p.value === priority);
		if (!priorityConfig) return 'bg-gray-100 text-gray-800';
		return priorityConfig.color;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
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
									placeholder="Search notifications..."
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

				{/* Notifications Content */}
				<div className="flex-1 p-4 md:p-6 overflow-y-auto">
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Notification Center
							</h1>
							<p className="text-gray-600">
								Send and manage system-wide notifications
							</p>
						</div>

						<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
							<DialogTrigger asChild>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">
									<Plus className="w-4 h-4 mr-2" />
									Create Notification
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Create New Notification</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleCreate} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											value={formData.title}
											onChange={(e) =>
												setFormData({ ...formData, title: e.target.value })
											}
											placeholder="Enter notification title"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											value={formData.message}
											onChange={(e) =>
												setFormData({ ...formData, message: e.target.value })
											}
											placeholder="Enter notification message"
											rows={4}
											required
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="type">Type</Label>
											<Select
												value={formData.type}
												onValueChange={(value) =>
													setFormData({ ...formData, type: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													{notificationTypes.map((type) => (
														<SelectItem key={type.value} value={type.value}>
															{type.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="priority">Priority</Label>
											<Select
												value={formData.priority}
												onValueChange={(value) =>
													setFormData({ ...formData, priority: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
												<SelectContent>
													{priorityLevels.map((priority) => (
														<SelectItem
															key={priority.value}
															value={priority.value}
														>
															{priority.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="recipients">Recipients</Label>
											<Select
												value={formData.recipients}
												onValueChange={(value) =>
													setFormData({ ...formData, recipients: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select recipients" />
												</SelectTrigger>
												<SelectContent>
													{recipientOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
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
											<Send className="w-4 h-4 mr-2" />
											{isLoading ? 'Sending...' : 'Send Notification'}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Bell className="w-8 h-8 text-blue-600" />
									<div>
										<p className="text-2xl font-bold">{notifications.length}</p>
										<p className="text-sm text-gray-600">Total Notifications</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Send className="w-8 h-8 text-green-600" />
									<div>
										<p className="text-2xl font-bold">
											{notifications.filter((n) => n.status === 'sent').length}
										</p>
										<p className="text-sm text-gray-600">Sent</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<FileText className="w-8 h-8 text-yellow-600" />
									<div>
										<p className="text-2xl font-bold">
											{notifications.filter((n) => n.status === 'draft').length}
										</p>
										<p className="text-sm text-gray-600">Drafts</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<AlertCircle className="w-8 h-8 text-red-600" />
									<div>
										<p className="text-2xl font-bold">
											{
												notifications.filter((n) => n.priority === 'high')
													.length
											}
										</p>
										<p className="text-sm text-gray-600">High Priority</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Tabs */}
					<Tabs
						value={selectedTab}
						onValueChange={setSelectedTab}
						className="mb-6"
					>
						<TabsList className="grid w-full grid-cols-7">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="sent">Sent</TabsTrigger>
							<TabsTrigger value="draft">Drafts</TabsTrigger>
							<TabsTrigger value="system">System</TabsTrigger>
							<TabsTrigger value="announcement">Announcements</TabsTrigger>
							<TabsTrigger value="emergency">Emergency</TabsTrigger>
							<TabsTrigger value="feature">Features</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Notifications List */}
					<div className="space-y-4">
						{filteredNotifications.map((notification) => {
							const TypeIcon = getTypeIcon(notification.type);
							return (
								<Card
									key={notification.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardContent className="p-6">
										<div className="flex items-start space-x-4">
											<div
												className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(
													notification.type
												)}`}
											>
												<TypeIcon className="w-5 h-5" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between mb-2">
													<div className="flex-1">
														<h3 className="font-semibold text-lg mb-1">
															{notification.title}
														</h3>
														<p className="text-gray-600 text-sm mb-2 line-clamp-2">
															{notification.message}
														</p>
													</div>
													<div className="flex items-center space-x-2 ml-4">
														<Badge
															className={getPriorityColor(
																notification.priority
															)}
														>
															{notification.priority}
														</Badge>
														<Badge
															className={
																notification.status === 'sent'
																	? 'bg-green-100 text-green-800'
																	: 'bg-gray-100 text-gray-800'
															}
														>
															{notification.status}
														</Badge>
													</div>
												</div>

												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-4 text-sm text-gray-500">
														<div className="flex items-center space-x-1">
															<User className="w-4 h-4" />
															<span>{notification.sentBy}</span>
														</div>
														<div className="flex items-center space-x-1">
															<Clock className="w-4 h-4" />
															<span>{formatDate(notification.sentAt)}</span>
														</div>
														<div className="flex items-center space-x-1">
															<Eye className="w-4 h-4" />
															<span>
																{notification.readCount}/
																{notification.totalRecipients}
															</span>
														</div>
													</div>

													<div className="flex space-x-2">
														<Button size="sm" variant="outline">
															<Eye className="w-4 h-4 mr-1" />
															View Details
														</Button>
														{notification.status === 'draft' && (
															<Button size="sm" variant="outline">
																<Send className="w-4 h-4 mr-1" />
																Send Now
															</Button>
														)}
														<Button
															size="sm"
															variant="outline"
															className="text-red-600 hover:text-red-700"
															onClick={() => handleDelete(notification.id)}
														>
															<Trash2 className="w-4 h-4 mr-1" />
															Delete
														</Button>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{filteredNotifications.length === 0 && (
						<div className="text-center py-12">
							<Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No notifications found
							</h3>
							<p className="text-gray-600">
								Try adjusting your search or filter criteria.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
