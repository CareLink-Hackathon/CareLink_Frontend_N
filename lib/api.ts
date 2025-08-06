// API Configuration
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	'https://carelink-backend-df36bde309e1.herokuapp.com';

// API Client with error handling
export class ApiClient {
	private baseURL: string;

	constructor(baseURL: string = API_BASE_URL) {
		this.baseURL = baseURL;
	}

	// Helper method to get auth token from localStorage
	private getAuthToken(): string | null {
		if (typeof window !== 'undefined') {
			const savedUser = localStorage.getItem('carelink_user');
			if (savedUser) {
				try {
					const user = JSON.parse(savedUser);
					return user.token;
				} catch (error) {
					console.error('Error parsing saved user data:', error);
				}
			}
		}
		return null;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		console.log('API Request URL:', url);
		console.log('API Base URL:', this.baseURL);

		// Build headers properly
		const headers: Record<string, string> = {};

		// Only set Content-Type for non-FormData requests
		if (!(options.body instanceof FormData)) {
			headers['Content-Type'] = 'application/json';
		}

		// Add any passed headers
		if (options.headers) {
			Object.assign(headers, options.headers);
		}

		// Add Authorization header for protected routes (but not for appointment endpoints)
		if (
			!endpoint.includes('/signup') &&
			!endpoint.includes('/login') &&
			!endpoint.includes('/appointment/')
		) {
			const token = this.getAuthToken();
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		const config: RequestInit = {
			...options,
			headers,
		};

		// Debug logging
		console.log('API Request Details:');
		console.log('URL:', url);
		console.log('Method:', config.method || 'GET');
		console.log('Headers:', headers);
		console.log('Body:', config.body);

		try {
			const response = await fetch(url, config);

			console.log('Response status:', response.status);
			console.log('Response headers:', response.headers);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.log('Error response data:', errorData);
				throw new ApiError(
					response.status,
					errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
					errorData
				);
			}

			return await response.json();
		} catch (error) {
			console.log('API request error:', error);
			if (error instanceof ApiError) {
				throw error;
			}

			// Network or other errors
			throw new ApiError(0, 'Network error or server unavailable', {
				originalError: error,
			});
		}
	}

	async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET', headers });
	}

	async post<T>(
		endpoint: string,
		data?: any,
		headers?: Record<string, string>
	): Promise<T> {
		console.log('POST data before stringify:', data);
		const body = data ? JSON.stringify(data) : undefined;
		console.log('POST body after stringify:', body);

		return this.request<T>(endpoint, {
			method: 'POST',
			body: body,
			headers,
		});
	}

	async postFile<T>(
		endpoint: string,
		formData: FormData,
		headers?: Record<string, string>
	): Promise<T> {
		// For file uploads, don't stringify the data and don't set Content-Type
		const uploadHeaders = headers ? { ...headers } : {};
		// Remove Content-Type to let browser set it with boundary for FormData
		delete uploadHeaders['Content-Type'];
		
		return this.request<T>(endpoint, {
			method: 'POST',
			body: formData,
			headers: uploadHeaders,
		});
	}

	async put<T>(
		endpoint: string,
		data?: any,
		headers?: Record<string, string>
	): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
			headers,
		});
	}

	async delete<T>(
		endpoint: string,
		headers?: Record<string, string>
	): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE', headers });
	}
}

// Custom API Error class
export class ApiError extends Error {
	constructor(public status: number, message: string, public data?: any) {
		super(message);
		this.name = 'ApiError';
	}

	get isNetworkError(): boolean {
		return this.status === 0;
	}

	get isServerError(): boolean {
		return this.status >= 500;
	}

	get isClientError(): boolean {
		return this.status >= 400 && this.status < 500;
	}
}

// Create default API client instance
export const apiClient = new ApiClient();

// Authentication API methods
export const authAPI = {
	signup: (data: any) => apiClient.post('/signup', data),
	login: (data: any) => apiClient.post('/login', data),
};

// User-specific API methods
export const userAPI = {
	getProfile: (userId: string) => apiClient.get(`/user/${userId}`),
	updateProfile: (userId: string, data: any) =>
		apiClient.put(`/user/${userId}`, data),
};

