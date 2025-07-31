'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (
		email: string,
		password: string,
		accountType: string
	) => Promise<void>;
	signup: (userData: any) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing user on mount
		const currentUser = authService.getCurrentUser();
		setUser(currentUser);
		setLoading(false);
	}, []);

	const login = async (
		credential: string,
		password: string,
		accountType: string
	) => {
		try {
			setLoading(true);
			const userData = await authService.login({
				credential,
				password,
				account_type: accountType as 'patient' | 'doctor' | 'hospital',
			});
			setUser(userData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signup = async (userData: any) => {
		try {
			setLoading(true);
			const newUser = await authService.signup(userData);
			setUser(newUser);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		authService.logout();
		setUser(null);
		// Redirect to login page after logout
		window.location.href = '/login';
	};

	const value = {
		user,
		loading,
		login,
		signup,
		logout,
		isAuthenticated: user !== null,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
