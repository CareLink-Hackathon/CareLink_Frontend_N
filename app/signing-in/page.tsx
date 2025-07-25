'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SigningInContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const userType = searchParams.get('userType') || 'patient';

	useEffect(() => {
		const timer = setTimeout(() => {
			// Route to the correct dashboard based on user type
			switch (userType) {
				case 'patient':
					router.push('/patient/dashboard');
					break;
				case 'doctor':
					router.push('/doctor/dashboard');
					break;
				case 'admin':
					router.push('/admin/dashboard');
					break;
				default:
					router.push('/patient/dashboard');
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [router, userType]);

	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left Panel - Loading */}
			<div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
				<div className="text-center space-y-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
						Welcome Back
					</h1>
					<p className="text-sm sm:text-base text-gray-600">
						We are happy to have you back
					</p>

					<div className="flex items-center justify-center">
						<div className="relative">
							<div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
							<div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
						</div>
					</div>

					<p className="text-gray-500">Signing in...</p>
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
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-80"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-80"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-80"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-80"></div>
						<div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-80"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SigningIn() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
				</div>
			}
		>
			<SigningInContent />
		</Suspense>
	);
}
