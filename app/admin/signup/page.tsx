'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEmail, validatePhone, validatePassword } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api';

export default function AdminSignup() {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		hospitalName: '',
		termsAccepted: false,
	});
	const [error, setError] = useState('');
	const router = useRouter();

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateForm = () => {
		// Check required fields
		if (
			!formData.firstName.trim() ||
			!formData.lastName.trim() ||
			!formData.email.trim() ||
			!formData.phone.trim() ||
			!formData.password.trim() ||
			!formData.hospitalName.trim()
		) {
			return 'Please fill in all required fields';
		}

		// Validate email
		if (!validateEmail(formData.email)) {
			return 'Please enter a valid email address';
		}

		// Validate phone
		if (!validatePhone(formData.phone)) {
			return 'Please enter a valid phone number';
		}

		// Validate password
		const passwordValidation = validatePassword(formData.password);
		if (!passwordValidation.isValid) {
			return passwordValidation.message || 'Password is invalid';
		}

		// Check terms acceptance
		if (!formData.termsAccepted) {
			return 'Please accept the terms and conditions';
		}

		return null;
	};

	const handleCreateAccount = async (e: React.FormEvent) => {
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
			// Prepare admin signup data
			const signupData = {
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				phone_number: formData.phone,
				password: formData.password,
				hospital_name: formData.hospitalName,
			};

			const response = await fetch(`${API_BASE_URL}/admin/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(signupData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Failed to create admin account');
			}

			// Navigate to admin login page
			router.push('/admin/login?message=Account created successfully');
		} catch (error: any) {
			setError(error.message || 'Failed to create account. Please try again.');
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
							Create Admin Account
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Register your hospital with CareLink.
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex rounded-lg bg-gray-100 p-1">
						<Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
							Sign Up
						</Button>
						<Link href="/admin/login" className="flex-1">
							<Button
								variant="ghost"
								className="w-full text-gray-600 hover:text-blue-600"
							>
								Log In
							</Button>
						</Link>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleCreateAccount} className="space-y-4">
						{/* Personal Information */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name *</Label>
								<Input
									id="firstName"
									placeholder="Enter first name"
									className="border-gray-300"
									value={formData.firstName}
									onChange={(e) =>
										handleInputChange('firstName', e.target.value)
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name *</Label>
								<Input
									id="lastName"
									placeholder="Enter last name"
									className="border-gray-300"
									value={formData.lastName}
									onChange={(e) =>
										handleInputChange('lastName', e.target.value)
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								className="border-gray-300"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number *</Label>
							<Input
								id="phone"
								placeholder="Enter phone number"
								className="border-gray-300"
								value={formData.phone}
								onChange={(e) => handleInputChange('phone', e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="hospitalName">Hospital/Clinic Name *</Label>
							<Input
								id="hospitalName"
								placeholder="Enter hospital name"
								className="border-gray-300"
								value={formData.hospitalName}
								onChange={(e) =>
									handleInputChange('hospitalName', e.target.value)
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter password (min 6 characters)"
								className="border-gray-300"
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								required
							/>
						</div>

						{/* Terms and Conditions */}
						<div className="flex items-center space-x-2">
							<Checkbox
								id="terms"
								checked={formData.termsAccepted}
								onCheckedChange={(checked) =>
									handleInputChange('termsAccepted', Boolean(checked))
								}
							/>
							<Label htmlFor="terms" className="text-sm text-gray-600">
								I agree to the{' '}
								<Link href="/terms" className="text-blue-600 hover:underline">
									Terms & Conditions
								</Link>{' '}
								and{' '}
								<Link href="/privacy" className="text-blue-600 hover:underline">
									Privacy Policy
								</Link>
							</Label>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white"
							disabled={isLoading}
						>
							{isLoading ? 'Creating Account...' : 'Create Admin Account'}
						</Button>
					</form>

					{/* Footer */}
					<div className="text-center space-y-2">
						<p className="text-sm text-gray-600">
							Already have an admin account?{' '}
							<Link href="/admin/login" className="text-blue-600 hover:underline">
								Log in
							</Link>
						</p>
						<p className="text-sm text-gray-600">
							Are you a patient?{' '}
							<Link href="/" className="text-blue-600 hover:underline">
								Patient Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Branding */}
			<div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-8">
				<div className="text-center space-y-6 text-white">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold">CareLink for Hospitals</h2>
						<p className="text-xl text-blue-100">
							Manage your healthcare facility with ease
						</p>
					</div>

					<div className="space-y-4 text-left">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Complete patient management system</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Doctor and department management</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Appointment scheduling & management</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Analytics and reporting tools</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
