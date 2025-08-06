'use client';

import type React from 'react';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEmail } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';

function AdminLoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const router = useRouter();
	const searchParams = useSearchParams();
	const { refreshUser } = useAuth();
	const message = searchParams.get('message');

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.email.trim() || !formData.password.trim()) {
			return 'Please fill in all fields';
		}

		if (!validateEmail(formData.email)) {
			return 'Please enter a valid email address';
		}

		return null;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('http://localhost:8000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					credential: formData.email,  // Backend expects 'credential' field
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Login failed');
			}

			// Check if user is admin
			if (data.role !== 'admin') {
				throw new Error('Access denied. Admin credentials required.');
			}

			// Store token and user data using correct localStorage key
			localStorage.setItem('carelink_user', JSON.stringify(data));

			// Refresh the auth context to pick up the new user
			refreshUser();

			// Navigate to admin dashboard
			router.push('/admin/dashboard');
		} catch (error: any) {
			setError(error.message || 'Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left Panel - Form */}
			<div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center space-y-2">
						<h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
							Admin Login
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Access your hospital admin panel.
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex rounded-lg bg-gray-100 p-1">
						<Link href="/admin/signup" className="flex-1">
							<Button
								variant="ghost"
								className="w-full text-gray-600 hover:text-blue-600"
							>
								Sign Up
							</Button>
						</Link>
						<Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
							Log In
						</Button>
					</div>

					{message && (
						<Alert>
							<CheckCircle className="h-4 w-4" />
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your admin email"
								className="border-gray-300"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								className="border-gray-300"
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									href="/admin/forgot-password"
									className="text-blue-600 hover:underline"
								>
									Forgot password?
								</Link>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white"
							disabled={isLoading}
						>
							{isLoading ? 'Logging in...' : 'Log In'}
						</Button>
					</form>

					{/* Footer */}
					<div className="text-center space-y-2">
						<p className="text-sm text-gray-600">
							Don't have an admin account?{' '}
							<Link href="/admin/signup" className="text-blue-600 hover:underline">
								Sign up
							</Link>
						</p>
						<p className="text-sm text-gray-600">
							Are you a patient?{' '}
							<Link href="/login" className="text-blue-600 hover:underline">
								Patient Login
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Branding */}
			<div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-8">
				<div className="text-center space-y-6 text-white">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold">Welcome Back</h2>
						<p className="text-xl text-blue-100">
							Manage your healthcare facility with CareLink
						</p>
					</div>

					<div className="space-y-4 text-left">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Secure admin access</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Complete hospital management</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Real-time analytics</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>24/7 support</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function AdminLogin() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminLoginForm />
		</Suspense>
	);
}
