'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Activity,
	Calendar,
	Clock,
	Bell,
	CheckCircle,
	Settings,
	Trash2,
	Search,
	Check,
	CheckCheck,
	Home,
	FileText,
	MessageCircle,
	MessageSquare,
	HelpCircle,
	User,
	CreditCard,
	Shield,
	Plus,
	Filter,
	MoreVertical,
	Bot,
	LogOut,
	Star,
	Pill,
	Heart,
	Info,
} from 'lucide-react';

export default function PatientNotifications() {
	const router = useRouter();
	const [filter, setFilter] = useState('all');
	const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
		[]
	);

	// User info for responsive layout
	const userInfo = {
		name: 'JOHN DOE',
		fallback: 'JD',
		role: 'Patient',
		id: 'P001',
	};

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			active: true,
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	const notifications = [
		{
			id: 1,
			type: 'appointment',
			title: 'Appointment Reminder',
			message:
				'You have an appointment with Dr. Sarah Johnson tomorrow at 2:30 PM',
			time: '2 hours ago',
			read: false,
			icon: Calendar,
			color: 'bg-blue-500',
		},
		{
			id: 2,
			type: 'medication',
			title: 'Medication Reminder',
			message: 'Time to take your blood pressure medication',
			time: '3 hours ago',
			read: false,
			icon: Pill,
			color: 'bg-green-500',
		},
		{
			id: 3,
			type: 'result',
			title: 'Lab Results Available',
			message: 'Your blood test results are now available for review',
			time: '1 day ago',
			read: false,
			icon: FileText,
			color: 'bg-purple-500',
		},
		{
			id: 4,
			type: 'message',
			title: 'Message from Dr. Chen',
			message:
				'Follow-up instructions for your recent dermatology consultation',
			time: '2 days ago',
			read: true,
			icon: MessageSquare,
			color: 'bg-orange-500',
		},
		{
			id: 5,
			type: 'health',
			title: 'Health Tip',
			message:
				'Remember to stay hydrated and maintain regular exercise routine',
			time: '3 days ago',
			read: true,
			icon: Heart,
			color: 'bg-red-500',
		},
		{
			id: 6,
			type: 'system',
			title: 'System Update',
			message: 'CareLink app has been updated with new features',
			time: '1 week ago',
			read: true,
			icon: Info,
			color: 'bg-gray-500',
		},
	];

	const filteredNotifications = notifications.filter((notification) => {
		if (filter === 'unread') return !notification.read;
		if (filter === 'read') return notification.read;
		return true;
	});

	const markAsRead = (id: number) => {
		// In a real app, this would update the backend
		console.log(`Marking notification ${id} as read`);
	};

	const markAllAsRead = () => {
		console.log('Marking all notifications as read');
	};

	const deleteNotification = (id: number) => {
		console.log(`Deleting notification ${id}`);
	};

	const toggleNotificationSelection = (id: number) => {
		setSelectedNotifications((prev) =>
			prev.includes(id)
				? prev.filter((notificationId) => notificationId !== id)
				: [...prev, id]
		);
	};

	// Check if there are unread notifications
	const hasUnread = notifications.some((notification) => !notification.read);

	return (
		<ResponsiveDashboardLayout
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={true}
			onSearch={(query) => console.log('Search:', query)}
		>
			{/* Header */}
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
						<p className="text-gray-600 text-sm sm:text-base">
							Stay updated with your healthcare information
						</p>
					</div>
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
						<Button
							onClick={markAllAsRead}
							variant="outline"
							disabled={!hasUnread}
							className="flex items-center justify-center"
						>
							<CheckCheck className="w-4 h-4 mr-2" />
							Mark all as read
						</Button>
					</div>
				</div>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						placeholder="Search notifications..."
						className="pl-10 w-full sm:w-96 border-gray-300"
					/>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="mb-6">
				<div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
					<Button
						variant={filter === 'all' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setFilter('all')}
						className={`flex-1 sm:flex-initial ${
							filter === 'all' ? 'bg-white shadow-sm' : ''
						}`}
					>
						All ({notifications.length})
					</Button>
					<Button
						variant={filter === 'unread' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setFilter('unread')}
						className={`flex-1 sm:flex-initial ${
							filter === 'unread' ? 'bg-white shadow-sm' : ''
						}`}
					>
						Unread ({notifications.filter((n) => !n.read).length})
					</Button>
					<Button
						variant={filter === 'read' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setFilter('read')}
						className={`flex-1 sm:flex-initial ${
							filter === 'read' ? 'bg-white shadow-sm' : ''
						}`}
					>
						Read ({notifications.filter((n) => n.read).length})
					</Button>
				</div>
			</div>

			{/* Notifications List */}
			<div className="space-y-4">
				{filteredNotifications.map((notification) => (
					<Card
						key={notification.id}
						className={`hover:shadow-lg transition-shadow cursor-pointer ${
							!notification.read
								? 'border-l-4 border-l-blue-500 bg-blue-50/30'
								: ''
						}`}
					>
						<CardContent className="p-4 lg:p-6">
							<div className="flex items-start space-x-3 sm:space-x-4">
								<div
									className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}
								>
									<notification.icon className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
										<h3
											className={`font-semibold truncate ${
												!notification.read ? 'text-gray-900' : 'text-gray-700'
											}`}
										>
											{notification.title}
										</h3>
										<div className="flex items-center justify-between sm:justify-end space-x-2">
											<span className="text-sm text-gray-500 flex-shrink-0">
												{notification.time}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="w-8 h-8 flex-shrink-0"
												onClick={(e) => {
													e.stopPropagation();
													deleteNotification(notification.id);
												}}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
									<p
										className={`text-sm mb-3 ${
											!notification.read ? 'text-gray-700' : 'text-gray-600'
										}`}
									>
										{notification.message}
									</p>
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<Badge variant="outline" className="text-xs w-fit">
											{notification.type}
										</Badge>
										{!notification.read && (
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													markAsRead(notification.id);
												}}
												className="text-blue-600 hover:text-blue-700 w-fit"
											>
												Mark as read
											</Button>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty State */}
			{filteredNotifications.length === 0 && (
				<div className="text-center py-12">
					<Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-500 mb-2">
						No notifications found
					</h3>
					<p className="text-gray-400 text-sm sm:text-base">
						{filter === 'unread'
							? "You're all caught up! No unread notifications."
							: 'No notifications match your current filter.'}
					</p>
				</div>
			)}
		</ResponsiveDashboardLayout>
	);
}
