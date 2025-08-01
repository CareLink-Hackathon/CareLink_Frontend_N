'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
	TrendingDown,
	TrendingUp,
	Star,
	MessageSquare,
	AlertTriangle,
	Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { useAdmin } from '@/lib/contexts/admin-context';

export default function AdminFeedback() {
	const router = useRouter();
	const { user } = useAuth();
	const { state, loadFeedbackAnalytics } = useAdmin();

	// Load data on component mount
	useEffect(() => {
		if (user?.account_type === 'hospital' && (user as any).isAdmin) {
			loadFeedbackAnalytics();
		}
	}, [user]);

	// Show error state if there's an error
	if (state.error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-4">
						Error loading feedback analytics
					</div>
					<p className="text-gray-600 mb-4">{state.error}</p>
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
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{
			icon: FileText,
			label: 'Feedback Analytics',
			href: '/admin/feedback',
			active: true,
		},
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge:
				state.unreadNotifications > 0
					? state.unreadNotifications.toString()
					: undefined,
		},
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	// Use real feedback data from context
	const feedbackCategories = state.feedbackAnalytics?.categoryBreakdown || [];
	const recentFeedback = state.feedbackAnalytics?.recentFeedback || [];
	const feedbackStats = state.feedbackAnalytics?.summary || {
		totalFeedback: 0,
		averageRating: 0,
		satisfactionRate: 0,
		responseRate: 0,
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>
								{state.profile
									? `${state.profile.first_name[0]}${state.profile.last_name[0]}`
									: 'AD'}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">
								{state.profile
									? `${state.profile.first_name.toUpperCase()} ${state.profile.last_name.toUpperCase()}`
									: 'ADMIN USER'}
							</h3>
							<p className="text-blue-100 text-sm">
								{state.profile?.hospital_name
									? `${state.profile.hospital_name} Administrator`
									: 'Hospital Administrator'}
							</p>
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
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search feedback..."
									className="pl-10 w-96 border-gray-300"
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button variant="outline" size="sm">
								Export Report
							</Button>
							<Button variant="ghost" size="icon">
								<Settings className="w-5 h-5" />
							</Button>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
							</Button>
						</div>
					</div>
				</header>

				{/* Feedback Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Feedback Analytics
						</h1>
						<p className="text-gray-600">
							Monitor patient feedback and identify improvement areas
						</p>
					</div>

					{/* Stats Overview */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Feedback</p>
										<p className="text-2xl font-bold">
											{state.loading ? '...' : feedbackStats.totalFeedback || 0}
										</p>
									</div>
									<MessageSquare className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Average Rating</p>
										<div className="flex items-center space-x-1">
											<p className="text-2xl font-bold">
												{state.loading
													? '...'
													: feedbackStats.averageRating || 0}
											</p>
											<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
										</div>
									</div>
									<Star className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Positive Feedback</p>
										<p className="text-2xl font-bold text-green-600">
											{state.loading
												? '...'
												: `${feedbackStats.positivePercentage || 0}%`}
										</p>
									</div>
									<TrendingUp className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Negative Feedback</p>
										<p className="text-2xl font-bold text-red-600">
											{state.loading
												? '...'
												: `${feedbackStats.negativePercentage || 0}%`}
										</p>
									</div>
									<TrendingDown className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					<Tabs defaultValue="categories" className="space-y-6">
						<TabsList>
							<TabsTrigger value="categories">Top Categories</TabsTrigger>
							<TabsTrigger value="recent">Recent Feedback</TabsTrigger>
						</TabsList>

						<TabsContent value="categories">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Top Complaint Categories */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											Top Complaint Categories
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{state.loading ? (
												<div className="flex items-center justify-center py-8">
													<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
												</div>
											) : feedbackCategories.length > 0 ? (
												feedbackCategories.map((item, index) => (
													<div key={index} className="space-y-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-3">
																<div
																	className={`w-3 h-3 rounded-full ${
																		item.color || 'bg-blue-500'
																	}`}
																></div>
																<span className="font-medium">
																	{item.category}
																</span>
																{item.trend === 'up' ? (
																	<TrendingUp className="w-4 h-4 text-red-500" />
																) : item.trend === 'down' ? (
																	<TrendingDown className="w-4 h-4 text-green-500" />
																) : null}
															</div>
															<span className="text-sm text-gray-600">
																{item.count} feedback
															</span>
														</div>
														<Progress value={item.percentage} className="h-2" />
														{item.description && (
															<p className="text-sm text-gray-600">
																{item.description}
															</p>
														)}
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

								{/* Action Items */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											Recommended Actions
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
												<AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
												<div>
													<h4 className="font-semibold text-red-800">
														Urgent: Wait Time Issues
													</h4>
													<p className="text-sm text-red-700">
														Consider adding more staff during peak hours or
														implementing an appointment reminder system.
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
												<AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
												<div>
													<h4 className="font-semibold text-orange-800">
														Staff Training Needed
													</h4>
													<p className="text-sm text-orange-700">
														Provide customer service training to improve patient
														interactions.
													</p>
												</div>
											</div>
											<div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
												<AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
												<div>
													<h4 className="font-semibold text-yellow-800">
														Facility Maintenance
													</h4>
													<p className="text-sm text-yellow-700">
														Schedule regular cleaning audits and improve
														maintenance protocols.
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="recent">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle className="text-lg">
										Recent Patient Feedback
									</CardTitle>
									<Button variant="outline" size="sm">
										<Filter className="w-4 h-4 mr-2" />
										Filter
									</Button>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{state.loading ? (
											<div className="flex items-center justify-center py-8">
												<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
											</div>
										) : recentFeedback.length > 0 ? (
											recentFeedback.map((feedback) => (
												<div
													key={feedback._id || feedback.id}
													className="p-4 border border-gray-200 rounded-lg"
												>
													<div className="flex items-start justify-between mb-3">
														<div className="flex items-center space-x-3">
															<Avatar className="w-10 h-10">
																<AvatarImage src="/placeholder.svg?height=40&width=40" />
																<AvatarFallback>
																	{feedback.patient_name ? 
																		feedback.patient_name.split(' ').map((n) => n[0]).join('') :
																		feedback.user_email?.split('@')[0].substring(0, 2).toUpperCase() || 'U'
																	}
																</AvatarFallback>
															</Avatar>
															<div>
																<h4 className="font-semibold">
																	{feedback.patient_name || feedback.user_email?.split('@')[0] || 'Anonymous'}
																</h4>
																<div className="flex items-center space-x-2">
																	<div className="flex items-center">
																		{[...Array(5)].map((_, i) => (
																			<Star
																				key={i}
																				className={`w-4 h-4 ${
																					i < (feedback.rating || 0)
																						? 'text-yellow-500 fill-yellow-500'
																						: 'text-gray-300'
																				}`}
																			/>
																		))}
																	</div>
																	<Badge
																		className={
																			feedback.category === 'Wait Time'
																				? 'bg-red-100 text-red-800'
																				: feedback.category === 'Staff Behavior'
																				? 'bg-orange-100 text-orange-800'
																				: 'bg-blue-100 text-blue-800'
																		}
																	>
																		{feedback.category || 'General'}
																	</Badge>
																</div>
															</div>
														</div>
														<div className="text-right">
															<p className="text-sm text-gray-600">
																{feedback.created_at ? new Date(feedback.created_at).toLocaleDateString() : feedback.date}
															</p>
															<Badge
																className={
																	feedback.status === 'new'
																		? 'bg-yellow-100 text-yellow-800'
																		: 'bg-green-100 text-green-800'
																}
															>
																{feedback.status || 'new'}
															</Badge>
														</div>
													</div>
													<p className="text-gray-700">
														{feedback.feedback || feedback.message || feedback.content}
													</p>
												</div>
											))
										) : (
																								</p>
												</div>
											))
										) : (
											<p className="text-center text-gray-500 py-8">No recent feedback available</p>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
										)}
														</Badge>
													</div>
												</div>
												<p className="text-gray-700 mb-3">
													{feedback.feedback}
												</p>
												<div className="flex space-x-2">
													<Button size="sm" variant="outline">
														Mark as Reviewed
													</Button>
													<Button size="sm" variant="outline">
														Respond
													</Button>
													<Button size="sm" variant="outline">
														Forward to Department
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
