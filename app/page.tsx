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
import { Facebook, Chrome, Apple } from 'lucide-react';
import Link from 'next/link';

export default function CreateAccount() {
	const [isLoading, setIsLoading] = useState(false);
	const [userType, setUserType] = useState('patient');
	const router = useRouter();

	const handleCreateAccount = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate account creation
		setTimeout(() => {
			router.push('/creating-account');
		}, 1000);
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left Panel - Form */}
			<div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center space-y-2">
						<h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
							Create Account
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Fill in your personal information.
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="flex rounded-lg bg-gray-100 p-1">
						<Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
							Sign Up
						</Button>
						<Button
							variant="ghost"
							className="flex-1 text-gray-600"
							onClick={() => router.push('/login')}
						>
							Sign In
						</Button>
					</div>

					<form onSubmit={handleCreateAccount} className="space-y-4">
						{/* User Type Selection */}
						<div className="space-y-2">
							<Label htmlFor="userType">Account Type</Label>
							<Select value={userType} onValueChange={setUserType}>
								<SelectTrigger className="border-gray-300">
									<SelectValue placeholder="Select account type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="patient">Patient</SelectItem>
									<SelectItem value="doctor">Doctor</SelectItem>
									<SelectItem value="admin">Hospital Administrator</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									placeholder="Enter name"
									className="border-gray-300"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									placeholder="Enter name"
									className="border-gray-300"
								/>
							</div>
						</div>

						{userType === 'doctor' && (
							<div className="space-y-2">
								<Label htmlFor="specialty">Medical Specialty</Label>
								<Select>
									<SelectTrigger className="border-gray-300">
										<SelectValue placeholder="Select specialty" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cardiology">Cardiology</SelectItem>
										<SelectItem value="dermatology">Dermatology</SelectItem>
										<SelectItem value="gynecology">Gynecology</SelectItem>
										<SelectItem value="pediatrics">Pediatrics</SelectItem>
										<SelectItem value="orthopedics">Orthopedics</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						{userType === 'admin' && (
							<div className="space-y-2">
								<Label htmlFor="hospital">Hospital/Clinic</Label>
								<Input
									id="hospital"
									placeholder="Enter hospital name"
									className="border-gray-300"
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
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
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter email"
								className="border-gray-300"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter password"
								className="border-gray-300"
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox id="terms" />
							<Label htmlFor="terms" className="text-sm text-gray-600">
								By signing up, you have agreed to our{' '}
								<Link href="#" className="text-blue-600 hover:underline">
									Terms & Conditions
								</Link>{' '}
								and{' '}
								<Link href="#" className="text-blue-600 hover:underline">
									Privacy Policy
								</Link>
							</Label>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
							disabled={isLoading}
						>
							{isLoading ? 'Creating Account...' : 'Create Account'}
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
