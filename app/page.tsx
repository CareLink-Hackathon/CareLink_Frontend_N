'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Facebook, Chrome, Apple, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { API_BASE_URL } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEmail, validatePhone, validatePassword } from '@/lib/auth';

export default function CreateAccount() {
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		dateOfBirth: '',
		gender: '',
		address: '',
		termsAccepted: false,
	});
	const [error, setError] = useState('');
	const router = useRouter();
	const { signup, refreshUser } = useAuth();

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateForm = () => {
		if (
			!formData.firstName.trim() ||
			!formData.lastName.trim() ||
			!formData.email.trim() ||
			!formData.phone.trim() ||
			!formData.password.trim()
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
			// Prepare signup data for patient only (public signup)
			const signupData = {
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				phone_number: formData.phone,
				password: formData.password,
				language: 'en',
				date_of_birth: formData.dateOfBirth || null,
				gender: formData.gender || null,
				address: formData.address || null,
			};

			const response = await fetch(`${API_BASE_URL}/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(signupData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Failed to create account');
			}

			// Store token and user data after successful signup using correct localStorage key
			localStorage.setItem('carelink_user', JSON.stringify(data));
			
			// Refresh the auth context to pick up the new user
			refreshUser();

			// Navigate to success page
			router.push(`/creating-account?userType=patient`);
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
							Create Patient Account
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Join CareLink to access healthcare services.
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex rounded-lg bg-gray-100 p-1">
						<Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
							Sign Up
						</Button>
						<Link href="/login" className="flex-1">
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
							<div className="flex">
								<Select defaultValue="cm">
									<SelectTrigger className="w-20 border-gray-300">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cm">🇨🇲 +237</SelectItem>
										<SelectItem value="us">🇺🇸 +1</SelectItem>
										<SelectItem value="uk">🇬🇧 +44</SelectItem>
									</SelectContent>
								</Select>
								<Input
									id="phone"
									placeholder="Enter phone number"
									className="flex-1 ml-2 border-gray-300"
									value={formData.phone}
									onChange={(e) => handleInputChange('phone', e.target.value)}
									required
								/>
							</div>
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

						{/* Optional patient fields */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="dateOfBirth">Date of Birth</Label>
								<Input
									id="dateOfBirth"
									type="date"
									className="border-gray-300"
									value={formData.dateOfBirth}
									onChange={(e) =>
										handleInputChange('dateOfBirth', e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="gender">Gender</Label>
								<Select
									value={formData.gender}
									onValueChange={(value) => handleInputChange('gender', value)}
								>
									<SelectTrigger className="border-gray-300">
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
										<SelectItem value="other">Other</SelectItem>
										<SelectItem value="prefer-not-to-say">
											Prefer not to say
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								placeholder="Enter your address"
								className="border-gray-300"
								value={formData.address}
								onChange={(e) => handleInputChange('address', e.target.value)}
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
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</Button>
					</form>

					{/* Social Login */}
					<div className="space-y-4">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="bg-white px-2 text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3">
							<Button variant="outline" className="border-gray-300">
								<Facebook className="h-4 w-4" />
							</Button>
							<Button variant="outline" className="border-gray-300">
								<Chrome className="h-4 w-4" />
							</Button>
							<Button variant="outline" className="border-gray-300">
								<Apple className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Footer */}
					<div className="text-center space-y-2">
						<p className="text-sm text-gray-600">
							Already have an account?{' '}
							<Link href="/login" className="text-blue-600 hover:underline">
								Log in
							</Link>
						</p>
						<p className="text-sm text-gray-600">
							Are you a hospital administrator?{' '}
							<Link href="/admin/signup" className="text-blue-600 hover:underline">
								Admin Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Branding */}
			<div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-8">
				<div className="text-center space-y-6 text-white">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold">Welcome to CareLink</h2>
						<p className="text-xl text-blue-100">
							Your comprehensive healthcare companion
						</p>
					</div>

					<div className="space-y-4 text-left">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>24/7 AI-powered medical assistance</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Easy appointment booking</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Secure health record management</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-sm font-bold">✓</span>
							</div>
							<span>Multilingual support</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
