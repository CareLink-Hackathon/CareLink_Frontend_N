import { apiClient } from '../api';
import {
	Chat,
	NewChatRequest,
	ChatMessageRequest,
	AppointmentRequest,
	Appointment,
	FeedbackRequest,
	User,
} from '../types';

// Patient-specific service class for all backend interactions
export class PatientService {
	private static instance: PatientService;

	static getInstance(): PatientService {
		if (!PatientService.instance) {
			PatientService.instance = new PatientService();
		}
		return PatientService.instance;
	}

	// Chat Operations
	async createNewChat(userId: string, chatName: string) {
		const data: NewChatRequest = { chat_name: chatName };
		return await apiClient.post<{ chat_id: string; chat_name: string }>(
			`/new_chat/${userId}`,
			data
		);
	}

	async sendChatMessage(userId: string, chatId: string, message: string) {
		const data: ChatMessageRequest = { message };
		return await apiClient.post<{
			response: string;
			chat_name: string;
			chat_id: string;
		}>(`/patient/${userId}/chat/${chatId}`, data);
	}

	async getChatHistory(userId: string) {
		return await apiClient.get<User>(`/chats/${userId}`);
	}

	// Appointment Operations
	async requestAppointment(
		userId: string,
		appointmentData: AppointmentRequest
	) {
		return await apiClient.post<{
			status: string;
			message: string;
			data: Appointment;
		}>(`/patient/appointment/${userId}`, appointmentData);
	}

	async getUserAppointments(userId: string) {
		return await apiClient.get<Appointment[]>(`/appointment/${userId}`);
	}

	// Feedback Operations
	async submitFeedback(userId: string, feedbackData: FeedbackRequest) {
		return await apiClient.post<{ message: string }>(
			`/feedback/${userId}`,
			feedbackData
		);
	}

	async getAllFeedbacks() {
		return await apiClient.get<any[]>('/feedback/');
	}

	// Utility Methods
	formatAppointmentStatus(status: string): string {
		const statusMap: Record<string, string> = {
			pending: 'Pending Review',
			scheduled: 'Scheduled',
			completed: 'Completed',
			cancelled: 'Cancelled',
		};
		return statusMap[status] || status;
	}

	formatAppointmentType(type: string): string {
		const typeMap: Record<string, string> = {
			checkup: 'General Checkup',
			consultation: 'Consultation',
			followup: 'Follow-up',
			emergency: 'Emergency',
			specialist: 'Specialist Visit',
		};
		return typeMap[type] || type;
	}

	getStatusColor(status: string): string {
		const colorMap: Record<string, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			scheduled: 'bg-blue-100 text-blue-800',
			completed: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
		};
		return colorMap[status] || 'bg-gray-100 text-gray-800';
	}

	// Chat helper methods
	generateChatId(): string {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	}

	generateDefaultChatName(firstMessage: string): string {
		// Extract first few words for chat name
		const words = firstMessage.trim().split(' ').slice(0, 4);
		return words.join(' ') + (firstMessage.length > 30 ? '...' : '');
	}

	// Date formatting helpers
	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	formatTime(timeString: string): string {
		// Convert 24-hour to 12-hour format
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${minutes} ${ampm}`;
	}

	formatDateTime(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	// Validation helpers
	validateAppointmentData(data: Partial<AppointmentRequest>): string[] {
		const errors: string[] = [];

		if (!data.type) errors.push('Appointment type is required');
		if (!data.doctor) errors.push('Doctor selection is required');
		if (!data.date) errors.push('Date is required');
		if (!data.time) errors.push('Time is required');
		// reason_for_visit is optional, so we don't validate it as required

		// Validate date is in the future
		if (data.date) {
			const selectedDate = new Date(data.date);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (selectedDate < today) {
				errors.push('Appointment date must be in the future');
			}
		}

		return errors;
	}

	validateFeedbackData(data: Partial<FeedbackRequest>): string[] {
		const errors: string[] = [];

		if (!data.message || data.message.trim().length === 0) {
			errors.push('Feedback message is required');
		}

		if (data.message && data.message.trim().length < 10) {
			errors.push('Feedback message must be at least 10 characters long');
		}

		if (data.ratings && (data.ratings < 1 || data.ratings > 5)) {
			errors.push('Rating must be between 1 and 5');
		}

		return errors;
	}

	// Error handling helpers
	parseApiError(error: any): string {
		console.log('Full error object:', error);
		console.log('Error data:', error.data);
		console.log('Error message:', error.message);

		// Handle ApiError instances from our custom ApiClient
		if (error.data?.detail) {
			const detail = error.data.detail;
			if (Array.isArray(detail)) {
				return detail
					.map((d: any) => d.msg || d.message || JSON.stringify(d))
					.join(', ');
			}
			return typeof detail === 'string' ? detail : JSON.stringify(detail);
		}

		// Handle other error formats
		if (error.response?.data?.detail) {
			return error.response.data.detail;
		}

		if (error.message && error.message !== '[object Object]') {
			return error.message;
		}

		// Fallback for unknown error structures
		console.error('Unhandled error structure:', error);
		return `Server error (${error.status || 'unknown'}): ${JSON.stringify(
			error.data || {}
		)}`;
	}

	// Local storage helpers for offline functionality
	saveChatLocally(userId: string, chatId: string, message: any) {
		const key = `chat_${userId}_${chatId}`;
		const existing = localStorage.getItem(key);
		const messages = existing ? JSON.parse(existing) : [];
		messages.push({
			...message,
			timestamp: new Date().toISOString(),
			synced: false,
		});
		localStorage.setItem(key, JSON.stringify(messages));
	}

	getLocalChats(userId: string): any[] {
		const chats: any[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`chat_${userId}_`)) {
				const chatId = key.split('_')[2];
				const messages = JSON.parse(localStorage.getItem(key) || '[]');
				chats.push({ chatId, messages });
			}
		}
		return chats;
	}

	clearLocalChats(userId: string) {
		const keysToRemove: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`chat_${userId}_`)) {
				keysToRemove.push(key);
			}
		}
		keysToRemove.forEach((key) => localStorage.removeItem(key));
	}
}

// Export singleton instance
export const patientService = PatientService.getInstance();
