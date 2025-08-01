import { ApiClient } from '@/lib/api';

// Types for Admin functionality
export interface AdminProfile {
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	hospital_name: string;
	account_type: 'hospital';
	isAdmin: number;
	created_at: string;
	token: string;
}

export interface AdminDashboardStats {
	totalPatients: number;
	totalDoctors: number;
	totalAppointments: number;
	pendingAppointments: number;
	completedAppointments: number;
	totalFeedback: number;
	negativeFeedback: number;
	monthlyAppointments: Array<{
		month: string;
		count: number;
	}>;
	feedbackCategories: Array<{
		category: string;
		count: number;
		percentage: number;
		trend: 'up' | 'down' | 'stable';
	}>;
}

export interface AdminAppointment {
	_id: string;
	user_id: string;
	user_email: string;
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit?: string;
	status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
	patient_name?: string;
	patient_phone?: string;
	doctor_name?: string;
	specialty?: string;
}

export interface Doctor {
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	specialization?: string;
	license_number?: string;
	years_of_experience?: number;
	hospital_affiliation?: string;
	account_type: 'doctor';
	created_at: string;
	status: 'active' | 'inactive' | 'suspended';
	total_appointments?: number;
	rating?: number;
}

export interface Patient {
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	language: string;
	account_type: 'patient';
	created_at: string;
	last_visit?: string;
	total_appointments?: number;
	status: 'active' | 'inactive';
}

export interface FeedbackItem {
	_id: string;
	user_id: string;
	category: string;
	sentiment: 'positive' | 'negative' | 'neutral';
	confidence: number;
	message: string;
	created_at: string;
	user_email?: string;
	rating?: number;
	status: 'new' | 'reviewed' | 'resolved';
}

export interface FeedbackAnalytics {
	top_5_categories: Array<[string, number]>;
	feedbacks: FeedbackItem[];
	totalFeedback: number;
	sentimentDistribution: {
		positive: number;
		negative: number;
		neutral: number;
	};
	categoryBreakdown: Array<{
		category: string;
		count: number;
		percentage: number;
		trend: 'up' | 'down' | 'stable';
	}>;
}

export interface SystemNotification {
	id: string;
	type: 'appointment' | 'feedback' | 'system' | 'alert';
	priority: 'low' | 'normal' | 'high' | 'critical';
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
	category: string;
	actionRequired?: boolean;
	relatedId?: string;
}

