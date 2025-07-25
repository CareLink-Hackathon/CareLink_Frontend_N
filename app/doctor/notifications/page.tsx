'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Calendar,
	Users,
	Activity,
	FileText,
	Search,
	Filter,
	MoreVertical,
	Check,
	X,
	Clock,
	AlertTriangle,
	Info,
	CheckCircle,
	MessageSquare,
	UserPlus,
	FileX,
	CalendarX,
	Heart,
} from 'lucide-react';

export default function DoctorNotifications() {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/doctor/dashboard' },
		{ icon: Calendar, label: 'My Appointments', href: '/doctor/appointments' },
		{ icon: Users, label: 'My Patients', href: '/doctor/patients' },
		{ icon: FileText, label: 'Medical Records', href: '/doctor/records' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/doctor/notifications',
			active: true,
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
	];

	const notifications = [
		{
			id: 1,
			type: 'appointment',
			priority: 'high',
			title: 'Urgent: Patient Emergency',
			message:
				'John Doe (P001) has been admitted to the ER with chest pain. Immediate attention required.',
			timestamp: '5 minutes ago',
			read: false,
			category: 'emergency',
			patientName: 'John Doe',
			patientId: 'P001',
			icon: <Heart className="w-5 h-5 text-red-500" />,
			actionRequired: true,
		},
		{
			id: 2,
			type: 'message',
			priority: 'normal',
			title: 'New Patient Message',
			message:
				'Jane Smith has sent you a message regarding her medication side effects.',
			timestamp: '15 minutes ago',
			read: false,
			category: 'communication',
			patientName: 'Jane Smith',
			patientId: 'P002',
			icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
			actionRequired: true,
		},
		{
			id: 3,
			type: 'appointment',
			priority: 'normal',
			title: 'Appointment Reminder',
			message: 'You have an appointment with Bob Wilson at 2:00 PM today.',
			timestamp: '30 minutes ago',
			read: false,
			category: 'reminder',
			patientName: 'Bob Wilson',
			patientId: 'P003',
			icon: <Calendar className="w-5 h-5 text-green-500" />,
			actionRequired: false,
		},
		{
			id: 4,
			type: 'system',
			priority: 'low',
			title: 'System Update',
			message:
				'CareLink system will undergo maintenance tonight from 11 PM to 2 AM.',
			timestamp: '1 hour ago',
			read: true,
			category: 'system',
			icon: <Info className="w-5 h-5 text-gray-500" />,
			actionRequired: false,
		},
		{
			id: 5,
			type: 'appointment',
			priority: 'normal',
			title: 'Appointment Cancelled',
			message:
				'Alice Brown has cancelled her appointment scheduled for tomorrow at 10:00 AM.',
			timestamp: '2 hours ago',
			read: true,
			category: 'cancellation',
			patientName: 'Alice Brown',
			patientId: 'P004',
			icon: <CalendarX className="w-5 h-5 text-orange-500" />,
			actionRequired: false,
		},
		{
			id: 6,
			type: 'patient',
			priority: 'normal',
			title: 'New Patient Registration',
			message:
				'Michael Thompson has registered as a new patient and requested an appointment.',
			timestamp: '3 hours ago',
			read: true,
			category: 'registration',
			patientName: 'Michael Thompson',
			patientId: 'P005',
			icon: <UserPlus className="w-5 h-5 text-purple-500" />,
			actionRequired: true,
		},
		{
			id: 7,
			type: 'lab',
			priority: 'normal',
			title: 'Lab Results Available',
			message: 'Lab results for Sarah Connor are now available for review.',
			timestamp: '4 hours ago',
			read: true,
			category: 'results',
			patientName: 'Sarah Connor',
			patientId: 'P006',
			icon: <FileText className="w-5 h-5 text-teal-500" />,
			actionRequired: true,
		},
		{
			id: 8,
			type: 'system',
			priority: 'normal',
			title: 'Monthly Report Ready',
			message: 'Your monthly patient summary report is ready for download.',
			timestamp: 'Yesterday',
			read: true,
			category: 'report',
			icon: <CheckCircle className="w-5 h-5 text-green-500" />,
			actionRequired: false,
		},
	];

	const getFilteredNotifications = () => {
		let filtered = notifications;

		if (selectedTab !== 'all') {
			filtered = filtered.filter((notification) => {
				switch (selectedTab) {
					case 'unread':
						return !notification.read;
					case 'urgent':
						return (
							notification.priority === 'high' ||
							notification.category === 'emergency'
						);
					case 'appointments':
						return notification.type === 'appointment';
					case 'messages':
						return notification.type === 'message';
					default:
						return true;
				}
			});
		}

		if (searchTerm) {
			filtered = filtered.filter(
				(notification) =>
					notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					notification.message
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(notification.patientName &&
						notification.patientName
							.toLowerCase()
							.includes(searchTerm.toLowerCase()))
			);
		}

		return filtered;
	};

	const markAsRead = (id: number) => {
		// Simulate marking notification as read
		console.log(`Marking notification ${id} as read`);
	};

	const markAllAsRead = () => {
		// Simulate marking all notifications as read
		console.log('Marking all notifications as read');
	};

	const deleteNotification = (id: number) => {
		// Simulate deleting notification
		console.log(`Deleting notification ${id}`);
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'border-l-red-500 bg-red-50';
			case 'normal':
				return 'border-l-blue-500 bg-blue-50';
			case 'low':
				return 'border-l-gray-500 bg-gray-50';
			default:
				return 'border-l-gray-500 bg-white';
		}
	};

	const unreadCount = notifications.filter((n) => !n.read).length;
	const urgentCount = notifications.filter(
		(n) => n.priority === 'high' || n.category === 'emergency'
	).length;

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>SJ</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">DR. SARAH JOHNSON</h3>
							<p className="text-blue-100 text-sm">Cardiologist</p>
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
							<h1 className="text-2xl font-bold text-gray-900">
								Notifications
							</h1>
							<Badge className="bg-red-100 text-red-800">
								{unreadCount} Unread
							</Badge>
							{urgentCount > 0 && (
								<Badge className="bg-red-500 text-white">
									{urgentCount} Urgent
								</Badge>
							)}
						</div>
						<div className="flex items-center space-x-4">
							<Button variant="outline" onClick={markAllAsRead}>
								<Check className="w-4 h-4 mr-2" />
								Mark All Read
							</Button>
							<Button variant="outline" size="icon">
								<Settings className="w-4 h-4" />
							</Button>
							<Avatar className="w-8 h-8">
								<AvatarImage src="/placeholder.svg?height=32&width=32" />
								<AvatarFallback>SJ</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				{/* Search and Filters */}
				<div className="p-6 border-b border-gray-200 bg-white">
					<div className="flex items-center space-x-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search notifications..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</div>

				{/* Notifications Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<Tabs
						value={selectedTab}
						onValueChange={setSelectedTab}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="all">
								All ({notifications.length})
							</TabsTrigger>
							<TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
							<TabsTrigger value="urgent">Urgent ({urgentCount})</TabsTrigger>
							<TabsTrigger value="appointments">Appointments</TabsTrigger>
							<TabsTrigger value="messages">Messages</TabsTrigger>
						</TabsList>

						<TabsContent value={selectedTab} className="mt-6">
							<div className="space-y-4">
								{getFilteredNotifications().map((notification) => (
									<Card
										key={notification.id}
										className={`border-l-4 transition-all hover:shadow-md ${getPriorityColor(
											notification.priority
										)} ${!notification.read ? 'shadow-md' : ''}`}
									>
										<CardContent className="p-4">
											<div className="flex items-start justify-between">
												<div className="flex items-start space-x-4 flex-1">
													<div className="mt-1">{notification.icon}</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center space-x-2 mb-1">
															<h3
																className={`font-medium ${
																	!notification.read ? 'font-semibold' : ''
																}`}
															>
																{notification.title}
															</h3>
															{!notification.read && (
																<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
															)}
															{notification.priority === 'high' && (
																<AlertTriangle className="w-4 h-4 text-red-500" />
															)}
														</div>
														<p className="text-gray-600 text-sm mb-2">
															{notification.message}
														</p>
														<div className="flex items-center space-x-4 text-xs text-gray-500">
															<span className="flex items-center space-x-1">
																<Clock className="w-3 h-3" />
																<span>{notification.timestamp}</span>
															</span>
															{notification.patientName && (
																<span>
																	<strong>Patient:</strong>{' '}
																	{notification.patientName} (
																	{notification.patientId})
																</span>
															)}
															<Badge variant="outline" className="text-xs">
																{notification.category}
															</Badge>
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-2 ml-4">
													{notification.actionRequired && (
														<Button
															size="sm"
															className="bg-blue-600 hover:bg-blue-700"
														>
															Action Required
														</Button>
													)}
													{!notification.read && (
														<Button
															size="sm"
															variant="outline"
															onClick={() => markAsRead(notification.id)}
														>
															<Check className="w-3 h-3 mr-1" />
															Mark Read
														</Button>
													)}
													<Button
														size="sm"
														variant="ghost"
														onClick={() => deleteNotification(notification.id)}
													>
														<X className="w-3 h-3" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								))}

								{getFilteredNotifications().length === 0 && (
									<div className="text-center py-12">
										<Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No notifications found
										</h3>
										<p className="text-gray-500">
											{searchTerm
												? 'Try adjusting your search terms.'
												: "You're all caught up!"}
										</p>
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
