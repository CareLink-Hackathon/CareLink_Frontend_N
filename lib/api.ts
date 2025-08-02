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

		// Build headers properly
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};

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
	ingestDonorData: (data: any) => apiClient.post<{ status: string; message: string }>('/ingest', data),
	predictDemand: (data: any) => apiClient.post<any[]>('/predict', data),
	getInventoryStatus: () => apiClient.get<any[]>('/inventory'),
	optimizeInventory: (data: any) => apiClient.post<any[]>('/optimize', data),
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
