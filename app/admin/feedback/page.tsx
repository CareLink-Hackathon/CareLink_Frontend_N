'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAdmin } from '@/lib/contexts/admin-context';
import { useAuth } from '@/lib/auth-context';
import {
	Calendar,
	Users,
	Activity,
	FileText,
	TrendingUp,
	TrendingDown,
	Star,
	MessageSquare,
	Bell,
	Settings,
	HelpCircle,
	Droplets,
} from 'lucide-react';

export default function AdminFeedback() {
	const { user } = useAuth();
	const { feedbackAnalytics, loading, error, loadFeedbackAnalytics } =
		useAdmin();

	// Load data on component mount
	useEffect(() => {
		if (user?.account_type === 'hospital' && (user as any).isAdmin) {
			loadFeedbackAnalytics();
		}
	}, [user]);

	// Show error state if there's an error
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						Error loading feedback analytics
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

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{
			icon: FileText,
			label: 'Feedback Analytics',
			href: '/admin/feedback',
			active: true,
		},
		{ icon: Bell, label: 'Notifications', href: '/admin/notifications' },
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	const userInfo = {
		name:
			user?.first_name && user?.last_name
				? `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
				: 'ADMIN USER',
		id: user?._id ? `Admin ID: ${user._id.slice(-6)}` : 'Admin ID: A001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback:
			user?.first_name && user?.last_name
				? `${user.first_name[0]}${user.last_name[0]}`
				: 'AU',
		role: user?.hospital_name
			? `${user.hospital_name} Administrator`
			: 'Hospital Administrator',
	};

	// Use real feedback data from context
	const feedbackCategories = feedbackAnalytics?.categoryBreakdown || [];
	const feedbacks = feedbackAnalytics?.feedbacks || [];
	const sentimentData = feedbackAnalytics?.sentimentDistribution || {
		positive: 0,
		negative: 0,
		neutral: 0,
	};

	const totalSentiment =
		sentimentData.positive + sentimentData.negative + sentimentData.neutral;

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Feedback Analytics"
		>
			<div className="mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Feedback Analytics
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Monitor patient feedback and satisfaction metrics
				</p>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Feedback</p>
								<p className="text-lg sm:text-2xl font-bold">
									{loading ? '...' : feedbackAnalytics?.totalFeedback || 0}
								</p>
							</div>
							<MessageSquare className="w-8 h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Positive Feedback</p>
								<p className="text-lg sm:text-2xl font-bold text-green-600">
									{loading ? '...' : sentimentData.positive || 0}
								</p>
							</div>
							<TrendingUp className="w-8 h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Negative Feedback</p>
								<p className="text-lg sm:text-2xl font-bold text-red-600">
									{loading ? '...' : sentimentData.negative || 0}
								</p>
							</div>
							<TrendingDown className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Neutral Feedback</p>
								<p className="text-lg sm:text-2xl font-bold text-gray-600">
									{loading ? '...' : sentimentData.neutral || 0}
								</p>
							</div>
							<Star className="w-8 h-8 text-gray-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Category Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg sm:text-xl">
							Top Feedback Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
								</div>
							) : feedbackCategories.length > 0 ? (
								feedbackCategories.map((item: any, index: number) => (
									<div key={index} className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												{item.category}
											</span>
											<div className="flex items-center space-x-2">
												<span className="text-sm text-gray-600">
													{item.count}
												</span>
												{item.trend === 'up' ? (
													<TrendingUp className="w-4 h-4 text-green-500" />
												) : item.trend === 'down' ? (
													<TrendingDown className="w-4 h-4 text-red-500" />
												) : null}
											</div>
										</div>
										<Progress value={item.percentage} className="h-2" />
									</div>
								))
							) : (
								<p className="text-center text-gray-500 py-8">
									No feedback categories available
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Recent Feedback */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg sm:text-xl">
							Recent Feedback
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
								</div>
							) : feedbacks.length > 0 ? (
								feedbacks.slice(0, 5).map((feedback: any, index: number) => (
									<div key={index} className="p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<Badge
												className={
													feedback.sentiment === 'positive'
														? 'bg-green-100 text-green-800'
														: feedback.sentiment === 'negative'
														? 'bg-red-100 text-red-800'
														: 'bg-gray-100 text-gray-800'
												}
											>
												{feedback.sentiment}
											</Badge>
											<span className="text-xs text-gray-500">
												{feedback.category}
											</span>
										</div>
										<p className="text-sm text-gray-700 mb-2">
											{feedback.message}
										</p>
										{feedback.rating && (
											<div className="flex items-center space-x-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className={`w-4 h-4 ${
															star <= feedback.rating!
																? 'text-yellow-400 fill-current'
																: 'text-gray-300'
														}`}
													/>
												))}
											</div>
										)}
									</div>
								))
							) : (
								<p className="text-center text-gray-500 py-8">
									No recent feedback available
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</ResponsiveDashboardLayout>
	);
}
