import { apiClient, ApiError } from './api';
import { SignupRequest, LoginRequest, User } from './types';

// Authentication service
export class AuthService {
	private static instance: AuthService;
	private user: User | null = null;

	private constructor() {
		// Load user from localStorage on initialization
		if (typeof window !== 'undefined') {
			const savedUser = localStorage.getItem('carelink_user');
			if (savedUser) {
				try {
					this.user = JSON.parse(savedUser);
				} catch (error) {
					console.error('Error parsing saved user data:', error);
					localStorage.removeItem('carelink_user');
				}
			}
		}
	}

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	// Signup method
	async signup(data: SignupRequest): Promise<User> {
		try {
			const response = await apiClient.post<User>('/signup', data);

			// Save user data and token
			this.user = response;
			this.saveUserToLocalStorage(response);

			return response;
		} catch (error) {
			if (error instanceof ApiError) {
				// Handle specific API errors
				throw new Error(error.message);
			}
			throw new Error('Failed to create account. Please try again.');
		}
	}

	// Login method
	async login(data: LoginRequest): Promise<User> {
		try {
			console.log('🚀 AuthService - Login request:', { 
				credential: data.credential, 
				account_type: data.account_type 
			});
			
			const response = await apiClient.post<any>('/login', data);
			console.log('📦 AuthService - Raw login response from backend:', response);

			// Transform the response to match our User interface
			const user: User = {
				...response,
				_id: response.user_id || response._id,
				account_type: response.role === 'admin' ? 'hospital' : response.role as any,
				role: response.role,
				phone_number: response.phone_number || '',
				language: response.language || 'en',
				user_id: response.user_id,
				redirect_path: response.redirect_path,
				specialty: response.specialty,
				hospital_name: response.hospital_name,
				isAdmin: response.role === 'admin'
			};

			console.log('🔄 AuthService - Transformed user object:', user);

			// Save user data and token
			this.user = user;
			this.saveUserToLocalStorage(user);

			return user;
		} catch (error) {
			console.error('❌ AuthService - Login error:', error);
			if (error instanceof ApiError) {
				// Handle specific API errors
				if (error.status === 401) {
					throw new Error(
						'Invalid email/phone or password. Please check your credentials.'
					);
				}
				throw new Error(error.message);
			}
			throw new Error('Failed to sign in. Please try again.');
		}
	}

	// Logout method
	logout(): void {
		this.user = null;
		if (typeof window !== 'undefined') {
			localStorage.removeItem('carelink_user');
		}
	}

	// Get current user
	getCurrentUser(): User | null {
		// Always re-read from localStorage to get the latest data
		if (typeof window !== 'undefined') {
			const savedUser = localStorage.getItem('carelink_user');
			if (savedUser) {
				try {
					this.user = JSON.parse(savedUser);
					console.log('👤 AuthService - getCurrentUser from localStorage:', this.user);
					return this.user;
				} catch (error) {
					console.error('❌ AuthService - Error parsing saved user data:', error);
					localStorage.removeItem('carelink_user');
					this.user = null;
				}
			} else {
				console.log('❌ AuthService - No saved user found in localStorage');
				this.user = null;
			}
		}
		return this.user;
	}

	// Check if user is logged in
	isAuthenticated(): boolean {
		return this.user !== null && this.user.token !== undefined;
	}

	// Get user token
	getToken(): string | null {
		return this.user?.token || null;
	}

	// Get user type
	getUserType(): string | null {
		return this.user?.account_type || null;
	}

	// Private method to save user to localStorage
	private saveUserToLocalStorage(user: User): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('carelink_user', JSON.stringify(user));
		}
	}

	// Method to refresh user data (for future use)
	async refreshUser(): Promise<User | null> {
		// This would be implemented when the backend has a user profile endpoint
		return this.user;
	}
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Utility functions for form validation
export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
	// Basic phone validation - adjust pattern as needed
	const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
	return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validatePassword = (
	password: string
): { isValid: boolean; message?: string } => {
	if (password.length < 6) {
		return {
			isValid: false,
			message: 'Password must be at least 6 characters long',
		};
	}
	return { isValid: true };
};
