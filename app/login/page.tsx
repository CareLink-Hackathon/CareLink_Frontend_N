'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
	const [isLoading, setIsLoading] = useState(false);
	const [userType, setUserType] = useState('patient');
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	const { login } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form data
		if (!credential.trim() || !password.trim()) {
			setError('Please fill in all fields');
			setIsLoading(false);
			return;
		}

		try {
			await login(credential, password, userType);

			// Route based on user type after successful login
			switch (userType) {
				case 'patient':
					router.push('/patient/dashboard');
					break;
				case 'doctor':
					router.push('/doctor/dashboard');
					break;
				case 'hospital':
				case 'admin':
					router.push('/admin/dashboard');
					break;
				default:
					router.push('/patient/dashboard');
			}
		} catch (error: any) {
			setError(error.message || 'Failed to sign in. Please try again.');
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
							Welcome Back
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							We are happy to have you back
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex rounded-lg bg-gray-100 p-1">
						<Button
							variant="ghost"
							className="flex-1 text-gray-600"
							onClick={() => router.push('/')}
						>
							Sign Up
						</Button>
						<Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
							Sign In
						</Button>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
						{/* Error Alert */}
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* User Type Selection */}
						<div className="space-y-2">
							<Label htmlFor="userType">Login As</Label>
							<Select value={userType} onValueChange={setUserType}>
								<SelectTrigger className="border-gray-300">
									<SelectValue placeholder="Select login type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient">Patient</SelectItem>
									<SelectItem value="doctor">Doctor</SelectItem>
									<SelectItem value="hospital">
										Hospital Administrator
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="credential">Email or Phone Number</Label>
							<Input
								id="credential"
								type="text"
								placeholder="Enter email or phone number"
								className="border-gray-300"
								value={credential}
								onChange={(e) => setCredential(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								className="border-gray-300"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<div className="text-center">
							<Link href="#" className="text-blue-600 hover:underline text-sm">
								Forgot Password? Reset Your Password
							</Link>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
							disabled={isLoading}
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>

					<div className="text-center">
						<p className="text-gray-500 mb-4">or continue with</p>
						<div className="flex justify-center space-x-4">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-transparent"
							>
								<Facebook className="w-5 h-5 text-blue-600" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-transparent"
							>
								<Chrome className="w-5 h-5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full bg-transparent"
							>
								<Apple className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Branding */}
			<div
				className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col justify-between p-4 sm:p-8 text-white relative overflow-hidden min-h-[300px] lg:min-h-screen"
				style={{
					backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)), url('/images/hospital-bg.png')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center">
						<div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-md flex items-center justify-center">
							<div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
						</div>
					</div>
					<div>
						<h2 className="text-xl sm:text-2xl font-bold">CareLink</h2>
						<p className="text-blue-100 text-sm sm:text-base">
							Connected Care, Closer to You.
						</p>
					</div>
				</div>

				<div className="text-center space-y-4">
					<p className="text-xs sm:text-sm">Follow CareLink</p>
					<div className="flex justify-center space-x-4">
						<Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
