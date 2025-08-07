'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/lib/contexts/patient-context';
import { useAuth } from '@/lib/auth-context';
import { patientService } from '@/lib/services/patient-service';
import { Chat, ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Activity,
	Calendar,
	FileText,
	Star,
	Bell,
	Settings,
	HelpCircle,
	MessageSquare,
	Send,
	Plus,
	Loader2,
	AlertCircle,
	Bot,
	User,
	LogOut,
	MoreVertical,
	Mic,
	Square,
	Paperclip,
	RotateCcw,
	X,
	Languages,
	CheckCircle,
} from 'lucide-react';

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
	const router = useRouter();
	const { user } = useAuth();
	const { 
		chats, 
		currentChat, 
		createNewChat, 
		sendMessage,
		sendEnhancedMessage,
		transcribeAudio,
		processDocument,
		selectChat,
		loadChatHistory,
		isLoading, 
		error,
		clearError 
	} = usePatient();

	const [message, setMessage] = useState('');
	const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr'>('en');
	const [isRecording, setIsRecording] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [recordedAudios, setRecordedAudios] = useState<RecordedAudio[]>([]);
	const [audioLevel, setAudioLevel] = useState(0);
	const [recordingTime, setRecordingTime] = useState(0);
	const [isSending, setIsSending] = useState(false);
	const [isProcessingAudio, setIsProcessingAudio] = useState(false);
	const [isProcessingDocument, setIsProcessingDocument] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const recordingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const audioChunksRef = useRef<Blob[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

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

	// User info for sidebar
	const userInfo = user ? {
		name: `${user.first_name} ${user.last_name}`.toUpperCase(),
		fallback: `${user.first_name[0]}${user.last_name[0]}`,
		role: 'Patient',
		id: user._id,
	} : {
		name: 'Anonymous User',
		fallback: 'AU',
		role: 'Patient',
		id: '',
	};

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [currentChat?.messages]);

	// Create new chat
	const handleNewChat = async () => {
		if (!message.trim()) return;
		
		const chatName = patientService.generateDefaultChatName(message);
		const chatId = await createNewChat(chatName);
		
		if (chatId) {
			await handleSendMessage(chatId);
		}
	};

	// Send message to existing chat with enhanced features
	const handleSendMessage = async (chatId?: string) => {
		const targetChatId = chatId || currentChat?.chat_id;
		if (!targetChatId || (!message.trim() && uploadedFiles.length === 0 && recordedAudios.length === 0)) {
			return;
		}

		setIsSending(true);
		
		try {
			// Use enhanced messaging if we have files or audio
			if (uploadedFiles.length > 0 || recordedAudios.length > 0) {
				// Process multiple files and audio recordings
				for (const uploadedFile of uploadedFiles) {
					const success = await sendEnhancedMessage(targetChatId, {
						message: message || `Processing ${uploadedFile.file.name}`,
						documentFile: uploadedFile.file
					});
					if (!success) break;
				}
				
				for (const recordedAudio of recordedAudios) {
					const success = await sendEnhancedMessage(targetChatId, {
						message: message || `Processing audio recording`,
						audioBlob: recordedAudio.blob,
						audioLanguage: selectedLanguage
					});
					if (!success) break;
				}
				
				// If we have message text without files/audio, send it separately
				if (message.trim() && uploadedFiles.length === 0 && recordedAudios.length === 0) {
					await sendMessage(targetChatId, message);
				}
				
				setMessage('');
				setUploadedFiles([]);
				setRecordedAudios([]);
			} else {
				// Use regular messaging for text-only
				const success = await sendMessage(targetChatId, message);
				
				if (success) {
					setMessage('');
				}
			}
		} catch (error) {
			console.error('Error sending message:', error);
		}
		
		setIsSending(false);
	};

	// Handle sending message or creating new chat
	const handleSubmit = async () => {
		if (!message.trim() && uploadedFiles.length === 0 && recordedAudios.length === 0) {
			return;
		}

		if (currentChat) {
			await handleSendMessage();
		} else {
			await handleNewChat();
		}
	};

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
					const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
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

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
				const audioId = Date.now().toString();
				const audioFile: RecordedAudio = {
					id: audioId,
					blob: audioBlob,
					duration: recordingTime,
					name: `Recording ${recordedAudios.length + 1}`,
				};
				
				setRecordedAudios((prev) => [...prev, audioFile]);
				
				// Transcribe the audio automatically
				setIsProcessingAudio(true);
				try {
					const transcribedText = await transcribeAudio(audioBlob, selectedLanguage);
					if (transcribedText) {
						setMessage((prev) => 
							prev + (prev ? '\n\n' : '') + 
							`[Audio transcription (${selectedLanguage.toUpperCase()})]\n${transcribedText}`
						);
					}
				} catch (error) {
					console.error('Error transcribing audio:', error);
				}
				setIsProcessingAudio(false);
			};
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	};

	const stopRecording = () => {
		setIsRecording(false);
		setAudioLevel(0);
		
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}
		
		if (recordingIntervalRef.current) {
			clearInterval(recordingIntervalRef.current);
		}
		
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
		
		if (audioContextRef.current) {
			audioContextRef.current.close();
		}
	};

	// File upload handler with processing
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files).map((file) => ({
				file,
				id: Date.now().toString() + Math.random().toString(),
				status: 'uploading' as const,
				progress: 0,
			}));

			setUploadedFiles((prev) => [...prev, ...newFiles]);
			setIsProcessingDocument(true);

			// Process each file
			for (const uploadFile of newFiles) {
				try {
					// Update progress
					const updateProgress = (progress: number) => {
						setUploadedFiles((prev) =>
							prev.map((f) =>
								f.id === uploadFile.id
									? { ...f, progress }
									: f
							)
						);
					};

					// Simulate initial upload progress
					updateProgress(30);
					
					// Process the document
					const extractedText = await processDocument(uploadFile.file);
					
					updateProgress(80);
					
					if (extractedText) {
						// Add extracted text as message preview
						setMessage((prev) => 
							prev + (prev ? '\n\n' : '') + 
							`[Document: ${uploadFile.file.name}]\n${extractedText.substring(0, 200)}${extractedText.length > 200 ? '...' : ''}`
						);
						updateProgress(100);
						
						setUploadedFiles((prev) =>
							prev.map((f) =>
								f.id === uploadFile.id
									? { ...f, status: 'completed', progress: 100 }
									: f
							)
						);
					} else {
						throw new Error('Failed to extract text from document');
					}
				} catch (error) {
					console.error('Error processing document:', error);
					setUploadedFiles((prev) =>
						prev.map((f) =>
							f.id === uploadFile.id
								? { ...f, status: 'error', progress: 0 }
								: f
						)
					);
				}
			}
			
			setIsProcessingDocument(false);
		}
	};

	// Format time helper
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return (
		<ProtectedRoute allowedRoles={['patient']}>
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				showSearch={false}
			>
				<div className="flex h-full bg-gray-50">
					{/* Chat Sidebar */}
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
						<Button 
							className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
							onClick={() => {
								createNewChat('New CareLink Chat');
								setMessage('');
							}}
						>
							<Plus className="w-4 h-4 mr-2" />
							New Chat
						</Button>
					</div>

					{/* Chat History */}
					<div className="flex-1 p-4 overflow-y-auto">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-blue-600" />
							</div>
						) : chats.length === 0 ? (
							<div className="text-center py-8">
								<MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
								<p className="text-gray-500">No chat history yet</p>
								<p className="text-sm text-gray-400 mt-2">Start a conversation!</p>
							</div>
						) : (
							<div className="space-y-3">
								{chats.map((chat) => (
									<div
										key={chat.chat_id}
										onClick={() => selectChat(chat.chat_id)}
										className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
											currentChat?.chat_id === chat.chat_id
												? 'bg-blue-50 border-blue-200'
												: 'bg-gray-50 hover:bg-blue-50 border-gray-100 hover:border-blue-200'
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<h3 className={`font-medium text-sm truncate ${
												currentChat?.chat_id === chat.chat_id
													? 'text-blue-800'
													: 'text-gray-800'
											}`}>
												{chat.chat_name}
											</h3>
											<span className="text-xs text-gray-500">
												{patientService.formatDate(chat.updated_at)}
											</span>
										</div>
										{chat.messages.length > 0 && (
											<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
												{chat.messages[chat.messages.length - 1].query}
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Main Chat Area */}
				<div className="flex-1 flex flex-col bg-white min-w-0">
					{/* Header */}
					<div className="p-4 border-b border-gray-200 bg-white shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
									<Bot className="w-6 h-6 text-white" />
								</div>
								<div>
									<h2 className="font-semibold text-gray-900">CareLink Assistant</h2>
									<p className="text-sm text-gray-500">Your AI Healthcare Companion</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								{/* Language Selector */}
								<div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
									<Button
										variant={selectedLanguage === 'en' ? 'default' : 'ghost'}
										size="sm"
										className={`px-3 py-1 text-xs h-7 ${
											selectedLanguage === 'en' 
												? 'bg-white shadow-sm text-gray-900' 
												: 'text-gray-600 hover:bg-gray-200'
										}`}
										onClick={() => setSelectedLanguage('en')}
									>
										EN
									</Button>
									<Button
										variant={selectedLanguage === 'fr' ? 'default' : 'ghost'}
										size="sm"
										className={`px-3 py-1 text-xs h-7 ${
											selectedLanguage === 'fr' 
												? 'bg-white shadow-sm text-gray-900' 
												: 'text-gray-600 hover:bg-gray-200'
										}`}
										onClick={() => setSelectedLanguage('fr')}
									>
										FR
									</Button>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-500 hover:bg-gray-100"
									onClick={() => {
										createNewChat('New CareLink Chat');
										setMessage('');
									}}
								>
									<RotateCcw className="w-5 h-5" />
								</Button>
							</div>
						</div>
					</div>

					{/* Processing Indicators */}
					{(isProcessingAudio || isProcessingDocument) && (
						<div className="p-4 bg-blue-50 border-b border-blue-200">
							<div className="flex items-center space-x-2">
								<Loader2 className="w-4 h-4 animate-spin text-blue-600" />
								<p className="text-blue-700 text-sm">
									{isProcessingAudio && 'Transcribing audio...'}
									{isProcessingDocument && 'Processing document...'}
									{isProcessingAudio && isProcessingDocument && 'Processing files...'}
								</p>
							</div>
						</div>
					)}

					{/* Error Display */}
					{error && (
						<div className="p-4 bg-red-50 border-b border-red-200">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<AlertCircle className="w-4 h-4 text-red-600" />
									<p className="text-red-700 text-sm">{error}</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={clearError}
									className="text-red-600 hover:bg-red-100"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
						{!currentChat ? (
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										Welcome to Enhanced CareLink AI
									</h3>
									<p className="text-gray-600 mb-4">
										Chat with text, voice (EN/FR), or upload documents for comprehensive medical assistance
									</p>
									<div className="flex flex-wrap gap-2 justify-center max-w-md">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setMessage('I need help with my symptoms')}
										>
											Symptoms Help
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setMessage('Can you help me book an appointment?')}
										>
											Book Appointment
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setMessage('Analyze my medical report')}
										>
											Document Analysis
										</Button>
									</div>
								</div>
							</div>
						) : (
							<>
								{currentChat.messages.map((msg, index) => (
									<div key={index} className="space-y-4">
										{/* User Message */}
										<div className="flex justify-end">
											<div className="max-w-xs lg:max-w-md xl:max-w-lg">
												<div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
													<p className="text-sm leading-relaxed">{msg.query}</p>
												</div>
												<p className="text-xs text-gray-500 mt-1 text-right">
													{patientService.formatDateTime(msg.timestamp)}
												</p>
											</div>
										</div>

										{/* Bot Response */}
										<div className="flex justify-start">
											<div className="flex space-x-3 max-w-xs lg:max-w-md xl:max-w-lg">
												<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
													<Bot className="w-4 h-4 text-gray-600" />
												</div>
												<div>
													<div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
														<p className="text-sm leading-relaxed text-gray-800">
															{msg.response}
														</p>
													</div>
													<p className="text-xs text-gray-500 mt-1">
														{patientService.formatDateTime(msg.timestamp)}
													</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<div className="p-4 border-t border-gray-200 bg-white">
						{/* Recorded Audio Display */}
						{recordedAudios.length > 0 && (
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-700 mb-3">
									Audio Recordings
								</h4>
								<div className="space-y-2">
									{recordedAudios.map((audio) => (
										<div
											key={audio.id}
											className="flex items-center bg-blue-50 rounded-xl px-3 py-3 border border-blue-200"
										>
											<div className="flex items-center space-x-3 flex-1 min-w-0">
												<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
													<Mic className="w-4 h-4 text-blue-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														{audio.name}
													</p>
													<p className="text-xs text-gray-500">
														Duration: {formatTime(audio.duration)} • Language: {selectedLanguage.toUpperCase()}
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="flex-shrink-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
												onClick={() =>
													setRecordedAudios(prev => prev.filter(a => a.id !== audio.id))
												}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* File Uploads Display */}
						{uploadedFiles.length > 0 && (
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-700 mb-3">
									Attached Files
								</h4>
								<div className="space-y-2">
									{uploadedFiles.map((uploadedFile) => (
										<div
											key={uploadedFile.id}
											className={`flex items-center rounded-xl px-3 py-3 border ${
												uploadedFile.status === 'completed' 
													? 'bg-green-50 border-green-200' 
													: uploadedFile.status === 'error'
													? 'bg-red-50 border-red-200'
													: 'bg-gray-50 border-gray-200'
											}`}
										>
											<div className="flex items-center space-x-3 flex-1 min-w-0">
												{uploadedFile.status === 'completed' ? (
													<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
												) : uploadedFile.status === 'error' ? (
													<AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
												) : (
													<Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
												)}
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 truncate">
														{uploadedFile.file.name}
													</p>
													<div className="flex items-center space-x-2 mt-1">
														{uploadedFile.status !== 'error' && (
															<>
																<div className="flex-1 bg-gray-200 rounded-full h-1.5">
																	<div
																		className={`h-1.5 rounded-full transition-all duration-300 ${
																			uploadedFile.status === 'completed' 
																				? 'bg-green-500' 
																				: 'bg-blue-600'
																		}`}
																		style={{ width: `${uploadedFile.progress}%` }}
																	></div>
																</div>
																<span className="text-xs text-gray-500">
																	{uploadedFile.status === 'completed' ? 'Processed' : `${uploadedFile.progress}%`}
																</span>
															</>
														)}
														{uploadedFile.status === 'error' && (
															<span className="text-xs text-red-600">
																Processing failed
															</span>
														)}
													</div>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="flex-shrink-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
												onClick={() =>
													setUploadedFiles(prev => prev.filter(f => f.id !== uploadedFile.id))
												}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Recording Status */}
						{isRecording && (
							<div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="relative">
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
						)}

						{/* Input Field */}
						<div className="flex items-end space-x-3">
							<div className="flex-1 relative">
								<Textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Type your message, record audio, or upload documents for analysis..."
									className="min-h-[60px] pr-16 resize-none text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											if (message.trim() || uploadedFiles.length > 0 || recordedAudios.length > 0) {
												handleSubmit();
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
										className="w-8 h-8 hover:bg-gray-100"
										onClick={() => fileInputRef.current?.click()}
									>
										<Paperclip className="w-4 h-4 text-gray-500" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className={`w-8 h-8 ${
											isRecording
												? 'text-red-600 bg-red-50 hover:bg-red-100'
												: 'text-gray-500 hover:bg-gray-100'
										}`}
										onClick={isRecording ? stopRecording : startRecording}
									>
										{isRecording ? (
											<Square className="w-4 h-4" />
										) : (
											<Mic className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>
							<Button
								size="icon"
								className="w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-md rounded-xl"
								onClick={handleSubmit}
								disabled={isSending || isLoading}
							>
								{isSending ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Send className="w-5 h-5" />
								)}
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
									onClick={() => setMessage('Analyze my medical documents')}
								>
									Document Analysis
								</Button>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-xs text-gray-500">
									Language: {selectedLanguage.toUpperCase()}
								</span>
								<div className="w-2 h-2 rounded-full bg-green-400"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}
