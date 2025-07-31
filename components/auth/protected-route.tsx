'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[];
	redirectTo?: string;
}

export function ProtectedRoute({
	children,
	allowedRoles = [],
	redirectTo = '/login',
}: ProtectedRouteProps) {
	const { user, isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			// If not authenticated, redirect to login
			if (!isAuthenticated) {
				router.push(redirectTo);
				return;
			}

			// If authenticated but role is not allowed, redirect to appropriate dashboard
			if (
				allowedRoles.length > 0 &&
				user &&
				!allowedRoles.includes(user.account_type)
			) {
				switch (user.account_type) {
					case 'patient':
						router.push('/patient/dashboard');
						break;
					case 'doctor':
						router.push('/doctor/dashboard');
						break;
					case 'hospital':
						router.push('/admin/dashboard');
						break;
					default:
						router.push('/login');
				}
			}
		}
	}, [isAuthenticated, user, loading, router, allowedRoles, redirectTo]);

	// Show loading spinner while checking authentication
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
				<div className="text-center text-white">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	// Don't render children if not authenticated or wrong role
	if (
		!isAuthenticated ||
		(allowedRoles.length > 0 &&
			user &&
			!allowedRoles.includes(user.account_type))
	) {
		return null;
	}

	return <>{children}</>;
}
