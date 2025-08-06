import { ApiClient } from '@/lib/api';

// Types for Admin Dashboard
export interface Doctor {
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	specialization: string;
	license_number?: string;
	years_of_experience: number;
	hospital_affiliation?: string;
	account_type: 'doctor';
	created_at: string;
	status: 'active' | 'inactive' | 'suspended';
	total_appointments: number;
	rating: number;
	// Additional fields for creation/editing
	password?: string;
	gender?: string;
	address?: string;
	department_id?: string;
	qualification?: string;
	profile_image_url?: string;
}
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
	totalDepartments: number;
	totalAppointments: number;
	pendingAppointments: number;
	completedAppointments: number;
	cancelledAppointments: number;
	activeDoctors: number;
	suspendedDoctors: number;
	activePatients: number;
	suspendedPatients: number;
	recentPatients: number;
	recentDoctors: number;
	totalFeedback: number;
	negativeFeedback: number;
	positiveFeedback: number;
	neutralFeedback: number;
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

// Settings Types
export interface HospitalSettings {
	name: string;
	email: string;
	phone: string;
	address: string;
	website?: string;
	description?: string;
	established_year?: string;
	license_number?: string;
	accreditation?: string;
	logo_url?: string;
}

export interface SystemSettings {
	timezone: string;
	date_format: string;
	time_format: string;
	language: string;
	currency: string;
	maintenance_mode: boolean;
	allow_registration: boolean;
	require_email_verification: boolean;
	session_timeout: number;
	max_login_attempts: number;
}

export interface NotificationSettings {
	email_notifications: boolean;
	sms_notifications: boolean;
	push_notifications: boolean;
	appointment_reminders: boolean;
	system_alerts: boolean;
	maintenance_notifications: boolean;
	emergency_alerts: boolean;
	weekly_reports: boolean;
	monthly_reports: boolean;
}

export interface SecuritySettings {
	two_factor_auth: boolean;
	password_min_length: number;
	password_require_numbers: boolean;
	password_require_symbols: boolean;
	password_require_uppercase: boolean;
	password_expiry: number;
	login_audit_log: boolean;
	data_encryption: boolean;
	backup_frequency: string;
	backup_retention: number;
}

export interface AppearanceSettings {
	primary_color: string;
	secondary_color: string;
	theme: string;
	font_family: string;
	show_hospital_logo: boolean;
	show_welcome_message: boolean;
	enable_animations: boolean;
	compact_mode: boolean;
}

export interface AllAdminSettings {
	hospital: HospitalSettings;
	system: SystemSettings;
	notifications: NotificationSettings;
	security: SecuritySettings;
	appearance: AppearanceSettings;
}