// Chat API methods
export const chatAPI = {
	createNewChat: (userId: string, data: { chat_name: string }) =>
		apiClient.post(`/new_chat/${userId}`, data),
	sendMessage: (userId: string, chatId: string, data: { message: string }) =>
		apiClient.post(`/patient/${userId}/chat/${chatId}`, data),
	getChatHistory: (userId: string) => apiClient.get(`/chats/${userId}`),
};

// Appointment API methods
export const appointmentAPI = {
	requestAppointment: (userId: string, data: any) =>
		apiClient.post(`/patient/appointment/${userId}`, data),
	getUserAppointments: (userId: string) =>
		apiClient.get(`/appointment/${userId}`),
	acceptAppointment: (adminId: string, appointmentId: string) =>
		apiClient.post(`/admin/accept_appointment/${adminId}/${appointmentId}`),
};

// Feedback API methods
export const feedbackAPI = {
	submitFeedback: (userId: string, data: any) =>
		apiClient.post(`/feedback/${userId}`, data),
	getFeedbacks: () => apiClient.get('/feedback/'),
};

// Blood Bank API methods
export const bloodBankAPI = {
	// Legacy endpoints (for backward compatibility)
	ingestDonorData: (data: any) => apiClient.post<{ status: string; message: string }>('/ingest', data),
	predictDemand: (data: any) => apiClient.post<any[]>('/predict', data),
	getInventoryStatus: () => apiClient.get<any[]>('/inventory'),
	optimizeInventory: (data: any) => apiClient.post<any[]>('/optimize', data),

	// New admin-specific endpoints
	// Donor management
	getDonors: (adminId: string, params?: { page?: number; limit?: number; blood_type?: string; status?: string }) => {
		const queryParams = new URLSearchParams();
		if (params?.page) queryParams.append('page', params.page.toString());
		if (params?.limit) queryParams.append('limit', params.limit.toString());
		if (params?.blood_type) queryParams.append('blood_type', params.blood_type);
		if (params?.status) queryParams.append('status', params.status);
		const query = queryParams.toString();
		return apiClient.get(`/admin/${adminId}/blood-bank/donors${query ? `?${query}` : ''}`);
	},
	createDonor: (adminId: string, donorData: any) => 
		apiClient.post(`/admin/${adminId}/blood-bank/donors`, donorData),
	getDonor: (adminId: string, donorId: string) => 
		apiClient.get(`/admin/${adminId}/blood-bank/donors/${donorId}`),
	updateDonor: (adminId: string, donorId: string, donorData: any) => 
		apiClient.put(`/admin/${adminId}/blood-bank/donors/${donorId}`, donorData),
	deleteDonor: (adminId: string, donorId: string) => 
		apiClient.delete(`/admin/${adminId}/blood-bank/donors/${donorId}`),

	// Inventory management
	getAdminInventory: (adminId: string) => 
		apiClient.get(`/admin/${adminId}/blood-bank/inventory`),
	updateInventory: (adminId: string, inventoryData: any) => 
		apiClient.put(`/admin/${adminId}/blood-bank/inventory`, inventoryData),

	// Statistics
	getBloodBankStats: (adminId: string) => 
		apiClient.get(`/admin/${adminId}/blood-bank/stats`),

	// Blood requests
	getBloodRequests: (adminId: string, params?: { status?: string; page?: number; limit?: number }) => {
		const queryParams = new URLSearchParams();
		if (params?.status) queryParams.append('status', params.status);
		if (params?.page) queryParams.append('page', params.page.toString());
		if (params?.limit) queryParams.append('limit', params.limit.toString());
		const query = queryParams.toString();
		return apiClient.get(`/admin/${adminId}/blood-bank/requests${query ? `?${query}` : ''}`);
	},
	createBloodRequest: (adminId: string, requestData: any) => 
		apiClient.post(`/admin/${adminId}/blood-bank/requests`, requestData),
	updateBloodRequestStatus: (adminId: string, requestId: string, status: string) => 
		apiClient.put(`/admin/${adminId}/blood-bank/requests/${requestId}`, { status }),
};