class AdminService {
	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient();
	}

	// Dashboard Analytics
	async getDashboardStats(adminId: string): Promise<AdminDashboardStats> {
		try {
			// Get feedback analytics (only available endpoint)
			const feedback = await this.getFeedbackAnalytics(adminId);

			// For now, we'll use mock data for missing endpoints
			// These would need to be implemented in the backend
			const mockStats: AdminDashboardStats = {
				totalPatients: 0,
				totalDoctors: 0,
				totalAppointments: 0,
				pendingAppointments: 0,
				completedAppointments: 0,
				totalFeedback: feedback.totalFeedback || 0,
				negativeFeedback: feedback.feedbacks.filter(
					(f) => f.sentiment === 'negative'
				).length,
				monthlyAppointments: [],
				feedbackCategories: feedback.categoryBreakdown || [],
			};

			return mockStats;
		} catch (error) {
			console.error('Error fetching dashboard stats:', error);
			throw error;
		}
	}

	// Appointment Management
	async getAllAppointments(adminId: string): Promise<AdminAppointment[]> {
		try {
			// Backend doesn't have admin-specific appointment endpoint yet
			// Return empty array for now - this endpoint needs to be created
			console.warn('Admin appointments endpoint not implemented in backend');
			return [];
		} catch (error) {
			console.error('Error fetching appointments:', error);
			return [];
		}
	}

	async acceptAppointment(
		appointmentId: string,
		adminId: string
	): Promise<void> {
		try {
			// Using existing endpoint
			await this.apiClient.post(
				`/admin/accept_appointment/${adminId}/${appointmentId}`,
				{}
			);
		} catch (error) {
			console.error('Error accepting appointment:', error);
			throw error;
		}
	}

	async assignDoctorToAppointment(
		appointmentId: string,
		doctorId: string,
		adminId: string
	): Promise<void> {
		try {
			// This would need a new backend endpoint
			await this.apiClient.put(
				`/admin/${adminId}/appointments/${appointmentId}/assign`,
				{
					doctor_id: doctorId,
				}
			);
		} catch (error) {
			console.error('Error assigning doctor:', error);
			throw error;
		}
	}

	async updateAppointmentStatus(
		appointmentId: string,
		status: string,
		adminId: string
	): Promise<void> {
		try {
			// This would need a new backend endpoint
			await this.apiClient.put(
				`/admin/${adminId}/appointments/${appointmentId}/status`,
				{
					status,
				}
			);
		} catch (error) {
			console.error('Error updating appointment status:', error);
			throw error;
		}
	}

	// Doctor Management
	async getDoctors(adminId: string): Promise<Doctor[]> {
		try {
			// This would need a new backend endpoint: GET /admin/{admin_id}/doctors
			const response = await this.apiClient.get<any[]>(
				`/admin/${adminId}/doctors`
			);
			return response.map(this.mapToDoctor);
		} catch (error) {
			console.error('Error fetching doctors:', error);
			// Return mock data for development
			return this.getMockDoctors();
		}
	}

	async createDoctor(
		doctorData: Partial<Doctor>,
		adminId: string
	): Promise<Doctor> {
		try {
			const response = await this.apiClient.post<any>(
				`/admin/${adminId}/doctors`,
				doctorData
			);
			return this.mapToDoctor(response);
		} catch (error) {
			console.error('Error creating doctor:', error);
			throw error;
		}
	}

	async updateDoctor(
		doctorId: string,
		updates: Partial<Doctor>,
		adminId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/doctors/${doctorId}`,
				updates
			);
		} catch (error) {
			console.error('Error updating doctor:', error);
			throw error;
		}
	}

	async suspendDoctor(doctorId: string, adminId: string): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/doctors/${doctorId}/suspend`,
				{}
			);
		} catch (error) {
			console.error('Error suspending doctor:', error);
			throw error;
		}
	}

	// Patient Management
	async getPatients(adminId: string): Promise<Patient[]> {
		try {
			// This would need a new backend endpoint: GET /admin/{admin_id}/patients
			const response = await this.apiClient.get<any[]>(
				`/admin/${adminId}/patients`
			);
			return response.map(this.mapToPatient);
		} catch (error) {
			console.error('Error fetching patients:', error);
			// Return mock data for development
			return this.getMockPatients();
		}
	}

	// Feedback Analytics
	async getFeedbackAnalytics(adminId: string): Promise<FeedbackAnalytics> {
		try {
			// Using existing endpoint
			const response = await this.apiClient.get<{
				top_5_categories: Array<[string, number]>;
				feedbacks: any[];
			}>('/feedback/');

			// Calculate additional analytics
			const totalFeedback = response.feedbacks.length;
			const sentimentDistribution = this.calculateSentimentDistribution(
				response.feedbacks
			);
			const categoryBreakdown = this.calculateCategoryBreakdown(
				response.top_5_categories,
				totalFeedback
			);

			return {
				top_5_categories: response.top_5_categories,
				feedbacks: response.feedbacks.map(this.mapToFeedback),
				totalFeedback,
				sentimentDistribution,
				categoryBreakdown,
			};
		} catch (error) {
			console.error('Error fetching feedback analytics:', error);
			throw error;
		}
	}

	async updateFeedbackStatus(
		feedbackId: string,
		status: string,
		adminId: string
	): Promise<void> {
		try {
			// This would need a new backend endpoint
			await this.apiClient.put(
				`/admin/${adminId}/feedback/${feedbackId}/status`,
				{
					status,
				}
			);
		} catch (error) {
			console.error('Error updating feedback status:', error);
			throw error;
		}
	}

	// System Notifications
	async getNotifications(adminId: string): Promise<SystemNotification[]> {
		try {
			// This would need a new backend endpoint
			const response = await this.apiClient.get<any[]>(
				`/admin/${adminId}/notifications`
			);
			return response.map(this.mapToNotification);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			// Return mock data for development
			return this.getMockNotifications();
		}
	}

	async markNotificationAsRead(
		notificationId: string,
		adminId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/notifications/${notificationId}/read`,
				{}
			);
		} catch (error) {
			console.error('Error marking notification as read:', error);
			throw error;
		}
	}

	// Helper methods for data transformation
	private mapToDoctor(data: any): Doctor {
		return {
			_id: data._id || data.id,
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			phone_number: data.phone_number,
			specialization: data.specialization || data.specialty,
			license_number: data.license_number,
			years_of_experience: data.years_of_experience,
			hospital_affiliation: data.hospital_affiliation || data.hospital_name,
			account_type: 'doctor',
			created_at: data.created_at,
			status: data.status || 'active',
			total_appointments: data.total_appointments || 0,
			rating: data.rating || 0,
		};
	}

	private mapToPatient(data: any): Patient {
		return {
			_id: data._id || data.id,
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			phone_number: data.phone_number,
			language: data.language || 'en',
			account_type: 'patient',
			created_at: data.created_at,
			last_visit: data.last_visit,
			total_appointments: data.total_appointments || 0,
			status: data.status || 'active',
		};
	}

	private mapToFeedback(data: any): FeedbackItem {
		return {
			_id: data._id || data.id,
			user_id: data.user_id,
			category: data.category,
			sentiment: data.sentiment,
			confidence: data.confidence || 0,
			message: data.message,
			created_at: data.created_at,
			user_email: data.user_email,
			rating: data.rating,
			status: data.status || 'new',
		};
	}

	private mapToNotification(data: any): SystemNotification {
		return {
			id: data._id || data.id,
			type: data.type,
			priority: data.priority || 'normal',
			title: data.title,
			message: data.message,
			timestamp: data.timestamp || data.created_at,
			read: data.read || false,
			category: data.category,
			actionRequired: data.action_required || data.actionRequired,
			relatedId: data.related_id || data.relatedId,
		};
	}

	// Calculation helpers
	private calculateMonthlyAppointments(
		appointments: AdminAppointment[]
	): Array<{ month: string; count: number }> {
		const monthlyData: Record<string, number> = {};

		appointments.forEach((appointment) => {
			const date = new Date(appointment.date);
			const monthKey = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, '0')}`;
			monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
		});

		return Object.entries(monthlyData).map(([month, count]) => ({
			month,
			count,
		}));
	}

	private calculateSentimentDistribution(feedbacks: any[]): {
		positive: number;
		negative: number;
		neutral: number;
	} {
		const distribution = {
			positive: 0,
			negative: 0,
			neutral: 0,
		};

		feedbacks.forEach((feedback) => {
			if (feedback.sentiment in distribution) {
				distribution[feedback.sentiment as keyof typeof distribution]++;
			}
		});

		return distribution;
	}

	private calculateCategoryBreakdown(
		topCategories: Array<[string, number]>,
		totalFeedback: number
	): Array<{
		category: string;
		count: number;
		percentage: number;
		trend: 'up' | 'down' | 'stable';
	}> {
		return topCategories.map(([category, count]) => ({
			category,
			count,
			percentage:
				totalFeedback > 0 ? Math.round((count / totalFeedback) * 100) : 0,
			trend: 'stable' as const, // Would need historical data for real trend calculation
		}));
	}

	// Mock data methods (for development)
	private getMockAppointments(): AdminAppointment[] {
		return [
			{
				_id: '1',
				user_id: 'patient1',
				user_email: 'john.doe@email.com',
				type: 'Check-up',
				doctor: 'Dr. Sarah Johnson',
				date: '2025-08-01',
				time: '10:00',
				reason_for_visit: 'Routine checkup',
				status: 'pending',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				patient_name: 'John Doe',
				doctor_name: 'Dr. Sarah Johnson',
				specialty: 'Cardiology',
			},
		];
	}

	private getMockDoctors(): Doctor[] {
		return [
			{
				_id: '1',
				first_name: 'Sarah',
				last_name: 'Johnson',
				email: 'sarah.johnson@hospital.com',
				phone_number: '+1234567890',
				specialization: 'Cardiology',
				license_number: 'MD123456',
				years_of_experience: 10,
				hospital_affiliation: 'Central Hospital',
				account_type: 'doctor',
				created_at: new Date().toISOString(),
				status: 'active',
				total_appointments: 150,
				rating: 4.8,
			},
		];
	}

	private getMockPatients(): Patient[] {
		return [
			{
				_id: '1',
				first_name: 'John',
				last_name: 'Doe',
				email: 'john.doe@email.com',
				phone_number: '+1234567890',
				language: 'en',
				account_type: 'patient',
				created_at: new Date().toISOString(),
				last_visit: '2025-07-15',
				total_appointments: 5,
				status: 'active',
			},
		];
	}

	private getMockNotifications(): SystemNotification[] {
		return [
			{
				id: '1',
				type: 'appointment',
				priority: 'high',
				title: 'Urgent Appointment Request',
				message: 'New urgent appointment request requires immediate attention',
				timestamp: new Date().toISOString(),
				read: false,
				category: 'appointments',
				actionRequired: true,
				relatedId: 'apt_001',
			},
		];
	}
}

export const adminService = new AdminService();
