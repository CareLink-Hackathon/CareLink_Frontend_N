'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { adminService } from '@/lib/services/admin-service';
import {
	TrendingUp,
	TrendingDown,
	Star,
	MessageSquare,
	UserCheck,
	Calendar,
	ThumbsUp,
	ThumbsDown,
	Meh,
	Activity,
	BarChart3,
	Users,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';

interface GeneralFeedback {
	_id: string;
	user_id?: string;
	patient_id?: string;
	patient_name: string;
	category: string;
	message: string;
	rating: number;
	sentiment: string;
	sentiment_score: number;
	created_at: string;
	// Doctor feedback specific fields
	doctor_id?: string;
	doctor_name?: string;
	doctor_specialty?: string;
	doctor_department?: string;
	language?: string;
	feedback_category?: string;
}

interface FeedbackAnalytics {
	overview?: {
		total_feedback?: number;
		doctor_feedback_total?: number;
		general_feedback_total?: number;
		overall_sentiment?: { positive?: number; negative?: number; neutral?: number };
		recent_doctor_feedbacks?: number;
		recent_general_feedbacks?: number;
	};
	doctor_analytics?: {
		total?: number;
		average_rating?: number;
		sentiment_distribution?: { positive?: number; negative?: number; neutral?: number };
		rating_distribution?: { [key: number]: number };
	};
	general_analytics?: {
		total?: number;
		average_rating?: number;
		sentiment_distribution?: { positive?: number; negative?: number; neutral?: number };
		rating_distribution?: { [key: number]: number };
		top_categories?: [string, number][];
	};
}

export default function AdminFeedback() {
	const { user } = useAuth();
	
	const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
	const [generalFeedbacks, setGeneralFeedbacks] = useState<GeneralFeedback[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch all feedback data
	const fetchFeedbackData = async () => {
		console.log("🚀 Starting to fetch feedback data...");
		setLoading(true);
		setError(null);
		
		try {
			console.log("📡 Calling adminService.getFeedbackAnalytics() and getAllDoctorFeedbacks()...");
			// Use admin service to fetch analytics and doctor feedback (which is patient feedback about doctors)
			const [analyticsData, doctorFeedbacksData] = await Promise.all([
				adminService.getFeedbackAnalytics(),
				adminService.getAllDoctorFeedbacks()
			]);

			console.log("📈 Analytics data received:", analyticsData);
			console.log("📦 Doctor feedbacks data received:", doctorFeedbacksData);
			console.log("📊 Number of feedback items:", doctorFeedbacksData?.length || 0);

			setAnalytics(analyticsData);
			setGeneralFeedbacks(doctorFeedbacksData); // This is actually patient feedback about doctors

		} catch (error) {
			console.error('❌ Error fetching feedback data:', error);
			setError('Failed to load feedback data');
		} finally {
			console.log("✅ Finished fetching feedback data, loading state set to false");
			setLoading(false);
		}
	};

	// Load data on component mount
	useEffect(() => {
		console.log("🔍 AdminFeedback useEffect - user:", user);
		console.log("🔍 AdminFeedback useEffect - user.role:", user?.role);
		console.log("🔍 AdminFeedback useEffect - user.account_type:", user?.account_type);
		console.log("🔍 AdminFeedback useEffect - user.isAdmin:", (user as any)?.isAdmin);
		
		// Check if user is admin by role (most reliable field)
		if (user?.role === 'admin') {
			console.log("✅ AdminFeedback - User is admin, fetching feedback data...");
			fetchFeedbackData();
		} else {
			console.log("❌ AdminFeedback - User is not admin or user data not loaded yet");
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
						onClick={fetchFeedbackData}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	const sidebarItems = getAdminSidebarItems('feedback');
	const userInfo = getAdminUserInfo(user);

	// Get sentiment icon and color
	const getSentimentDisplay = (sentiment: string) => {
		switch (sentiment.toLowerCase()) {
			case 'positive':
				return { icon: ThumbsUp, color: 'text-green-600', bgColor: 'bg-green-100' };
			case 'negative':
				return { icon: ThumbsDown, color: 'text-red-600', bgColor: 'bg-red-100' };
			default:
				return { icon: Meh, color: 'text-gray-600', bgColor: 'bg-gray-100' };
		}
	};

	// Calculate percentage for sentiment distribution
	const getSentimentPercentage = (sentiment: { positive?: number; negative?: number; neutral?: number } | null | undefined, type: 'positive' | 'negative' | 'neutral') => {
		if (!sentiment) return 0;
		const positive = sentiment.positive || 0;
		const negative = sentiment.negative || 0;
		const neutral = sentiment.neutral || 0;
		const total = positive + negative + neutral;
		return total > 0 ? Math.round((sentiment[type] || 0) / total * 100) : 0;
	};

	// Safe data access helpers
	const getOverviewData = () => analytics?.overview || {};
	const getGeneralAnalytics = () => analytics?.general_analytics || {};
	const getOverallSentiment = () => analytics?.overview?.overall_sentiment || { positive: 0, negative: 0, neutral: 0 };

	return (
		<ResponsiveDashboardLayout
			sidebarItems={sidebarItems}
			userInfo={userInfo}
			pageTitle="Feedback Analytics"
		>
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
							Feedback Analytics Dashboard
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Comprehensive feedback analysis with sentiment insights and performance metrics
						</p>
					</div>
					
					{/* Debug and Refresh Controls */}
					<div className="flex flex-col sm:flex-row gap-2">
						<Button
							onClick={fetchFeedbackData}
							disabled={loading}
							variant="outline"
							size="sm"
							className="min-w-[120px]"
						>
							{loading ? 'Loading...' : 'Refresh Data'}
						</Button>
						<div className="text-xs text-gray-500 space-y-1">
							<div>User role: {user?.role || 'undefined'}</div>
							<div>Loading: {loading ? 'Yes' : 'No'}</div>
							<div>Feedbacks: {generalFeedbacks?.length || 0}</div>
						</div>
					</div>
				</div>
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
				<Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-blue-600 font-medium">Total Feedback</p>
								<p className="text-lg sm:text-2xl font-bold text-blue-900">
									{loading ? '...' : analytics?.overview.total_feedback || 0}
								</p>
							</div>
							<MessageSquare className="w-8 h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-green-600 font-medium">Positive Sentiment</p>
								<p className="text-lg sm:text-2xl font-bold text-green-900">
									{loading ? '...' : analytics?.overview.overall_sentiment.positive || 0}
								</p>
								<p className="text-xs text-green-600">
									{loading ? '...' : `${getSentimentPercentage(analytics?.overview.overall_sentiment || { positive: 0, negative: 0, neutral: 0 }, 'positive')}% of total`}
								</p>
							</div>
							<ThumbsUp className="w-8 h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-red-600 font-medium">Negative Sentiment</p>
								<p className="text-lg sm:text-2xl font-bold text-red-900">
									{loading ? '...' : analytics?.overview.overall_sentiment.negative || 0}
								</p>
								<p className="text-xs text-red-600">
									{loading ? '...' : `${getSentimentPercentage(analytics?.overview.overall_sentiment || { positive: 0, negative: 0, neutral: 0 }, 'negative')}% of total`}
								</p>
							</div>
							<ThumbsDown className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-purple-600 font-medium">Recent Activity</p>
								<p className="text-lg sm:text-2xl font-bold text-purple-900">
									{loading ? '...' : analytics?.overview?.recent_doctor_feedbacks || 0}
								</p>
								<p className="text-xs text-purple-600">Last 7 days</p>
							</div>
							<Activity className="w-8 h-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="general">Patient Feedback</TabsTrigger>
					<TabsTrigger value="insights">Insights</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Sentiment Distribution */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl flex items-center">
									<BarChart3 className="w-5 h-5 mr-2" />
									Overall Sentiment Distribution
								</CardTitle>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex items-center justify-center py-8">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-green-600">Positive</span>
												<span className="text-sm text-gray-600">
													{analytics?.overview.overall_sentiment.positive || 0}
												</span>
											</div>
											<Progress 
												value={getSentimentPercentage(analytics?.overview.overall_sentiment || { positive: 0, negative: 0, neutral: 0 }, 'positive')} 
												className="h-2 bg-green-100" 
											/>
										</div>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-red-600">Negative</span>
												<span className="text-sm text-gray-600">
													{analytics?.overview.overall_sentiment.negative || 0}
												</span>
											</div>
											<Progress 
												value={getSentimentPercentage(analytics?.overview.overall_sentiment || { positive: 0, negative: 0, neutral: 0 }, 'negative')} 
												className="h-2 bg-red-100" 
											/>
										</div>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-gray-600">Neutral</span>
												<span className="text-sm text-gray-600">
													{analytics?.overview.overall_sentiment.neutral || 0}
												</span>
											</div>
											<Progress 
												value={getSentimentPercentage(analytics?.overview.overall_sentiment || { positive: 0, negative: 0, neutral: 0 }, 'neutral')} 
												className="h-2 bg-gray-100" 
											/>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Feedback Types Breakdown */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl flex items-center">
									<Users className="w-5 h-5 mr-2" />
									Patient Feedback About Doctors
								</CardTitle>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex items-center justify-center py-8">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
											<div>
												<p className="font-medium text-green-900">Total Feedback</p>
												<p className="text-sm text-green-600">Patient feedback about doctors</p>
											</div>
											<div className="text-right">
												<p className="text-xl font-bold text-green-900">
													{analytics?.overview?.doctor_feedback_total || 0}
												</p>
												<p className="text-xs text-green-600">All feedback</p>
											</div>
										</div>
										<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
											<div>
												<p className="font-medium text-blue-900">Average Rating</p>
												<p className="text-sm text-blue-600">Overall patient satisfaction with doctors</p>
											</div>
											<div className="text-right">
												<div className="flex items-center space-x-1 justify-end mb-1">
													{[1, 2, 3, 4, 5].map((star) => (
														<Star
															key={star}
															className={`w-4 h-4 ${
																star <= (analytics?.doctor_analytics?.average_rating || 0)
																	? 'text-yellow-400 fill-current'
																	: 'text-gray-300'
															}`}
														/>
													))}
												</div>
												<p className="text-xl font-bold text-blue-900">
													{analytics?.doctor_analytics?.average_rating?.toFixed(1) || '0.0'}
												</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="general" className="space-y-6">
					{/* Patient Feedback Summary Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						<Card>
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Patient Feedback</p>
										<p className="text-lg sm:text-2xl font-bold">
											{loading ? '...' : analytics?.doctor_analytics?.total || 0}
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
										<p className="text-sm text-gray-600">Average Rating</p>
										<p className="text-lg sm:text-2xl font-bold text-yellow-600">
											{loading ? '...' : analytics?.doctor_analytics?.average_rating?.toFixed(1) || '0.0'}
										</p>
									</div>
									<Star className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Positive Feedback</p>
										<p className="text-lg sm:text-2xl font-bold text-green-600">
											{loading ? '...' : analytics?.doctor_analytics?.sentiment_distribution?.positive || 0}
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
											{loading ? '...' : analytics?.doctor_analytics?.sentiment_distribution?.negative || 0}
										</p>
									</div>
									<TrendingDown className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
						{/* Rating Distribution */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									Rating Distribution
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{loading ? (
										<div className="flex items-center justify-center py-8">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
										</div>
									) : (
										<div className="space-y-3">
											{[5, 4, 3, 2, 1].map((rating) => {
												const count = analytics?.doctor_analytics?.rating_distribution?.[rating] || 0;
												const total = analytics?.doctor_analytics?.total || 0;
												const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
												return (
													<div key={rating} className="space-y-2">
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-2">
																<span className="text-sm font-medium">{rating}</span>
																<div className="flex items-center">
																	{[...Array(rating)].map((_, i) => (
																		<Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
																	))}
																</div>
															</div>
															<span className="text-sm text-gray-600">{count}</span>
														</div>
														<Progress value={percentage} className="h-2" />
													</div>
												);
											})}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Recent Patient Feedback */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-lg sm:text-xl">Recent Patient Feedback About Doctors</CardTitle>
							<Button 
								onClick={fetchFeedbackData}
								disabled={loading}
								variant="outline"
								size="sm"
							>
								{loading ? 'Loading...' : 'Refresh'}
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{loading ? (
									<div className="flex items-center justify-center py-8">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
									</div>
								) : generalFeedbacks.length > 0 ? (
									generalFeedbacks.slice(0, 5).map((feedback) => {
										const sentimentDisplay = getSentimentDisplay(feedback.sentiment);
										const SentimentIcon = sentimentDisplay.icon;
										
										return (
											<div key={feedback._id} className="p-4 border border-gray-200 rounded-lg bg-white">
												<div className="flex items-start justify-between mb-3">
													<div className="flex items-center space-x-3">
														<Avatar className="w-10 h-10">
															<AvatarFallback className="bg-green-100 text-green-600">
																{feedback.patient_name?.split(' ').map(n => n[0]).join('') || 'P'}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium text-gray-900">{feedback.patient_name}</p>
															{feedback.doctor_name && (
																<p className="text-sm text-gray-500">
																	About Dr. {feedback.doctor_name}
																</p>
															)}
															{feedback.doctor_specialty && feedback.doctor_department && (
																<p className="text-xs text-gray-400">
																	{feedback.doctor_specialty} • {feedback.doctor_department}
																</p>
															)}
														</div>
													</div>
													<div className="text-right space-y-1">
														<div className="flex items-center space-x-1">
															{[1, 2, 3, 4, 5].map((star) => (
																<Star
																	key={star}
																	className={`w-4 h-4 ${
																		star <= feedback.rating
																			? 'text-yellow-400 fill-current'
																			: 'text-gray-300'
																	}`}
																/>
															))}
														</div>
														<Badge className={`${sentimentDisplay.bgColor} ${sentimentDisplay.color} border-0`}>
															<SentimentIcon className="w-3 h-3 mr-1" />
															{feedback.sentiment}
														</Badge>
													</div>
												</div>
												
												<p className="text-gray-700 mb-3 text-sm leading-relaxed">
													{feedback.message}
												</p>
												
												<div className="flex items-center justify-between text-xs text-gray-500">
													<div className="flex items-center space-x-4">
														<span className="flex items-center">
															<Calendar className="w-3 h-3 mr-1" />
															{new Date(feedback.created_at).toLocaleDateString()}
														</span>
														{feedback.language && (
															<span>Language: {feedback.language}</span>
														)}
														<span>Category: {feedback.category}</span>
													</div>
												</div>
											</div>
										);
									})
								) : (
									<div className="text-center py-8">
										<MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
										<p className="text-gray-500">No patient feedback available yet</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="insights" className="space-y-6">
					{/* Key Insights */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Sentiment Analysis */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">Sentiment Analysis</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div>
										<h4 className="font-medium mb-3 text-green-900">Patient Feedback About Doctors</h4>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm text-green-600">Positive</span>
												<span className="text-sm font-medium">
													{analytics?.doctor_analytics?.sentiment_distribution?.positive || 0}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-red-600">Negative</span>
												<span className="text-sm font-medium">
													{analytics?.doctor_analytics?.sentiment_distribution?.negative || 0}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">Neutral</span>
												<span className="text-sm font-medium">
													{analytics?.doctor_analytics?.sentiment_distribution?.neutral || 0}
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Performance Summary */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">Performance Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{loading ? (
										<div className="flex items-center justify-center py-8">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
										</div>
									) : (
										<>
											<div className="p-4 bg-blue-50 rounded-lg">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-medium text-blue-900">Overall Health</p>
														<p className="text-sm text-blue-600">
															{analytics?.overview?.total_feedback 
																? Math.round(((analytics.overview.overall_sentiment?.positive || 0) / analytics.overview.total_feedback) * 100)
																: 0}% positive sentiment
														</p>
													</div>
													<div className="text-2xl font-bold text-blue-900">
														{(analytics?.overview?.overall_sentiment?.positive || 0) > (analytics?.overview?.overall_sentiment?.negative || 0) ? '📈' : '📉'}
													</div>
												</div>
											</div>
											
											<div className="p-4 bg-green-50 rounded-lg">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-medium text-green-900">Patient Satisfaction with Doctors</p>
														<p className="text-sm text-green-600">
															Avg rating: {analytics?.doctor_analytics?.average_rating?.toFixed(1) || '0.0'}/5.0
														</p>
													</div>
													<div className="text-2xl font-bold text-green-900">
														{(analytics?.doctor_analytics?.average_rating || 0) >= 4 ? '⭐' : '📊'}
													</div>
												</div>
											</div>

											<div className="p-4 bg-purple-50 rounded-lg">
												<div className="flex items-center justify-between">
													<div>
														<p className="font-medium text-purple-900">Recent Activity</p>
														<p className="text-sm text-purple-600">
															{analytics?.overview?.recent_doctor_feedbacks || 0} new feedback this week
														</p>
													</div>
													<div className="text-2xl font-bold text-purple-900">
														🔄
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</ResponsiveDashboardLayout>
	);
}
