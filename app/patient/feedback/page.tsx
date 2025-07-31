'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/lib/contexts/patient-context';
import { useAuth } from '@/lib/auth-context';
import { patientService } from '@/lib/services/patient-service';
import { FeedbackRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
	Activity,
	Calendar,
	FileText,
	Star,
	Bell,
	Settings,
	HelpCircle,
	Bot,
	Send,
	Mic,
	Globe,
	Heart,
	CheckCircle,
	AlertCircle,
	Loader2,
} from 'lucide-react';

export default function PatientFeedback() {
	const router = useRouter();
	const { user } = useAuth();
	const { submitFeedback, isLoading, error, clearError } = usePatient();
	
	const [rating, setRating] = useState(5);
	const [feedback, setFeedback] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [formErrors, setFormErrors] = useState<string[]>([]);

	// User info for responsive layout
	const userInfo = user ? {
		name: `${user.first_name} ${user.last_name}`.toUpperCase(),
		fallback: `${user.first_name[0]}${user.last_name[0]}`,
		role: 'Patient',
		id: user._id,
	} : null;

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{
			icon: Star,
			label: 'Reviews & Feedback',
			href: '/patient/feedback',
			active: true,
		},
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	const handleSubmitFeedback = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormErrors([]);
		setSubmitSuccess(false);

		// Prepare feedback data
		const feedbackData: FeedbackRequest = {
			message: feedback.trim(),
			ratings: rating,
			category: 'general', // You could add category selection in future
		};

		// Validate feedback
		const errors = patientService.validateFeedbackData(feedbackData);
		if (errors.length > 0) {
			setFormErrors(errors);
			return;
		}

		setIsSubmitting(true);

		const success = await submitFeedback(feedbackData);
		
		if (success) {
			setSubmitSuccess(true);
			setFeedback('');
			setRating(5);
			
			// Hide success message after 3 seconds
			setTimeout(() => {
				setSubmitSuccess(false);
			}, 3000);
		}
		
		setIsSubmitting(false);
	};

	const toggleRecording = () => {
		if (isRecording) {
			// Stop recording logic would go here
			setIsRecording(false);
		} else {
			// Start recording logic would go here
			setIsRecording(true);
			// For demo, stop after 3 seconds
			setTimeout(() => {
				setIsRecording(false);
				setFeedback(prev => prev + ' [Voice message recorded]');
			}, 3000);
		}
	};

	return (
		<ProtectedRoute allowedRoles={['patient']}>
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				showSearch={true}
				onSearch={(query) => console.log('Search:', query)}
			>
				<div className="space-y-4 sm:space-y-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
								Reviews & Feedback
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Share your experience with us
							</p>
						</div>

						<Button
							onClick={() => router.push('/patient/chatbot')}
							className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
						>
							<Bot className="w-4 h-4 mr-2" />
							<span>AI Assistant</span>
						</Button>
					</div>

					{/* Success Message */}
					{submitSuccess && (
						<Card className="border-green-200 bg-green-50">
							<CardContent className="pt-6">
								<div className="flex items-center space-x-2">
									<CheckCircle className="w-5 h-5 text-green-600" />
									<p className="text-green-700 font-medium">
										Thank you for your feedback! We appreciate your input.
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Error Display */}
					{error && (
						<Card className="border-red-200 bg-red-50">
							<CardContent className="pt-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<AlertCircle className="w-5 h-5 text-red-600" />
										<p className="text-red-700">{error}</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={clearError}
										className="text-red-600 hover:bg-red-100"
									>
										Dismiss
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Form Errors */}
					{formErrors.length > 0 && (
						<Card className="border-red-200 bg-red-50">
							<CardContent className="pt-6">
								<div className="flex items-center space-x-2 mb-2">
									<AlertCircle className="w-4 h-4 text-red-600" />
									<span className="text-sm font-medium text-red-700">
										Please fix the following errors:
									</span>
								</div>
								<ul className="list-disc list-inside text-sm text-red-600 space-y-1">
									{formErrors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}

					{/* Feedback Content */}
					<div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8">
						<div className="w-full max-w-2xl">
							{/* Logo */}
							<div className="text-center mb-6 sm:mb-8">
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
									<Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
								</div>
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
									How was your experience?
								</h2>
								<p className="text-sm sm:text-base text-gray-600">
									Your feedback helps us improve our healthcare services
								</p>
							</div>

							{/* Rating Section */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
								<div className="text-center mb-4 sm:mb-6">
									<p className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
										Rate your overall experience
									</p>
									<div className="flex justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												onClick={() => setRating(star)}
												className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
											>
												<Star
													className={`w-6 h-6 sm:w-8 sm:h-8 ${
														star <= rating
															? 'fill-yellow-400 text-yellow-400'
															: 'text-gray-300'
													}`}
												/>
											</button>
										))}
									</div>
									<p className="text-xs sm:text-sm text-gray-500">
										{rating === 1 && 'Poor - We need to improve'}
										{rating === 2 && 'Fair - Below expectations'}
										{rating === 3 && 'Good - Met expectations'}
										{rating === 4 && 'Very Good - Above expectations'}
										{rating === 5 && 'Excellent - Exceeded expectations'}
									</p>
								</div>

								{/* Feedback Form */}
								<form onSubmit={handleSubmitFeedback}>
									<div className="mb-4 sm:mb-6">
										<Textarea
											value={feedback}
											onChange={(e) => setFeedback(e.target.value)}
											placeholder="Share your thoughts and experiences..."
											className="min-h-[100px] sm:min-h-[120px] border-gray-300 rounded-lg resize-none text-sm sm:text-base"
										/>
									</div>

									{/* Bottom Controls */}
									<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
										<div className="flex items-center space-x-2 sm:space-x-4">
											<Button
												variant="outline"
												size="sm"
												className="flex items-center space-x-2 bg-transparent text-xs sm:text-sm"
											>
												<Globe className="w-3 h-3 sm:w-4 sm:h-4" />
												<span>EN</span>
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={toggleRecording}
												className={`flex items-center space-x-2 text-xs sm:text-sm ${
													isRecording ? 'bg-red-50 border-red-200 text-red-600' : ''
												}`}
											>
												<Mic className={`w-3 h-3 sm:w-4 sm:h-4 ${
													isRecording ? 'text-red-600' : ''
												}`} />
												<span>{isRecording ? 'Recording...' : 'Voice'}</span>
											</Button>
										</div>

										<Button
											type="submit"
											className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 flex items-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
											disabled={isSubmitting || isLoading}
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
													<span>SENDING...</span>
												</>
											) : (
												<>
													<Send className="w-3 h-3 sm:w-4 sm:h-4" />
													<span>SEND</span>
												</>
											)}
										</Button>
									</div>
								</form>

								{/* Voice Recording Visual Feedback */}
								{isRecording && (
									<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 rounded-lg">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2 sm:space-x-3">
												<div className="relative">
													<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
													<div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
												</div>
												<span className="text-red-700 font-medium text-sm">
													Voice chat
												</span>
											</div>

											{/* Audio Waveform */}
											<div className="flex items-center space-x-0.5 sm:space-x-1">
												{Array.from({ length: 15 }).map((_, i) => (
													<div
														key={i}
														className={`w-0.5 sm:w-1 bg-red-400 rounded-full animate-pulse`}
														style={{
															height: `${Math.random() * 15 + 8}px`,
															animationDelay: `${i * 0.1}s`,
														}}
													></div>
												))}
											</div>

											<span className="text-xs sm:text-sm text-red-600">Recording</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}
