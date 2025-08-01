import { ApiClient } from '@/lib/api';

// Types for Doctor functionality
export interface DoctorProfile {
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
	token: string;
}

export interface PatientRecord {
	id: string;
	name: string;
	age: number;
	gender: string;
	phone: string;
	email: string;
	address: string;
	bloodType: string;
	allergies: string[];
	conditions: string[];
	lastVisit: string;
	nextAppointment?: string;
	status: 'active' | 'inactive' | 'critical' | 'stable';
	avatar?: string;
	vitals?: {
		heartRate: string;
		bloodPressure: string;
		temperature: string;
		weight: string;
		height: string;
	};
	medications?: Array<{
		name: string;
		dosage: string;
		frequency: string;
	}>;
	notes?: string;
}

export interface Appointment {
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
}

export interface MedicalRecord {
	id: string;
	patientName: string;
	patientId: string;
	recordType: string;
	title: string;
	date: string;
	status: 'completed' | 'pending' | 'in-progress';
	priority: 'low' | 'normal' | 'high' | 'critical';
	category:
		| 'laboratory'
		| 'imaging'
		| 'consultation'
		| 'prescription'
		| 'diagnosis';
	description: string;
	results?: Record<string, any>;
	attachments?: Array<{
		name: string;
		type: string;
		url: string;
		size: string;
	}>;
	notes?: string;
}

export interface Notification {
	id: string;
	type: 'appointment' | 'message' | 'alert' | 'reminder';
	priority: 'low' | 'normal' | 'high' | 'critical';
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
	category: string;
	patientName?: string;
	patientId?: string;
	actionRequired?: boolean;
}

export interface DashboardStats {
	totalAppointments: number;
	completedAppointments: number;
	ongoingAppointments: number;
	upcomingAppointments: number;
	totalPatients: number;
	criticalPatients: number;
	pendingActions: number;
	monthlyAppointments: Array<{
		month: string;
		appointments: number;
	}>;
}

