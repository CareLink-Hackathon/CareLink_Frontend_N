'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
	Menu,
	MoreVertical,
	Settings,
	HelpCircle,
	Plus,
	Paperclip,
	Mic,
	MessageSquare,
	Send,
	Copy,
	ThumbsUp,
	ThumbsDown,
	RotateCcw,
	X,
	Activity,
	Calendar,
	Star,
	FileText,
	Bell,
	LogOut,
	Upload,
	MicIcon,
	Square,
	Image,
	FileCheck,
	Play,
	Pause,
	Download,
	Loader2,
	CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UploadedFile {
	file: File;
	id: string;
	status: 'uploading' | 'completed' | 'error';
	progress: number;
}

interface RecordedAudio {
	id: string;
	blob: Blob;
	duration: number;
	name: string;
}

export default function PatientChatbot() {
	const [message, setMessage] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [recordedAudios, setRecordedAudios] = useState<RecordedAudio[]>([]);
	const [audioLevel, setAudioLevel] = useState(0);
	const [recordingTime, setRecordingTime] = useState(0);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewText, setReviewText] = useState('');
	const [reviewRating, setReviewRating] = useState(5);
	const [isRecordingReview, setIsRecordingReview] = useState(false);
	const [reviewRecordingTime, setReviewRecordingTime] = useState(0);
	const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const recordingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const reviewRecordingIntervalRef = useRef<NodeJS.Timeout | undefined>(
		undefined
	);
	const audioChunksRef = useRef<Blob[]>([]);

	const router = useRouter();

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	// Audio recording functions
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			// Set up audio context for visualization
			const audioContext = new AudioContext();
			const analyser = audioContext.createAnalyser();
			const microphone = audioContext.createMediaStreamSource(stream);
			microphone.connect(analyser);
			audioContextRef.current = audioContext;
			analyserRef.current = analyser;

			// Start recording
			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer
			recordingIntervalRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);

			// Start audio level monitoring
			const updateAudioLevel = () => {
				if (analyserRef.current) {
					const dataArray = new Uint8Array(
						analyserRef.current.frequencyBinCount
					);
					analyserRef.current.getByteFrequencyData(dataArray);
					const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
					setAudioLevel(average);
				}
				if (isRecording) {
					animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
				}
			};
			updateAudioLevel();

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: 'audio/wav',
				});
				const audioId = Date.now().toString();
				const audioFile: RecordedAudio = {
					id: audioId,
					blob: audioBlob,
					duration: recordingTime,
					name: `Recording_${new Date().toLocaleTimeString()}`,
				};
				setRecordedAudios((prev) => [...prev, audioFile]);
			};
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());

			if (audioContextRef.current) {
				audioContextRef.current.close();
			}

			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			setIsRecording(false);
			setAudioLevel(0);
		}
	};

	// File upload handler with loading states
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files).map((file) => ({
				file,
				id: Date.now().toString() + Math.random().toString(),
				status: 'uploading' as const,
				progress: 0,
			}));

			setUploadedFiles((prev) => [...prev, ...newFiles]);

			// Simulate upload progress
			newFiles.forEach((uploadFile, index) => {
				const interval = setInterval(() => {
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === uploadFile.id
								? { ...f, progress: Math.min(f.progress + 20, 100) }
								: f
						)
					);
				}, 200);

				setTimeout(() => {
					clearInterval(interval);
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === uploadFile.id
								? { ...f, status: 'completed', progress: 100 }
								: f
						)
					);
				}, 1000 + index * 200);
			});
		}
	};

	// Get file icon based on file type
	const getFileIcon = (uploadedFile: UploadedFile) => {
		const fileType = uploadedFile.file.type.toLowerCase();
		if (fileType.startsWith('image/')) {
			return <Image className="w-4 h-4 text-green-500" />;
		} else if (fileType.includes('pdf')) {
			return <FileText className="w-4 h-4 text-red-500" />;
		} else if (fileType.includes('document') || fileType.includes('doc')) {
			return <FileText className="w-4 h-4 text-blue-500" />;
		} else {
			return <FileText className="w-4 h-4 text-gray-500" />;
		}
	};

	const removeFile = (id: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const removeAudio = (id: string) => {
		setRecordedAudios((prev) => prev.filter((a) => a.id !== id));
	};

	// Audio playback functions
	const playAudio = (audioId: string) => {
		const audio = recordedAudios.find((a) => a.id === audioId);
		if (audio) {
			const audioUrl = URL.createObjectURL(audio.blob);
			const audioElement = new Audio(audioUrl);
			audioElement.play();
			setPlayingAudioId(audioId);

			audioElement.onended = () => {
				setPlayingAudioId(null);
				URL.revokeObjectURL(audioUrl);
			};
		}
	};

	const stopAudio = () => {
		setPlayingAudioId(null);
	};

	// Review recording functions
	const startReviewRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.start();
			setIsRecordingReview(true);
			setReviewRecordingTime(0);

			reviewRecordingIntervalRef.current = setInterval(() => {
				setReviewRecordingTime((prev) => prev + 1);
			}, 1000);

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					// Convert audio to text (mock implementation)
					setTimeout(() => {
						setReviewText(
							(prev) =>
								prev + ' Voice recorded: Thank you for the excellent service!'
						);
					}, 1000);
				}
			};
		} catch (error) {
			console.error('Error starting review recording:', error);
		}
	};

	const stopReviewRecording = () => {
		setIsRecordingReview(false);
		setReviewRecordingTime(0);

		if (reviewRecordingIntervalRef.current) {
			clearInterval(reviewRecordingIntervalRef.current);
		}
	};

	// Format recording time
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// Format file size
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	// Submit review
	const submitReview = () => {
		console.log('Review submitted:', {
			rating: reviewRating,
			text: reviewText,
		});
		setShowReviewModal(false);
		setReviewText('');
		setReviewRating(5);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}
			if (reviewRecordingIntervalRef.current) {
				clearInterval(reviewRecordingIntervalRef.current);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	const chatHistory = [
		{
			title: 'Appointment Booking',
			preview:
				'I need help booking an appointment with a cardiologist for next week...',
			time: 'Yesterday',
		},
		{
			title: 'Medication Query',
			preview:
				'Can you tell me about the side effects of my prescribed medication?',
			time: 'Yesterday',
		},
		{
			title: 'Symptoms Check',
			preview: "I've been experiencing chest pain and shortness of breath...",
			time: 'Today',
		},
		{
			title: 'Lab Results',
			preview: 'Can you help me understand my recent blood test results?',
			time: 'Today',
		},
	];

	const messages = [
		{
			type: 'bot',
			content:
				"Hello! I'm your CareLink AI assistant. How can I help you with your healthcare needs today?",
			timestamp: '10:30 AM',
		},
		{
			type: 'user',
			content:
				"I've been experiencing some chest pain and I'm worried. Can you help me understand what might be causing it?",
			timestamp: '10:32 AM',
		},
		{
			type: 'bot',
			content:
				"I understand your concern about chest pain. While I can provide general information, it's important to note that chest pain can have various causes and should be evaluated by a healthcare professional. Some common causes include muscle strain, acid reflux, anxiety, or more serious conditions affecting the heart. Given the nature of your symptoms, I'd recommend scheduling an appointment with your doctor or visiting an emergency room if the pain is severe or accompanied by other symptoms like shortness of breath, nausea, or dizziness. Would you like me to help you book an appointment?",
			timestamp: '10:33 AM',
		},
	];

	return (
		<div className="flex h-screen bg-gray-50 relative overflow-hidden">
			{/* Mobile Sidebar Overlay */}
			{showSidebar && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={() => setShowSidebar(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`${
					showSidebar ? 'translate-x-0' : '-translate-x-full'
				} fixed md:relative md:translate-x-0 w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white z-50 transition-transform duration-300 ease-in-out md:flex md:flex-col h-full`}
			>
				<div className="p-4 sm:p-6">
					<div className="flex items-center justify-between mb-6 sm:mb-8">
						<div className="flex items-center space-x-3">
							<Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white">
								<AvatarImage src="/placeholder.svg?height=48&width=48" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-bold text-sm sm:text-base">JOHN DOE</h3>
								<p className="text-blue-100 text-xs sm:text-sm">Patient</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="text-white hover:bg-blue-500 md:hidden"
							onClick={() => setShowSidebar(false)}
						>
							<X className="w-4 h-4 sm:w-5 sm:h-5" />
						</Button>
					</div>

					<nav className="space-y-1 sm:space-y-2">
						{sidebarItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="flex items-center space-x-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors text-white hover:bg-blue-500 text-sm sm:text-base"
								onClick={() => setShowSidebar(false)}
							>
								<item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
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

				<div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
					<Button
						variant="ghost"
						className="text-white hover:bg-blue-500 w-full justify-start text-sm sm:text-base"
						onClick={() => router.push('/login')}
					>
						<LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
						Sign-out
					</Button>
				</div>
			</div>

			{/* Chat Sidebar - Hidden on mobile, compact on tablet */}
			<div className="hidden lg:flex lg:w-72 xl:w-80 bg-white border-r border-gray-200 flex-col">
				{/* Header */}
				<div className="p-4 border-b border-gray-200 bg-gray-50">
					<div className="flex items-center justify-between">
						<h1 className="text-lg xl:text-xl font-bold text-gray-800">
							Chat History
						</h1>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-600 hover:bg-gray-100"
						>
							<MoreVertical className="w-5 h-5" />
						</Button>
					</div>
				</div>

				{/* New Chat Button */}
				<div className="p-4">
					<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
						<Plus className="w-4 h-4 mr-2" />
						New Chat
					</Button>
				</div>

				{/* Chat History */}
				<div className="flex-1 p-4 overflow-y-auto">
					<div className="space-y-3">
						{chatHistory.map((chat, index) => (
							<div
								key={index}
								className="p-3 bg-gray-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-200"
							>
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-medium text-gray-800 text-sm">
										{chat.title}
									</h3>
									<span className="text-xs text-gray-500">{chat.time}</span>
								</div>
								<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
									{chat.preview}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col bg-white min-w-0">
				{/* Chat Header */}
				<div className="p-4 border-b border-gray-200 bg-white shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3 min-w-0">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden flex-shrink-0"
								onClick={() => setShowSidebar(true)}
							>
								<Menu className="w-5 h-5" />
							</Button>
							<div className="flex items-center space-x-3 min-w-0">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
									<MessageSquare className="w-5 h-5 text-white" />
								</div>
								<div className="min-w-0">
									<h2 className="font-semibold text-gray-800 truncate">
										CareLink AI Assistant
									</h2>
									<div className="flex items-center space-x-1">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<p className="text-sm text-green-600 font-medium">Online</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Button variant="ghost" size="icon" className="lg:hidden">
								<Plus className="w-4 h-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<Settings className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex ${
								msg.type === 'user' ? 'justify-end' : 'justify-start'
							}`}
						>
							<div
								className={`max-w-[85%] sm:max-w-2xl ${
									msg.type === 'user' ? 'order-2' : 'order-1'
								}`}
							>
								<div
									className={`p-4 rounded-2xl shadow-sm ${
										msg.type === 'user'
											? 'bg-blue-600 text-white rounded-br-md'
											: 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
									}`}
								>
									<p className="text-sm sm:text-base break-words leading-relaxed">
										{msg.content}
									</p>
									<div
										className={`text-xs mt-2 ${
											msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
										}`}
									>
										{msg.timestamp}
									</div>
								</div>
								{msg.type === 'bot' && (
									<div className="flex items-center space-x-2 mt-3 ml-2">
										<Button
											variant="ghost"
											size="icon"
											className="w-8 h-8 hover:bg-gray-100"
										>
											<Copy className="w-4 h-4 text-gray-500" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="w-8 h-8 hover:bg-gray-100"
										>
											<ThumbsUp className="w-4 h-4 text-gray-500" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="w-8 h-8 hover:bg-gray-100"
										>
											<ThumbsDown className="w-4 h-4 text-gray-500" />
										</Button>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Regenerate Button */}
				<div className="px-4 py-3 bg-gray-50">
					<Button
						variant="outline"
						className="mx-auto flex items-center space-x-2 text-sm bg-white hover:bg-gray-50 border-gray-300"
					>
						<RotateCcw className="w-4 h-4" />
						<span>Regenerate Response</span>
					</Button>
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-gray-200 bg-white">
					{/* Uploaded Files Display */}
					{uploadedFiles.length > 0 && (
						<div className="mb-4">
							<h4 className="text-sm font-medium text-gray-700 mb-3">
								Attached Files
							</h4>
							<div className="space-y-2">
								{uploadedFiles.map((uploadedFile) => (
									<div
										key={uploadedFile.id}
										className="flex items-center bg-gray-50 rounded-xl px-3 py-3 border border-gray-200"
									>
										<div className="flex items-center space-x-3 flex-1 min-w-0">
											{uploadedFile.status === 'uploading' ? (
												<Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
											) : uploadedFile.status === 'completed' ? (
												<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
											) : (
												getFileIcon(uploadedFile)
											)}
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium truncate text-gray-800">
														{uploadedFile.file.name}
													</span>
													<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
														{formatFileSize(uploadedFile.file.size)}
													</span>
												</div>
												{uploadedFile.status === 'uploading' && (
													<div className="mt-1">
														<Progress
															value={uploadedFile.progress}
															className="h-1"
														/>
													</div>
												)}
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="w-8 h-8 ml-2 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
											onClick={() => removeFile(uploadedFile.id)}
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Recorded Audio Display */}
					{recordedAudios.length > 0 && (
						<div className="mb-4">
							<h4 className="text-sm font-medium text-gray-700 mb-3">
								Voice Recordings
							</h4>
							<div className="space-y-2">
								{recordedAudios.map((audio) => (
									<div
										key={audio.id}
										className="flex items-center bg-blue-50 rounded-xl px-3 py-3 border border-blue-200"
									>
										<div className="flex items-center space-x-3 flex-1 min-w-0">
											<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
												<MicIcon className="w-4 h-4 text-white" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-gray-800">
														{audio.name}
													</span>
													<span className="text-xs text-gray-500 ml-2">
														{formatTime(audio.duration)}
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2 ml-2">
											<Button
												variant="ghost"
												size="icon"
												className="w-8 h-8 text-blue-600 hover:bg-blue-100"
												onClick={() =>
													playingAudioId === audio.id
														? stopAudio()
														: playAudio(audio.id)
												}
											>
												{playingAudioId === audio.id ? (
													<Pause className="w-4 h-4" />
												) : (
													<Play className="w-4 h-4" />
												)}
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
												onClick={() => removeAudio(audio.id)}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Recording Indicator */}
					{isRecording && (
						<div className="mb-4">
							<div className="flex items-center bg-red-50 border border-red-200 rounded-xl px-4 py-3">
								<div className="flex items-center space-x-3 w-full">
									<div className="relative flex-shrink-0">
										<div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
										<div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
									</div>
									<span className="text-red-700 font-medium text-sm">
										Recording: {formatTime(recordingTime)}
									</span>
									<div className="flex space-x-1 flex-1 justify-center max-w-32">
										{[...Array(20)].map((_, i) => (
											<div
												key={i}
												className={`w-1 rounded-full transition-all duration-150 ${
													i < audioLevel / 12
														? 'h-6 bg-red-500 opacity-100'
														: i < audioLevel / 8
														? 'h-4 bg-red-400 opacity-80'
														: i < audioLevel / 6
														? 'h-3 bg-red-300 opacity-60'
														: 'h-2 bg-red-200 opacity-40'
												}`}
											/>
										))}
									</div>
									<Button
										size="sm"
										variant="outline"
										className="text-red-600 border-red-200 hover:bg-red-100 flex-shrink-0"
										onClick={stopRecording}
									>
										<Square className="w-3 h-3 mr-1" />
										Stop
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Input Field */}
					<div className="flex items-end space-x-3">
						<div className="flex-1 relative">
							<Textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Ask about your health, symptoms, or upload files..."
								className="min-h-[60px] pr-16 resize-none text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										if (
											message.trim() ||
											uploadedFiles.length > 0 ||
											recordedAudios.length > 0
										) {
											// Send message logic here
											console.log('Sending:', {
												message,
												files: uploadedFiles,
												audios: recordedAudios,
											});
											setMessage('');
											setUploadedFiles([]);
											setRecordedAudios([]);
										}
									}
								}}
							/>
							<div className="absolute bottom-3 right-3 flex items-center space-x-2">
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileUpload}
									multiple
									className="hidden"
									accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								/>
								<Button
									variant="ghost"
									size="icon"
									className="w-8 h-8 hover:bg-gray-100 text-gray-500"
									onClick={() => fileInputRef.current?.click()}
									title="Upload files"
								>
									<Paperclip className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className={`w-8 h-8 transition-all duration-200 ${
										isRecording
											? 'bg-red-100 text-red-600 hover:bg-red-200 scale-110'
											: 'hover:bg-gray-100 text-gray-500'
									}`}
									onClick={isRecording ? stopRecording : startRecording}
									title={isRecording ? 'Stop recording' : 'Voice recording'}
								>
									{isRecording ? (
										<Square className="w-4 h-4 animate-pulse" />
									) : (
										<Mic className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
						<Button
							size="icon"
							className="w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-md rounded-xl"
							onClick={() => {
								if (
									message.trim() ||
									uploadedFiles.length > 0 ||
									recordedAudios.length > 0
								) {
									// Send message logic here
									console.log('Sending:', {
										message,
										files: uploadedFiles,
										audios: recordedAudios,
									});
									setMessage('');
									setUploadedFiles([]);
									setRecordedAudios([]);
								}
							}}
						>
							<Send className="w-5 h-5" />
						</Button>
					</div>

					{/* Quick Actions */}
					<div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
						<div className="flex items-center space-x-4">
							<span className="text-xs text-gray-500">Quick actions:</span>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-7 px-2 text-gray-600 hover:bg-gray-100"
								onClick={() => setMessage('I need help with my symptoms')}
							>
								Symptoms
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-7 px-2 text-gray-600 hover:bg-gray-100"
								onClick={() =>
									setMessage('Can you help me book an appointment?')
								}
							>
								Appointment
							</Button>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="w-7 h-7 hover:bg-gray-100"
							onClick={() => setShowReviewModal(true)}
							title="Leave a review"
						>
							<Star className="w-4 h-4 text-gray-500" />
						</Button>
					</div>
				</div>
			</div>

			{/* Review Modal */}
			{showReviewModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Leave a Review</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowReviewModal(false)}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Rating */}
							<div>
								<label className="text-sm font-medium mb-2 block">Rating</label>
								<div className="flex space-x-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Button
											key={star}
											variant="ghost"
											size="icon"
											onClick={() => setReviewRating(star)}
											className="p-0 w-8 h-8"
										>
											<Star
												className={`w-5 h-5 ${
													star <= reviewRating
														? 'fill-yellow-400 text-yellow-400'
														: 'text-gray-300'
												}`}
											/>
										</Button>
									))}
								</div>
							</div>

							{/* Review Text */}
							<div>
								<label className="text-sm font-medium mb-2 block">
									Your Review
								</label>
								<Textarea
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
									placeholder="Share your experience..."
									className="min-h-[100px]"
								/>
							</div>

							{/* Voice Recording for Review */}
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={
											isRecordingReview
												? stopReviewRecording
												: startReviewRecording
										}
										className={`transition-all duration-200 ${
											isRecordingReview
												? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
												: 'hover:bg-gray-50'
										}`}
									>
										{isRecordingReview ? (
											<>
												<Square className="w-4 h-4 mr-1 animate-pulse" />
												Stop Recording ({formatTime(reviewRecordingTime)})
											</>
										) : (
											<>
												<MicIcon className="w-4 h-4 mr-1" />
												Record Voice Review
											</>
										)}
									</Button>
								</div>
								{isRecordingReview && (
									<div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
										<div className="flex items-center space-x-2">
											<div className="relative">
												<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
												<div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
											</div>
											<span className="text-sm text-red-600 font-medium">
												Recording voice review...
											</span>
										</div>
										<div className="flex space-x-1">
											{[...Array(8)].map((_, i) => (
												<div
													key={i}
													className={`w-1 rounded-full transition-all duration-150 ${
														i < 4
															? 'h-3 bg-red-500 opacity-100'
															: i < 6
															? 'h-2 bg-red-400 opacity-80'
															: 'h-1 bg-red-300 opacity-60'
													}`}
												/>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Submit Button */}
							<div className="flex space-x-2">
								<Button
									variant="outline"
									onClick={() => setShowReviewModal(false)}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									onClick={submitReview}
									className="flex-1 bg-blue-600 hover:bg-blue-700"
								>
									Submit Review
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