class AdminService {
	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient();
	}

	// Dashboard Analytics
	async getDashboardStats(adminId: string): Promise<AdminDashboardStats> {
		try {
			console.log('Making dashboard stats request with adminId:', adminId);
			console.log('Full URL:', `/admin/${adminId}/dashboard-stats`);
			const response = await this.apiClient.get<AdminDashboardStats>(
				`/admin/${adminId}/dashboard-stats`
			);
			console.log('Dashboard stats response:', response);
			return response;
		} catch (error) {
			console.error('Error fetching dashboard stats:', error);
			console.error('Error details:', error);
			throw error;
		}
	}

	// Appointment Management
	async getAllAppointments(adminId: string): Promise<AdminAppointment[]> {
		try {
			const response = await this.apiClient.get<AdminAppointment[]>(
				`/admin/${adminId}/appointments`
			);
			return response;
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
			console.log('🚀 AdminService - getDoctors called with adminId:', adminId);
			console.log('📡 AdminService - Making API request to: /admin/doctors');
			const response = await this.apiClient.get<any[]>(`/admin/doctors`);
			console.log('📦 AdminService - Raw doctors response from backend:', response);
			const mappedDoctors = response.map(this.mapToDoctor);
			console.log('🔄 AdminService - Mapped doctors:', mappedDoctors);
			return mappedDoctors;
		} catch (error) {
			console.error('❌ AdminService - Error fetching doctors:', error);
			console.log('🔧 AdminService - Falling back to mock data');
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
				`/admin/create-doctor`,
				{
					fullName: `${doctorData.first_name} ${doctorData.last_name}`,
					email: doctorData.email,
					password: doctorData.password || 'DefaultPassword123',
					gender: doctorData.gender || 'male',
					phoneNumber: doctorData.phone_number,
					address: doctorData.address || '',
					specialty: doctorData.specialization,
					departmentId: doctorData.department_id,
					yearsOfExperience: doctorData.years_of_experience,
					qualification: doctorData.qualification || '',
					profileImageUrl: doctorData.profile_image_url
				}
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
			console.log('🔄 AdminService - updateDoctor called with:', {
				doctorId,
				updates,
				adminId
			});
			
			const updateData: any = {};
			
			// Map frontend fields to backend expected fields
			if (updates.first_name !== undefined) updateData.first_name = updates.first_name;
			if (updates.last_name !== undefined) updateData.last_name = updates.last_name;
			if (updates.email !== undefined) updateData.email = updates.email;
			if (updates.phone_number !== undefined) updateData.phone_number = updates.phone_number;
			if (updates.specialization !== undefined) updateData.specialty = updates.specialization;
			if (updates.department_id !== undefined) updateData.department_id = updates.department_id;
			if (updates.years_of_experience !== undefined) updateData.years_of_experience = updates.years_of_experience;
			if (updates.qualification !== undefined) updateData.qualification = updates.qualification;
			if (updates.gender !== undefined) updateData.gender = updates.gender;
			if (updates.address !== undefined) updateData.address = updates.address;
			
			console.log('📤 AdminService - Sending update data:', updateData);
			
			await this.apiClient.put(
				`/admin/${adminId}/doctors/${doctorId}`,
				updateData
			);
			
			console.log('✅ AdminService - Doctor updated successfully');
		} catch (error) {
			console.error('❌ AdminService - Error updating doctor:', error);
			throw error;
		}
	}

	async suspendDoctor(doctorId: string, adminId: string): Promise<void> {
		try {
			console.log('⏸️  AdminService - suspendDoctor called with:', {
				doctorId,
				adminId
			});
			
			await this.apiClient.put(
				`/admin/${adminId}/doctors/${doctorId}/suspend`,
				{}
			);
			
			console.log('✅ AdminService - Doctor suspended successfully');
		} catch (error) {
			console.error('❌ AdminService - Error suspending doctor:', error);
			throw error;
		}
	}

	async unsuspendDoctor(doctorId: string, adminId: string): Promise<void> {
		try {
			console.log('▶️  AdminService - unsuspendDoctor called with:', {
				doctorId,
				adminId
			});
			
			await this.apiClient.put(
				`/admin/${adminId}/doctors/${doctorId}/activate`,
				{}
			);
			
			console.log('✅ AdminService - Doctor unsuspended successfully');
		} catch (error) {
			console.error('❌ AdminService - Error unsuspending doctor:', error);
			throw error;
		}
	}

	// Patient Management
	async getPatients(adminId: string): Promise<Patient[]> {
		try {
			console.log('🚀 AdminService - getPatients called with adminId:', adminId);
			console.log('📡 AdminService - Making API request to: /admin/' + adminId + '/patients');
			const response = await this.apiClient.get<any[]>(
				`/admin/${adminId}/patients`
			);
			console.log('📦 AdminService - Raw patients response from backend:', response);
			const mappedPatients = response.map(this.mapToPatient);
			console.log('🔄 AdminService - Mapped patients:', mappedPatients);
			return mappedPatients;
		} catch (error) {
			console.error('❌ AdminService - Error fetching patients:', error);
			console.log('🔧 AdminService - Falling back to mock data');
			// Return mock data for development
			return this.getMockPatients();
		}
	}

	async updatePatient(
		patientId: string,
		updates: Partial<Patient>,
		adminId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/patients/${patientId}`,
				{
					first_name: updates.first_name,
					last_name: updates.last_name,
					email: updates.email,
					phone_number: updates.phone_number,
					language: updates.language,
					date_of_birth: (updates as any).date_of_birth,
					gender: (updates as any).gender,
					address: (updates as any).address
				}
			);
		} catch (error) {
			console.error('Error updating patient:', error);
			throw error;
		}
	}

	async deletePatient(patientId: string, adminId: string): Promise<void> {
		try {
			await this.apiClient.delete(`/admin/${adminId}/patients/${patientId}`);
		} catch (error) {
			console.error('Error deleting patient:', error);
			throw error;
		}
	}

	async suspendPatient(patientId: string, adminId: string): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/patients/${patientId}/suspend`,
				{}
			);
		} catch (error) {
			console.error('Error suspending patient:', error);
			throw error;
		}
	}

	async activatePatient(patientId: string, adminId: string): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/patients/${patientId}/activate`,
				{}
			);
		} catch (error) {
			console.error('Error activating patient:', error);
			throw error;
		}
	}

	async deleteDoctor(doctorId: string, adminId: string): Promise<void> {
		try {
			await this.apiClient.delete(`/admin/${adminId}/doctors/${doctorId}`);
		} catch (error) {
			console.error('Error deleting doctor:', error);
			throw error;
		}
	}

	// Department Management
	async getDepartments(): Promise<Array<{_id: string; name: string; description?: string}>> {
		try {
			console.log('🚀 AdminService - getDepartments called');
			console.log('📡 AdminService - Making API request to: /admin/departments');
			const response = await this.apiClient.get<Array<{_id: string; name: string; description?: string}>>(
				'/admin/departments'
			);
			console.log('📦 AdminService - Raw departments response from backend:', response);
			return response;
		} catch (error) {
			console.error('❌ AdminService - Error fetching departments:', error);
			console.log('🔧 AdminService - Returning empty array as fallback');
			return [];
		}
	}

	async createDepartment(data: {name: string; description?: string}): Promise<any> {
		try {
			const response = await this.apiClient.post('/admin/departments', data);
			return response;
		} catch (error) {
			console.error('Error creating department:', error);
			throw error;
		}
	}

	async updateDepartment(departmentId: string, data: {name: string; description?: string}): Promise<any> {
		try {
			const response = await this.apiClient.put(`/admin/departments/${departmentId}`, data);
			return response;
		} catch (error) {
			console.error('Error updating department:', error);
			throw error;
		}
	}

	async deleteDepartment(departmentId: string): Promise<void> {
		try {
			await this.apiClient.delete(`/admin/departments/${departmentId}`);
		} catch (error) {
			console.error('Error deleting department:', error);
			throw error;
		}
	}

	// Feedback Analytics
	async getFeedbackAnalytics(adminId?: string): Promise<any> {
		try {
			console.log('🚀 AdminService.getFeedbackAnalytics - Starting request...');
			const response = await this.apiClient.get('/admin/feedback-analytics') as any;
			console.log('✅ AdminService.getFeedbackAnalytics - Raw response:', response);
			return response;
		} catch (error) {
			console.error('❌ AdminService.getFeedbackAnalytics - Error:', error);
			return {
				overview: {
					total_feedback: 0,
					doctor_feedback_total: 0,
					general_feedback_total: 0,
					overall_sentiment: { positive: 0, negative: 0, neutral: 0 },
					recent_doctor_feedbacks: 0,
					recent_general_feedbacks: 0
				},
				doctor_analytics: {
					total: 0,
					average_rating: 0,
					sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
					rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
				},
				general_analytics: {
					total: 0,
					average_rating: 0,
					sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
					rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
					top_categories: []
				}
			};
		}
	}

	async getAllDoctorFeedbacks(): Promise<any[]> {
		try {
			console.log('🚀 AdminService.getAllDoctorFeedbacks - Starting request...');
			console.log('📡 AdminService - API Base URL:', this.apiClient);
			const response = await this.apiClient.get('/admin/doctor-feedbacks') as { feedbacks: any[] };
			console.log('✅ AdminService.getAllDoctorFeedbacks - Raw response:', response);
			console.log('📦 AdminService.getAllDoctorFeedbacks - Feedbacks array:', response.feedbacks);
			console.log('📊 AdminService.getAllDoctorFeedbacks - Number of feedbacks:', response.feedbacks?.length || 0);
			return response.feedbacks || [];
		} catch (error) {
			console.error('❌ AdminService.getAllDoctorFeedbacks - Error:', error);
			return [];
		}
	}

	async getGeneralFeedbacks(): Promise<any[]> {
		try {
			const response = await this.apiClient.get('/admin/general-feedbacks') as { feedbacks: any[] };
			return response.feedbacks || [];
		} catch (error) {
			console.error('Error fetching general feedbacks:', error);
			return [];
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

	// Settings Management
	async getHospitalSettings(adminId: string): Promise<HospitalSettings> {
		try {
			const response = await this.apiClient.get<HospitalSettings>(
				`/admin/${adminId}/settings/hospital`
			);
			return response;
		} catch (error) {
			console.error('Error fetching hospital settings:', error);
			throw error;
		}
	}

	async updateHospitalSettings(adminId: string, settings: HospitalSettings): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/settings/hospital`,
				settings
			);
		} catch (error) {
			console.error('Error updating hospital settings:', error);
			throw error;
		}
	}

	async getSystemSettings(adminId: string): Promise<SystemSettings> {
		try {
			const response = await this.apiClient.get<SystemSettings>(
				`/admin/${adminId}/settings/system`
			);
			return response;
		} catch (error) {
			console.error('Error fetching system settings:', error);
			throw error;
		}
	}

	async updateSystemSettings(adminId: string, settings: SystemSettings): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/settings/system`,
				settings
			);
		} catch (error) {
			console.error('Error updating system settings:', error);
			throw error;
		}
	}

	async getNotificationSettings(adminId: string): Promise<NotificationSettings> {
		try {
			const response = await this.apiClient.get<NotificationSettings>(
				`/admin/${adminId}/settings/notifications`
			);
			return response;
		} catch (error) {
			console.error('Error fetching notification settings:', error);
			throw error;
		}
	}

	async updateNotificationSettings(adminId: string, settings: NotificationSettings): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/settings/notifications`,
				settings
			);
		} catch (error) {
			console.error('Error updating notification settings:', error);
			throw error;
		}
	}

	async getSecuritySettings(adminId: string): Promise<SecuritySettings> {
		try {
			const response = await this.apiClient.get<SecuritySettings>(
				`/admin/${adminId}/settings/security`
			);
			return response;
		} catch (error) {
			console.error('Error fetching security settings:', error);
			throw error;
		}
	}

	async updateSecuritySettings(adminId: string, settings: SecuritySettings): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/settings/security`,
				settings
			);
		} catch (error) {
			console.error('Error updating security settings:', error);
			throw error;
		}
	}

	async getAppearanceSettings(adminId: string): Promise<AppearanceSettings> {
		try {
			const response = await this.apiClient.get<AppearanceSettings>(
				`/admin/${adminId}/settings/appearance`
			);
			return response;
		} catch (error) {
			console.error('Error fetching appearance settings:', error);
			throw error;
		}
	}

	async updateAppearanceSettings(adminId: string, settings: AppearanceSettings): Promise<void> {
		try {
			await this.apiClient.put(
				`/admin/${adminId}/settings/appearance`,
				settings
			);
		} catch (error) {
			console.error('Error updating appearance settings:', error);
			throw error;
		}
	}

	async getAllSettings(adminId: string): Promise<AllAdminSettings> {
		try {
			const response = await this.apiClient.get<AllAdminSettings>(
				`/admin/${adminId}/settings/all`
			);
			return response;
		} catch (error) {
			console.error('Error fetching all settings:', error);
			throw error;
		}
	}

	async uploadHospitalLogo(adminId: string, file: File): Promise<{logo_url: string}> {
		try {
			const formData = new FormData();
			formData.append('file', file);
			
			const response = await this.apiClient.postFile<{logo_url: string}>(
				`/admin/${adminId}/settings/upload-logo`,
				formData
			);
			return response;
		} catch (error) {
			console.error('Error uploading hospital logo:', error);
			throw error;
		}
	}

	// Helper methods for data transformation
	private mapToDoctor(data: any): Doctor {
		return {
			_id: data.user_id || data._id || data.id,
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
			status: data.is_active ? 'active' : 'inactive',
			total_appointments: data.total_appointments || 0,
			rating: data.rating || 0,
			// Additional fields from backend
			gender: data.gender,
			address: data.address,
			department_id: data.department_id,
			qualification: data.qualification,
			profile_image_url: data.profile_image_url,
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

	// New methods for dashboard widgets
	async getRecentAppointments(): Promise<any[]> {
		try {
			const response = await this.apiClient.get('/admin/dashboard/recent-appointments') as { appointments: any[] };
			return response.appointments || [];
		} catch (error) {
			console.error('Error fetching recent appointments:', error);
			return [];
		}
	}

	async getRecentFeedbackWithAnalysis(): Promise<{
		feedback: any[];
		sentiment_analysis: {
			total_feedback: number;
			positive_count: number;
			negative_count: number;
			positive_percentage: number;
			negative_percentage: number;
		};
	}> {
		try {
			const response = await this.apiClient.get('/admin/dashboard/recent-feedback') as {
				feedback: any[];
				sentiment_analysis: {
					total_feedback: number;
					positive_count: number;
					negative_count: number;
					positive_percentage: number;
					negative_percentage: number;
				};
			};
			return {
				feedback: response.feedback || [],
				sentiment_analysis: response.sentiment_analysis || {
					total_feedback: 0,
					positive_count: 0,
					negative_count: 0,
					positive_percentage: 0,
					negative_percentage: 0
				}
			};
		} catch (error) {
			console.error('Error fetching recent feedback:', error);
			return {
				feedback: [],
				sentiment_analysis: {
					total_feedback: 0,
					positive_count: 0,
					negative_count: 0,
					positive_percentage: 0,
					negative_percentage: 0
				}
			};
		}
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