class DoctorService {
	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient();
	}

	// Dashboard Analytics
	async getDashboardStats(doctorId: string): Promise<DashboardStats> {
		try {
			// Since the backend doesn't have specific doctor dashboard endpoints yet,
			// we'll aggregate data from existing appointments endpoint
			const appointments = await this.getAppointments(doctorId);

			const stats: DashboardStats = {
				totalAppointments: appointments.length,
				completedAppointments: appointments.filter(
					(apt) => apt.status === 'completed'
				).length,
				ongoingAppointments: appointments.filter(
					(apt) => apt.status === 'scheduled'
				).length,
				upcomingAppointments: appointments.filter(
					(apt) => apt.status === 'pending'
				).length,
				totalPatients: 0, // Will be calculated from patient data
				criticalPatients: 0, // Will be calculated from patient data
				pendingActions: appointments.filter((apt) => apt.status === 'pending')
					.length,
				monthlyAppointments: [], // Will be calculated from appointments data
			};

			return stats;
		} catch (error) {
			console.error('Error fetching dashboard stats:', error);
			throw error;
		}
	}

	// Appointment Management
	async getAppointments(doctorId: string): Promise<Appointment[]> {
		try {
			// Note: Backend currently has patient appointment endpoint,
			// we'll need to adapt this or create doctor-specific endpoint
			const response = await this.apiClient.get<Appointment[]>(
				`/appointment/${doctorId}`
			);
			return response;
		} catch (error) {
			console.error('Error fetching appointments:', error);
			throw error;
		}
	}

	async updateAppointmentStatus(
		appointmentId: string,
		status: string,
		doctorId: string
	): Promise<void> {
		try {
			// This would need a new backend endpoint for doctors to update appointment status
			await this.apiClient.post(
				`/doctor/${doctorId}/appointment/${appointmentId}/status`,
				{
					status,
				}
			);
		} catch (error) {
			console.error('Error updating appointment status:', error);
			throw error;
		}
	}

	async acceptAppointment(
		appointmentId: string,
		doctorId: string
	): Promise<void> {
		try {
			// Using existing admin accept endpoint - might need modification for doctors
			await this.apiClient.post(
				`/admin/accept_appointment/${doctorId}/${appointmentId}`,
				{}
			);
		} catch (error) {
			console.error('Error accepting appointment:', error);
			throw error;
		}
	}

	// Patient Management (Read-only for now)
	async getPatients(doctorId: string): Promise<PatientRecord[]> {
		try {
			// This would need a new backend endpoint to get patients assigned to a doctor
			// For now, return mock data structure
			const response = await this.apiClient.get<any[]>(
				`/doctor/${doctorId}/patients`
			);
			return response.map(this.mapToPatientRecord);
		} catch (error) {
			console.error('Error fetching patients:', error);
			// Return mock data for development
			return this.getMockPatients();
		}
	}

	async getPatientDetails(
		patientId: string,
		doctorId: string
	): Promise<PatientRecord> {
		try {
			const response = await this.apiClient.get<any>(
				`/doctor/${doctorId}/patient/${patientId}`
			);
			return this.mapToPatientRecord(response);
		} catch (error) {
			console.error('Error fetching patient details:', error);
			throw error;
		}
	}

	async updatePatientNotes(
		patientId: string,
		notes: string,
		doctorId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/doctor/${doctorId}/patient/${patientId}/notes`,
				{
					notes,
				}
			);
		} catch (error) {
			console.error('Error updating patient notes:', error);
			throw error;
		}
	}

	// Medical Records Management
	async getMedicalRecords(
		doctorId: string,
		filters?: { patientId?: string; type?: string }
	): Promise<MedicalRecord[]> {
		try {
			const queryParams = new URLSearchParams();
			if (filters?.patientId)
				queryParams.append('patient_id', filters.patientId);
			if (filters?.type) queryParams.append('type', filters.type);

			const response = await this.apiClient.get<any[]>(
				`/doctor/${doctorId}/records?${queryParams}`
			);
			return response.map(this.mapToMedicalRecord);
		} catch (error) {
			console.error('Error fetching medical records:', error);
			// Return mock data for development
			return this.getMockMedicalRecords();
		}
	}

	async createMedicalRecord(
		record: Partial<MedicalRecord>,
		doctorId: string
	): Promise<MedicalRecord> {
		try {
			const response = await this.apiClient.post<any>(
				`/doctor/${doctorId}/records`,
				record
			);
			return this.mapToMedicalRecord(response);
		} catch (error) {
			console.error('Error creating medical record:', error);
			throw error;
		}
	}

	async updateMedicalRecord(
		recordId: string,
		updates: Partial<MedicalRecord>,
		doctorId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/doctor/${doctorId}/records/${recordId}`,
				updates
			);
		} catch (error) {
			console.error('Error updating medical record:', error);
			throw error;
		}
	}

	// Notifications
	async getNotifications(doctorId: string): Promise<Notification[]> {
		try {
			const response = await this.apiClient.get<any[]>(
				`/doctor/${doctorId}/notifications`
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
		doctorId: string
	): Promise<void> {
		try {
			await this.apiClient.put(
				`/doctor/${doctorId}/notifications/${notificationId}/read`,
				{}
			);
		} catch (error) {
			console.error('Error marking notification as read:', error);
			throw error;
		}
	}

	async markAllNotificationsAsRead(doctorId: string): Promise<void> {
		try {
			await this.apiClient.put(
				`/doctor/${doctorId}/notifications/read-all`,
				{}
			);
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
			throw error;
		}
	}

	// Helper methods for data mapping
	private mapToPatientRecord(data: any): PatientRecord {
		return {
			id: data._id || data.id,
			name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
			age: data.age || 0,
			gender: data.gender || 'Unknown',
			phone: data.phone_number || data.phone || '',
			email: data.email || '',
			address: data.address || '',
			bloodType: data.blood_type || data.bloodType || 'Unknown',
			allergies: Array.isArray(data.allergies) ? data.allergies : [],
			conditions: Array.isArray(data.conditions) ? data.conditions : [],
			lastVisit: data.last_visit || data.lastVisit || '',
			nextAppointment: data.next_appointment || data.nextAppointment,
			status: data.status || 'active',
			avatar: data.avatar,
			vitals: data.vitals,
			medications: data.medications,
			notes: data.notes,
		};
	}

	private mapToMedicalRecord(data: any): MedicalRecord {
		return {
			id: data._id || data.id,
			patientName: data.patient_name || data.patientName,
			patientId: data.patient_id || data.patientId,
			recordType: data.record_type || data.recordType,
			title: data.title,
			date: data.date,
			status: data.status || 'pending',
			priority: data.priority || 'normal',
			category: data.category || 'consultation',
			description: data.description,
			results: data.results,
			attachments: data.attachments,
			notes: data.notes,
		};
	}

	private mapToNotification(data: any): Notification {
		return {
			id: data._id || data.id,
			type: data.type,
			priority: data.priority || 'normal',
			title: data.title,
			message: data.message,
			timestamp: data.timestamp || data.created_at,
			read: data.read || false,
			category: data.category,
			patientName: data.patient_name || data.patientName,
			patientId: data.patient_id || data.patientId,
			actionRequired: data.action_required || data.actionRequired,
		};
	}

	// Mock data methods (for development until backend endpoints are ready)
	private getMockPatients(): PatientRecord[] {
		return [
			{
				id: '1',
				name: 'John Doe',
				age: 45,
				gender: 'Male',
				phone: '+1 (555) 123-4567',
				email: 'john.doe@email.com',
				address: '123 Main St, City, State 12345',
				bloodType: 'O+',
				allergies: ['Penicillin', 'Shellfish'],
				conditions: ['Hypertension', 'Diabetes Type 2'],
				lastVisit: '2025-01-27',
				nextAppointment: '2025-01-30',
				status: 'active',
				vitals: {
					heartRate: '72 bpm',
					bloodPressure: '130/85 mmHg',
					temperature: '98.6°F',
					weight: '185 lbs',
					height: '5\'10"',
				},
				medications: [
					{ name: 'Lisinopril', dosage: '10mg daily', frequency: 'Once daily' },
					{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
				],
				notes:
					'Patient has been compliant with medication. Blood pressure improving.',
			},
		];
	}

	private getMockMedicalRecords(): MedicalRecord[] {
		return [
			{
				id: '1',
				patientName: 'John Doe',
				patientId: 'P001',
				recordType: 'Lab Results',
				title: 'Complete Blood Count & Lipid Panel',
				date: '2025-01-27',
				status: 'completed',
				priority: 'normal',
				category: 'laboratory',
				description:
					'Routine blood work including CBC, lipid panel, and glucose levels',
				results: {
					hemoglobin: '14.2 g/dL (Normal)',
					whiteBloodCells: '6,800/μL (Normal)',
					platelets: '285,000/μL (Normal)',
					glucose: '98 mg/dL (Normal)',
					cholesterol: '195 mg/dL (Borderline)',
				},
			},
		];
	}

	private getMockNotifications(): Notification[] {
		return [
			{
				id: '1',
				type: 'appointment',
				priority: 'high',
				title: 'Urgent: Patient Emergency',
				message:
					'John Doe (P001) has been admitted to the ER with chest pain. Immediate attention required.',
				timestamp: '5 minutes ago',
				read: false,
				category: 'emergency',
				patientName: 'John Doe',
				patientId: 'P001',
				actionRequired: true,
			},
		];
	}
}

export const doctorService = new DoctorService();
