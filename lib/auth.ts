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
			const response = await apiClient.post<User>('/login', data);

			// Save user data and token
			this.user = response;
			this.saveUserToLocalStorage(response);

			return response;
		} catch (error) {
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
