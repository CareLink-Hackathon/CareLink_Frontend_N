'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/lib/contexts/patient-context';
import { useAuth } from '@/lib/auth-context';
import { patientService } from '@/lib/services/patient-service';
import { FeedbackRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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

// Type declarations for Speech Recognition API
declare global {
	interface Window {
		SpeechRecognition: any;
		webkitSpeechRecognition: any;
	}
}

interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
	resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string;
}

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
	const [speechSupported, setSpeechSupported] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('en-US');
	const [selectedDoctor, setSelectedDoctor] = useState('');
	const [doctors, setDoctors] = useState<any[]>([]);
	
	// Speech recognition refs and state
	const recognitionRef = useRef<any>(null);
	const [transcript, setTranscript] = useState('');

	// Language options for speech recognition
	const languageOptions = [
		{ code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
		{ code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
		{ code: 'en-US', label: 'Pidgin English (Nigerian)', flag: '🇳🇬' }, // Using en-US for better compatibility
	];

	// Fetch doctors for selection
	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/doctors`, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
				
				if (response.ok) {
					const data = await response.json();
					setDoctors(data.doctors || []);
				}
			} catch (error) {
				console.error('Error fetching doctors:', error);
			}
		};

		fetchDoctors();
	}, []);

	// Check for speech recognition support on component mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			if (SpeechRecognition) {
				setSpeechSupported(true);
				const recognition = new SpeechRecognition();
				recognition.continuous = true;
				recognition.interimResults = true;
				recognition.lang = selectedLanguage;

				recognition.onresult = (event: any) => {
					let finalTranscript = '';
					let interimTranscript = '';

					for (let i = event.resultIndex; i < event.results.length; i++) {
						const transcript = event.results[i][0].transcript;
						if (event.results[i].isFinal) {
							finalTranscript += transcript;
						} else {
							interimTranscript += transcript;
						}
					}

					setTranscript(finalTranscript + interimTranscript);
					
					// Update the feedback text area with final transcript
					if (finalTranscript) {
						setFeedback(prev => {
							const newText = prev + (prev ? ' ' : '') + finalTranscript;
							return newText;
						});
					}
				};

				recognition.onerror = (event: any) => {
					console.error('Speech recognition error:', event.error);
					setIsRecording(false);
				};

				recognition.onend = () => {
					setIsRecording(false);
					setTranscript('');
				};

				recognitionRef.current = recognition;
			}
		}
	}, [selectedLanguage]); // Re-initialize when language changes

	// User info for responsive layout
	const userInfo = user ? {
		name: `${user.first_name} ${user.last_name}`.toUpperCase(),
		fallback: `${user.first_name[0]}${user.last_name[0]}`,
		role: 'Patient',
		id: user._id,
	} : {
		name: 'Patient',
		fallback: 'P',
		role: 'Patient',
		id: '',
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
		setFormErrors([]);
		setSubmitSuccess(false);

		// Validate required fields
		const errors: string[] = [];
		if (!feedback.trim()) {
			errors.push('Feedback message is required');
		}
		if (!selectedDoctor) {
			errors.push('Please select a doctor to review');
		}

		if (errors.length > 0) {
			setFormErrors(errors);
			return;
		}

		// Prepare feedback data with doctor information
		const feedbackData = {
			patient_id: user?.user_id || user?._id,
			patient_name: `${user?.first_name} ${user?.last_name}`,
			doctor_id: selectedDoctor,
			message: feedback.trim(),
			rating: rating,
			category: 'doctor_review',
			language: selectedLanguage,
		};

		setIsSubmitting(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/feedback`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify(feedbackData),
			});

			if (response.ok) {
				setSubmitSuccess(true);
				setFeedback('');
				setRating(5);
				setSelectedDoctor('');
				
				// Hide success message after 3 seconds
				setTimeout(() => {
					setSubmitSuccess(false);
				}, 3000);
			} else {
				const errorData = await response.json();
				setFormErrors([errorData.detail || 'Failed to submit feedback']);
			}
		} catch (error) {
			console.error('Error submitting feedback:', error);
			setFormErrors(['An error occurred while submitting feedback']);
		}
		
		setIsSubmitting(false);
	};

	const toggleRecording = () => {
		if (!speechSupported) {
			alert('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
			return;
		}

		if (isRecording) {
			// Stop recording
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
			setIsRecording(false);
		} else {
			// Start recording with selected language
			if (recognitionRef.current) {
				setTranscript('');
				recognitionRef.current.lang = selectedLanguage; // Set language before starting
				try {
					recognitionRef.current.start();
					setIsRecording(true);
				} catch (error) {
					console.error('Error starting speech recognition:', error);
					alert('Error starting speech recognition. Please try again.');
				}
			}
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
										{[1, 2, 3, 4, 5].map((star) => {
											const isActive = star <= rating;
											let starColor = 'text-gray-300';
											let fillColor = '';
											
											if (isActive) {
												if (rating <= 2) {
													starColor = 'text-red-500';
													fillColor = 'fill-red-500';
												} else if (rating === 3) {
													starColor = 'text-orange-500';
													fillColor = 'fill-orange-500';
												} else if (rating === 4) {
													starColor = 'text-blue-500';
													fillColor = 'fill-blue-500';
												} else {
													starColor = 'text-green-500';
													fillColor = 'fill-green-500';
												}
											}
											
											return (
												<button
													key={star}
													onClick={() => setRating(star)}
													className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
												>
													<Star
														className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-200 ${starColor} ${fillColor}`}
													/>
												</button>
											);
										})}
									</div>
									<p className="text-xs sm:text-sm text-gray-500">
										{rating === 1 && '😞 Poor - We need to improve'}
										{rating === 2 && '😐 Fair - Below expectations'}
										{rating === 3 && '😊 Good - Met expectations'}
										{rating === 4 && '😄 Very Good - Above expectations'}
										{rating === 5 && '🤩 Excellent - Exceeded expectations'}
									</p>
								</div>

								{/* Feedback Form */}
								<form onSubmit={handleSubmitFeedback}>
									{/* Doctor Selection */}
									<div className="mb-4 sm:mb-6">
										<Label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-2">
											Select Doctor to Review
										</Label>
										<Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose a doctor..." />
											</SelectTrigger>
											<SelectContent>
												{doctors.length > 0 ? (
													doctors.map((doctor) => (
														<SelectItem key={doctor._id} value={doctor._id}>
															<div className="flex flex-col">
																<span className="font-medium">{doctor.full_name}</span>
																<span className="text-sm text-gray-500">
																	{doctor.specialty} • {doctor.department_name}
																</span>
															</div>
														</SelectItem>
													))
												) : (
													<div className="p-2 text-sm text-gray-500 text-center">
														Loading doctors...
													</div>
												)}
											</SelectContent>
										</Select>
									</div>

									{/* Language Selection */}
									<div className="mb-4 sm:mb-6">
										<Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
											Voice Input Language
										</Label>
										<Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select language for voice input..." />
											</SelectTrigger>
											<SelectContent>
												{languageOptions.map((lang) => (
													<SelectItem key={lang.code} value={lang.code}>
														<div className="flex items-center space-x-2">
															<span>{lang.flag}</span>
															<span>{lang.label}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="mb-4 sm:mb-6">
										<Label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
											Your feedback
										</Label>
										<Textarea
											id="feedback"
											value={feedback}
											onChange={(e) => setFeedback(e.target.value)}
											placeholder="Share your thoughts and experiences about the doctor..."
											className="min-h-[100px] sm:min-h-[120px] border-gray-300 rounded-lg resize-none text-sm sm:text-base"
										/>
										
										{/* Live transcript display */}
										{isRecording && transcript && (
											<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
												<p className="text-xs text-blue-600 mb-1">Live transcript ({languageOptions.find(l => l.code === selectedLanguage)?.label}):</p>
												<p className="text-sm text-blue-800 italic">"{transcript}"</p>
											</div>
										)}
									</div>

									{/* Bottom Controls */}
									<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
										<div className="flex items-center space-x-2 sm:space-x-4">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={toggleRecording}
												disabled={!speechSupported}
												className={`flex items-center space-x-2 text-xs sm:text-sm transition-all duration-200 ${
													isRecording 
														? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
														: speechSupported 
														? 'hover:bg-blue-50 hover:border-blue-200' 
														: 'opacity-50 cursor-not-allowed'
												}`}
											>
												<Mic className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
													isRecording ? 'text-red-600 animate-pulse' : ''
												}`} />
												<span>
													{isRecording ? 'Stop Recording' : speechSupported ? `Voice Input (${languageOptions.find(l => l.code === selectedLanguage)?.flag})` : 'Voice Not Supported'}
												</span>
											</Button>
										</div>

										<Button
											type="submit"
											className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 flex items-center space-x-2 w-full sm:w-auto text-sm sm:text-base"
											disabled={isSubmitting || isLoading || !selectedDoctor || !feedback.trim()}
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
													<span>SENDING...</span>
												</>
											) : (
												<>
													<Send className="w-3 h-3 sm:w-4 sm:h-4" />
													<span>SEND REVIEW</span>
												</>
											)}
										</Button>
									</div>
								</form>

								{/* Voice Recording Visual Feedback */}
								{isRecording && (
									<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-2 sm:space-x-3">
												<div className="relative">
													<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
													<div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
												</div>
												<span className="text-red-700 font-medium text-sm">
													🎤 Voice Recording Active
												</span>
											</div>

											{/* Audio Waveform */}
											<div className="flex items-center space-x-0.5 sm:space-x-1">
												{Array.from({ length: 12 }).map((_, i) => (
													<div
														key={i}
														className="w-0.5 sm:w-1 bg-red-400 rounded-full animate-pulse"
														style={{
															height: `${Math.random() * 15 + 8}px`,
															animationDelay: `${i * 0.1}s`,
															animationDuration: '0.5s',
														}}
													></div>
												))}
											</div>
										</div>
										
										<div className="text-xs text-red-600 bg-white/50 rounded p-2">
											<p className="font-medium">💡 Tip: Speak clearly and pause when finished. Your speech will automatically appear in the text box above.</p>
											{transcript && (
												<p className="mt-1 italic">Current: "{transcript}"</p>
											)}
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
