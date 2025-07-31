'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import { patientService } from '../services/patient-service';
import {
	Chat,
	Appointment,
	FeedbackRequest,
	AppointmentRequest,
	ChatMessage,
} from '../types';

interface PatientState {
	// Chat state
	chats: Chat[];
	currentChat: Chat | null;
	chatHistory: ChatMessage[];

	// Appointment state
	appointments: Appointment[];

	// UI state
	isLoading: boolean;
	error: string | null;

	// Recent activity
	recentChats: Chat[];
	upcomingAppointments: Appointment[];
}

interface PatientContextType extends PatientState {
	// Chat operations
	createNewChat: (chatName: string) => Promise<string | null>;
	sendMessage: (chatId: string, message: string) => Promise<boolean>;
	loadChatHistory: () => Promise<void>;
	selectChat: (chatId: string) => void;

	// Appointment operations
	requestAppointment: (appointmentData: AppointmentRequest) => Promise<boolean>;
	loadAppointments: () => Promise<void>;

	// Feedback operations
	submitFeedback: (feedbackData: FeedbackRequest) => Promise<boolean>;

	// Utility operations
	clearError: () => void;
	refreshData: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	const [state, setState] = useState<PatientState>({
		chats: [],
		currentChat: null,
		chatHistory: [],
		appointments: [],
		isLoading: false,
		error: null,
		recentChats: [],
		upcomingAppointments: [],
	});

	// Update derived state when base state changes
	useEffect(() => {
		setState((prev) => ({
			...prev,
			recentChats: prev.chats.slice(0, 5),
			upcomingAppointments: prev.appointments
				.filter((apt) => {
					const aptDate = new Date(apt.date);
					const today = new Date();
					return (
						aptDate >= today &&
						(apt.status === 'pending' || apt.status === 'scheduled')
					);
				})
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.slice(0, 3),
		}));
	}, [state.chats, state.appointments]);

	// Helper function to set loading state
	const withLoading = async <T,>(
		operation: () => Promise<T>
	): Promise<T | null> => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));
		try {
			const result = await operation();
			setState((prev) => ({ ...prev, isLoading: false }));
			return result;
		} catch (error) {
			const errorMessage = patientService.parseApiError(error);
			setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
			return null;
		}
	};

	// Chat operations
	const createNewChat = async (chatName: string): Promise<string | null> => {
		if (!user?._id) return null;

		return withLoading(async () => {
			const response = await patientService.createNewChat(user._id, chatName);

			// Add new chat to state
			const newChat: Chat = {
				chat_id: response.chat_id,
				chat_name: response.chat_name,
				messages: [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			setState((prev) => ({
				...prev,
				chats: [newChat, ...prev.chats],
				currentChat: newChat,
			}));

			return response.chat_id;
		});
	};

	const sendMessage = async (
		chatId: string,
		message: string
	): Promise<boolean> => {
		if (!user?._id) return false;

		const success = await withLoading(async () => {
			const response = await patientService.sendChatMessage(
				user._id,
				chatId,
				message
			);

			// Update chat in state
			const newMessage: ChatMessage = {
				query: message,
				response: response.response,
				timestamp: new Date().toISOString(),
			};

			setState((prev) => {
				const updatedChats = prev.chats.map((chat) => {
					if (chat.chat_id === chatId) {
						return {
							...chat,
							messages: [...chat.messages, newMessage],
							updated_at: new Date().toISOString(),
							chat_name: response.chat_name, // Update name if changed
						};
					}
					return chat;
				});

				const updatedCurrentChat =
					prev.currentChat?.chat_id === chatId
						? updatedChats.find((chat) => chat.chat_id === chatId) ||
						  prev.currentChat
						: prev.currentChat;

				return {
					...prev,
					chats: updatedChats,
					currentChat: updatedCurrentChat,
				};
			});

			return true;
		});

		return success !== null;
	};

	const loadChatHistory = async (): Promise<void> => {
		if (!user?._id) return;

		await withLoading(async () => {
			const userData = await patientService.getChatHistory(user._id);

			setState((prev) => ({
				...prev,
				chats: userData.chats || [],
			}));

			return true;
		});
	};

	const selectChat = (chatId: string) => {
		const chat = state.chats.find((c) => c.chat_id === chatId);
		if (chat) {
			setState((prev) => ({ ...prev, currentChat: chat }));
		}
	};

	// Appointment operations
	const requestAppointment = async (
		appointmentData: AppointmentRequest
	): Promise<boolean> => {
		if (!user?._id) return false;

		// Validate appointment data
		const validationErrors =
			patientService.validateAppointmentData(appointmentData);
		if (validationErrors.length > 0) {
			setState((prev) => ({ ...prev, error: validationErrors[0] }));
			return false;
		}

		const success = await withLoading(async () => {
			const response = await patientService.requestAppointment(
				user._id,
				appointmentData
			);

			// Add new appointment to state
			setState((prev) => ({
				...prev,
				appointments: [response.data, ...prev.appointments],
			}));

			return true;
		});

		return success !== null;
	};

	const loadAppointments = async (): Promise<void> => {
		if (!user?._id) return;

		await withLoading(async () => {
			const appointments = await patientService.getUserAppointments(user._id);

			setState((prev) => ({
				...prev,
				appointments: appointments || [],
			}));

			return true;
		});
	};

	// Feedback operations
	const submitFeedback = async (
		feedbackData: FeedbackRequest
	): Promise<boolean> => {
		if (!user?._id) return false;

		// Validate feedback data
		const validationErrors = patientService.validateFeedbackData(feedbackData);
		if (validationErrors.length > 0) {
			setState((prev) => ({ ...prev, error: validationErrors[0] }));
			return false;
		}

		const success = await withLoading(async () => {
			await patientService.submitFeedback(user._id, feedbackData);
			return true;
		});

		return success !== null;
	};

	// Utility operations
	const clearError = () => {
		setState((prev) => ({ ...prev, error: null }));
	};

	const refreshData = async (): Promise<void> => {
		await Promise.allSettled([loadChatHistory(), loadAppointments()]);
	};

	// Auto-load data when user changes
	useEffect(() => {
		if (user?._id && user.account_type === 'patient') {
			refreshData();
		}
	}, [user?._id]);

	const value: PatientContextType = {
		...state,
		createNewChat,
		sendMessage,
		loadChatHistory,
		selectChat,
		requestAppointment,
		loadAppointments,
		submitFeedback,
		clearError,
		refreshData,
	};

	return (
		<PatientContext.Provider value={value}>{children}</PatientContext.Provider>
	);
}

export function usePatient() {
	const context = useContext(PatientContext);
	if (context === undefined) {
		throw new Error('usePatient must be used within a PatientProvider');
	}
	return context;
}
