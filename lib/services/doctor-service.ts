import { ApiClient, API_BASE_URL } from '@/lib/api';

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
	patient_name?: string;
	patient_phone?: string;
	patient_age?: number;
	patient_gender?: string;
	type: string;
	doctor: string;
	date: string;
	time: string;
	reason_for_visit?: string;
	status: 'pending' | 'approved' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
	doctor_notes?: string;
}

export interface VitalSigns {
	blood_pressure?: string;
	heart_rate?: string;
	temperature?: string;
	weight?: string;
	height?: string;
	respiratory_rate?: string;
	oxygen_saturation?: string;
}

export interface LabResult {
	test_name: string;
	result: string;
	reference_range?: string;
	status: 'normal' | 'abnormal' | 'critical';
}

export interface Medication {
	name: string;
	dosage: string;
	frequency: string;
	duration: string;
	instructions?: string;
}

export interface MedicalRecord {
	_id?: string;
	patient_id: string;
	doctor_id: string;
	appointment_id?: string;
	record_type: 'consultation' | 'diagnosis' | 'prescription' | 'laboratory' | 'imaging';
	title: string;
	chief_complaint: string;
	history_of_present_illness: string;
	physical_examination: string;
	diagnosis: string;
	treatment_plan: string;
	medications?: Medication[];
	follow_up_instructions: string;
	notes?: string;
	vital_signs?: VitalSigns;
	lab_results?: LabResult[];
	created_at?: string;
	updated_at?: string;
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
	// Additional stats for doctor dashboard
	todayAppointments?: number;
	thisWeekAppointments?: number;
	thisMonthAppointments?: number;
	pendingAppointments?: number;
	approvedAppointments?: number;
}

