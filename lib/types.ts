// Authentication types and interfaces

export interface User {
	_id: string;
	account_type: 'patient' | 'doctor' | 'hospital';
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	language?: string;
	specialty?: string; // for doctors
	hospital_name?: string; // for hospitals/admins
	isAdmin?: number; // for hospitals
	token: string;
	created_at: string;
	updated_at: string;
	chatHistory?: any[]; // for patients
}

export interface SignupRequest {
	account_type: 'patient' | 'doctor' | 'hospital';
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	password: string;
	language?: string;
	specialty?: string; // for doctors
	hospital_name?: string; // for hospitals
}

export interface LoginRequest {
	account_type: 'patient' | 'doctor' | 'hospital';
	credential: string; // email or phone
	password: string;
}

export interface AuthResponse {
	user: User;
	success: boolean;
	message?: string;
}

// Chat types
export interface ChatMessage {
	user_message: string;
	bot_response: string;
	timestamp: string;
}

export interface Chat {
	chat_id: string;
	chat_name: string;
	messages: ChatMessage[];
	created_at: string;
	updated_at: string;
}

export interface NewChatRequest {
	chat_name: string;
}

export interface ChatMessageRequest {
	message: string;
}

// Appointment types
export interface AppointmentRequest {
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit: string;
}

export interface Appointment {
	_id: string;
	user_id: string;
	user_email: string;
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit: string;
	status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
}

// Feedback types
export interface FeedbackRequest {
	message: string;
	rating?: number;
	category?: string;
}

export interface Feedback {
	_id: string;
	user_id: string;
	message: string;
	rating?: number;
	category?: string;
	sentiment?: string;
	created_at: string;
}

// API Response wrapper
export interface ApiResponse<T> {
	status: string;
	message?: string;
	data?: T;
}