// Admin API methods
export const adminAPI = {
	// Dashboard
	getDashboardStats: (adminId: string) => apiClient.get(`/admin/${adminId}/dashboard-stats`),

	// Appointments
	getAllAppointments: (adminId: string) => apiClient.get(`/admin/${adminId}/appointments`),
	acceptAppointment: (adminId: string, appointmentId: string) =>
		apiClient.post(`/admin/accept_appointment/${adminId}/${appointmentId}`, {}),
	assignDoctorToAppointment: (adminId: string, appointmentId: string, doctorId: string) =>
		apiClient.put(`/admin/${adminId}/appointments/${appointmentId}/assign`, { doctor_id: doctorId }),
	updateAppointmentStatus: (adminId: string, appointmentId: string, status: string) =>
		apiClient.put(`/admin/${adminId}/appointments/${appointmentId}/status`, { status }),

	// Doctors
	getDoctors: () => apiClient.get('/admin/doctors'),
	createDoctor: (doctorData: any) => apiClient.post('/admin/create-doctor', doctorData),
	updateDoctor: (adminId: string, doctorId: string, data: any) =>
		apiClient.put(`/admin/${adminId}/doctors/${doctorId}`, data),
	deleteDoctor: (adminId: string, doctorId: string) =>
		apiClient.delete(`/admin/${adminId}/doctors/${doctorId}`),
	suspendDoctor: (adminId: string, doctorId: string) =>
		apiClient.put(`/admin/${adminId}/doctors/${doctorId}/suspend`, {}),

	// Patients
	getPatients: (adminId: string) => apiClient.get(`/admin/${adminId}/patients`),
	updatePatient: (adminId: string, patientId: string, data: any) =>
		apiClient.put(`/admin/${adminId}/patients/${patientId}`, data),
	deletePatient: (adminId: string, patientId: string) =>
		apiClient.delete(`/admin/${adminId}/patients/${patientId}`),
	suspendPatient: (adminId: string, patientId: string) =>
		apiClient.put(`/admin/${adminId}/patients/${patientId}/suspend`, {}),
	activatePatient: (adminId: string, patientId: string) =>
		apiClient.put(`/admin/${adminId}/patients/${patientId}/activate`, {}),

	// Departments
	getDepartments: () => apiClient.get('/admin/departments'),
	createDepartment: (data: {name: string; description?: string}) =>
		apiClient.post('/admin/departments', data),
	updateDepartment: (departmentId: string, data: {name: string; description?: string}) =>
		apiClient.put(`/admin/departments/${departmentId}`, data),
	deleteDepartment: (departmentId: string) =>
		apiClient.delete(`/admin/departments/${departmentId}`),

	// Feedback
	getFeedbackAnalytics: () => apiClient.get('/feedback/'),
	updateFeedbackStatus: (adminId: string, feedbackId: string, status: string) =>
		apiClient.put(`/admin/${adminId}/feedback/${feedbackId}/status`, { status }),

	// Notifications
	getNotifications: (adminId: string) => apiClient.get(`/admin/${adminId}/notifications`),
	markNotificationAsRead: (adminId: string, notificationId: string) =>
		apiClient.put(`/admin/${adminId}/notifications/${notificationId}/read`, {}),
};

// Patient-specific API methods (comprehensive)
export const patientAPI = {
	// Chat operations
	createChat: (userId: string, chatName: string) =>
		apiClient.post(`/new_chat/${userId}`, { chat_name: chatName }),
	sendChatMessage: (userId: string, chatId: string, message: string) =>
		apiClient.post(`/patient/${userId}/chat/${chatId}`, { message }),
	getChatHistory: (userId: string) => apiClient.get(`/chats/${userId}`),

	// Appointment operations
	requestAppointment: (userId: string, appointmentData: any) =>
		apiClient.post(`/patient/appointment/${userId}`, appointmentData),
	getAppointments: (userId: string) => apiClient.get(`/appointment/${userId}`),

	// Feedback operations
	submitFeedback: (userId: string, feedbackData: any) =>
		apiClient.post(`/feedback/${userId}`, feedbackData),

	// User operations (when available)
	getProfile: (userId: string) => apiClient.get(`/user/${userId}`),
	updateProfile: (userId: string, data: any) =>
		apiClient.put(`/user/${userId}`, data),
};