class DoctorService {
	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient();
	}

		// Dashboard Stats
	async getDashboardStats(doctorId: string): Promise<DashboardStats> {
		try {
			console.log('🚀 DoctorService - getDashboardStats called with doctorId:', doctorId);
			
			const response = await this.apiClient.get<any>(
				`/doctor/${doctorId}/dashboard-stats`
			);
			
			console.log('📊 DoctorService - Dashboard stats response:', response);
			
			// Transform backend response to match frontend interface
			const stats: DashboardStats = {
				totalAppointments: response.stats.total_appointments || 0,
				completedAppointments: response.stats.completed_appointments || 0,
				ongoingAppointments: response.stats.approved_appointments || 0,
				upcomingAppointments: response.stats.upcoming_appointments || 0,
				totalPatients: response.stats.recent_patients_count || 0,
				criticalPatients: 0, // This might need a separate endpoint
				pendingActions: response.stats.pending_appointments || 0,
				monthlyAppointments: [], // Could be enhanced with historical data
				todayAppointments: response.stats.today_appointments || 0,
				thisWeekAppointments: response.stats.this_week_appointments || 0,
				thisMonthAppointments: response.stats.this_month_appointments || 0,
				pendingAppointments: response.stats.pending_appointments || 0,
				approvedAppointments: response.stats.approved_appointments || 0
			};

			return stats;
		} catch (error) {
			console.error('❌ DoctorService - Error fetching dashboard stats:', error);
			throw error;
		}
	}

	// Appointment Management
	async getAppointments(doctorId: string): Promise<Appointment[]> {
		try {
			console.log('🚀 DoctorService - getAppointments called with doctorId:', doctorId);
			
			const response = await this.apiClient.get<any>(
				`/doctor/${doctorId}/appointments`
			);
			
			console.log('📅 DoctorService - Appointments response:', response);
			
			// Transform backend appointments to match frontend interface
			const appointments: Appointment[] = response.appointments.map((apt: any) => ({
				_id: apt._id,
				user_id: apt.patient_id,
				user_email: apt.patient_email,
				patient_name: apt.patient_name,
				patient_phone: apt.patient_phone,
				patient_age: apt.patient_age,
				patient_gender: apt.patient_gender,
				type: apt.type,
				doctor: apt.doctor_name,
				date: apt.date,
				time: apt.time,
				reason_for_visit: apt.reason_for_visit,
				status: apt.status as 'pending' | 'scheduled' | 'completed' | 'cancelled',
				created_at: apt.created_at,
				updated_at: apt.updated_at,
				doctor_notes: apt.doctor_notes
			}));
			
			return appointments;
		} catch (error) {
			console.error('❌ DoctorService - Error fetching appointments:', error);
			throw error;
		}
	}

	async getTodayAppointments(doctorId: string): Promise<Appointment[]> {
		try {
			console.log('🚀 DoctorService - getTodayAppointments called with doctorId:', doctorId);
			
			const response = await this.apiClient.get<any>(
				`/doctor/${doctorId}/appointments/today`
			);
			
			console.log('📅 DoctorService - Today appointments response:', response);
			
			// Transform backend appointments to match frontend interface
			const appointments: Appointment[] = response.appointments.map((apt: any) => ({
				_id: apt._id,
				user_id: apt.patient_id,
				user_email: apt.patient_email,
				patient_name: apt.patient_name,
				type: apt.type,
				doctor: response.doctor_name || '',
				date: response.date,
				time: apt.time,
				reason_for_visit: apt.reason_for_visit,
				status: apt.status as 'pending' | 'scheduled' | 'completed' | 'cancelled',
				created_at: apt.created_at || '',
				updated_at: apt.updated_at || '',
				doctor_notes: apt.doctor_notes
			}));
			
			return appointments;
		} catch (error) {
			console.error('❌ DoctorService - Error fetching today appointments:', error);
			throw error;
		}
	}

	async updateAppointmentStatus(
		appointmentId: string,
		status: string,
		doctorId: string,
		doctorNotes?: string
	): Promise<void> {
		try {
			console.log('🚀 DoctorService - updateAppointmentStatus called with:', {
				appointmentId,
				status,
				doctorId,
				doctorNotes
			});
			
			await this.apiClient.put(
				`/doctor/${doctorId}/appointments/${appointmentId}/status`,
				{
					status,
					doctor_notes: doctorNotes
				}
			);
			
			console.log('✅ DoctorService - Appointment status updated successfully');
		} catch (error) {
			console.error('❌ DoctorService - Error updating appointment status:', error);
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

			const response = await this.apiClient.get<MedicalRecord[]>(
				`/api/medical-records/doctor/${doctorId}?${queryParams}`
			);
			return response || [];
		} catch (error) {
			console.error('Error fetching medical records:', error);
			return [];
		}
	}

	async createMedicalRecord(
		record: Partial<MedicalRecord>
	): Promise<{ message: string; record_id: string }> {
		try {
			console.log('🏥 Creating medical record via API:', record);
			const response = await this.apiClient.post<{ message: string; record_id: string }>(
				`/api/medical-records`,
				record
			);
			console.log('✅ Medical record created successfully:', response);
			return response;
		} catch (error) {
			console.error('❌ Error creating medical record:', error);
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
				`/api/medical-records/${recordId}`,
				updates
			);
		} catch (error) {
			console.error('Error updating medical record:', error);
			throw error;
		}
	}

	async downloadMedicalRecordPDF(recordId: string): Promise<void> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/medical-records/${recordId}/pdf`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to download PDF');
			}

			// Get the filename from response headers or create a default one
			const contentDisposition = response.headers.get('content-disposition');
			let filename = 'medical_record.pdf';
			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
				if (filenameMatch) {
					filename = filenameMatch[1].replace(/['"]/g, '');
				}
			}

			// Convert response to blob and download
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading medical record PDF:', error);
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
			return [];
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

	// Doctor Profile Management
	async getProfile(doctorId: string): Promise<DoctorProfile> {
		try {
			console.log('🚀 DoctorService - getProfile called with doctorId:', doctorId);
			
			const response = await this.apiClient.get<any>(
				`/doctor/${doctorId}/profile`
			);
			
			console.log('👤 DoctorService - Doctor profile response:', response);
			
			// Transform backend response to match frontend interface
			const profile: DoctorProfile = {
				_id: response.doctor._id || doctorId,
				first_name: response.doctor.first_name || '',
				last_name: response.doctor.last_name || '',
				email: response.doctor.email || '',
				phone_number: response.doctor.phone_number || '',
				specialization: response.doctor.specialty || '',
				license_number: response.doctor.license_number || '',
				years_of_experience: response.doctor.years_of_experience || 0,
				hospital_affiliation: response.doctor.hospital_affiliation || '',
				account_type: 'doctor',
				created_at: response.doctor.created_at || '',
				token: response.token || ''
			};

			return profile;
		} catch (error) {
			console.error('❌ DoctorService - Error fetching doctor profile:', error);
			throw error;
		}
	}
}

export const doctorService = new DoctorService();
