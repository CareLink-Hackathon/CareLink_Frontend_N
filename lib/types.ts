// Authentication types and interfaces

// User types
export interface User {
	_id: string;
	account_type: 'patient' | 'doctor' | 'hospital';
	role?: 'patient' | 'doctor' | 'admin' | 'hospital';
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	language: string;
	token?: string; // JWT token for authentication
	user_id?: string; // Alternative user ID field
	redirect_path?: string; // Path to redirect after login
	isAdmin?: boolean;
	specialty?: string;
	hospital_name?: string;
	chats?: Chat[];
	created_at?: string;
	updated_at?: string;
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
	query: string;
	response: string;
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

export interface ChatResponse {
	response: string;
	chat_name: string;
	chat_id: string;
}

// Appointment types
export interface AppointmentRequest {
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit?: string; // Make optional to match backend
}

export interface Appointment {
	_id: string;
	user_id: string;
	user_email: string;
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit?: string; // Make optional to match backend
	status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
}

// Feedback types
export interface FeedbackRequest {
	message: string;
	ratings?: number;
	category?: string;
}

export interface FeedbackResponse {
	message: string;
}

export interface FeedbackAnalysis {
	user_id: string;
	category: string;
	sentiment: string;
	rating?: number;
	message: string;
	_id?: string;
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

// Blood Bank types
export interface DonorData {
	donor_id: string;
	age: number;
	sex: 'male' | 'female' | 'other';
	occupation: string;
	blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
	screening_result: 'passed' | 'failed';
	donation_date: string; // ISO date string
	expiry_date: string; // ISO date string
}

export interface ForecastRequest {
	start_date: string; // YYYY-MM-DD
	end_date?: string; // YYYY-MM-DD
	blood_type?: string; // Optional filter for specific blood type
}

export interface ForecastResponse {
	donation_date: string;
	blood_type: string;
	predicted_count: number;
}

export interface InventoryStatus {
	blood_type: string;
	current_stock: number;
	expiry_dates: Record<string, number>; // {expiry_date: quantity}
}

export interface OptimizationRequest {
	forecast_days?: number; // default 7
	safety_stock_days?: number; // default 3
	delivery_cycle_days?: number; // default 7
	wastage_rate?: number; // default 0.05 (5%)
	emergency_cost_multiplier?: number; // default 1.5
}

export interface OptimizationResult {
	blood_type: string;
	recommended_order: number;
	expected_shortage: number;
	expected_wastage: number;
	optimal_cost: number;
}
