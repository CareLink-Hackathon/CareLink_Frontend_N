'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Search,
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Calendar,
	Star,
	FileText,
	Activity,
	Mic,
	Globe,
	Send,
	Bot,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientFeedback() {
	const router = useRouter();
	const [rating, setRating] = useState(4);
	const [feedback, setFeedback] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		setIsSubmitting(true);

		// Simulate feedback submission
		setTimeout(() => {
			setIsSubmitting(false);
			setFeedback('');
			setRating(0);
			// Show success message
		}, 2000);
	};

	return (
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

				{/* Feedback Content - Mobile optimized */}
				<div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-8">
					<div className="w-full max-w-2xl">
						{/* Logo - Mobile responsive */}
						<div className="text-center mb-6 sm:mb-8">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-md flex items-center justify-center">
									<div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-600 rounded-sm"></div>
								</div>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold text-blue-600">
								CareLink
							</h1>
						</div>

						{/* Feedback Form - Mobile responsive */}
						<div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 text-center">
							<h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
								Welcome back! Please Share your{' '}
								<span className="text-blue-600">Feedbacks</span> Us
							</h2>

							{/* Star Rating - Mobile optimized */}
							<div className="flex justify-center items-center space-x-1 my-6 sm:my-8">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										onClick={() => setRating(star)}
										className="focus:outline-none p-1"
									>
										<Star
											className={`w-6 h-6 sm:w-8 sm:h-8 ${
												star <= rating
													? star <= 2
														? 'text-red-500 fill-red-500'
														: star <= 4
														? 'text-yellow-500 fill-yellow-500'
														: 'text-green-500 fill-green-500'
													: 'text-gray-300'
											}`}
										/>
									</button>
								))}
								<span className="ml-2 sm:ml-4 text-sm sm:text-base text-gray-500">
									: 4.5 / 5
								</span>
							</div>

							{/* Feedback Form */}
							<form onSubmit={handleSubmitFeedback}>
								{/* Feedback Textarea - Mobile responsive */}
								<div className="mb-4 sm:mb-6">
									<Textarea
										value={feedback}
										onChange={(e) => setFeedback(e.target.value)}
										placeholder="Share your thoughts and experiences..."
										className="min-h-[100px] sm:min-h-[120px] border-gray-300 rounded-lg resize-none text-sm sm:text-base"
									/>
								</div>

								{/* Bottom Controls - Mobile responsive */}
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
											variant="outline"
											size="icon"
											className="w-8 h-8 sm:w-10 sm:h-10"
										>
											<svg
												className="w-3 h-3 sm:w-4 sm:h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</Button>
									</div>

									<Button
										type="submit"
										className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 flex items-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
										disabled={isSubmitting}
									>
										<Send className="w-3 h-3 sm:w-4 sm:h-4" />
										<span>{isSubmitting ? 'SENDING...' : 'SEND'}</span>
									</Button>
								</div>
							</form>

							{/* Voice Recording - Mobile responsive */}
							<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2 sm:space-x-3">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 ${
												isRecording ? 'bg-red-100 text-red-600' : ''
											}`}
											onClick={() => setIsRecording(!isRecording)}
										>
											<Mic className="w-4 h-4 sm:w-5 sm:h-5" />
										</Button>
										<span className="text-xs sm:text-sm text-gray-600">
											Voice chat
										</span>
									</div>

									{/* Audio Waveform - Mobile responsive */}
									<div className="flex items-center space-x-0.5 sm:space-x-1">
										{Array.from({ length: 15 }).map((_, i) => (
											<div
												key={i}
												className={`w-0.5 sm:w-1 bg-gray-400 rounded-full ${
													isRecording ? 'animate-pulse' : ''
												}`}
												style={{
													height: `${Math.random() * 15 + 8}px`,
													animationDelay: `${i * 0.1}s`,
												}}
											></div>
										))}
									</div>

									<span className="text-xs sm:text-sm text-gray-600">1:30</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ResponsiveDashboardLayout>
	);
}
