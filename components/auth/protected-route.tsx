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
		console.log('🔒 ProtectedRoute - Auth Check:', {
			loading,
			isAuthenticated,
			user: user ? {
				_id: user._id,
				account_type: user.account_type,
				role: user.role,
				email: user.email,
				isAdmin: (user as any).isAdmin
			} : null,
			allowedRoles,
			currentPath: window.location.pathname
		});

		if (!loading) {
			// If not authenticated, redirect to login
			if (!isAuthenticated) {
				console.log('❌ ProtectedRoute - Not authenticated, redirecting to login');
				router.push(redirectTo);
				return;
			}

			// If authenticated but role is not allowed, redirect to appropriate dashboard
			const userRole = user?.role || user?.account_type;
			const isRoleAllowed = allowedRoles.length === 0 || 
				(user && userRole && (
					allowedRoles.includes(userRole) ||
					(allowedRoles.includes('hospital') && user.account_type === 'hospital') ||
					(allowedRoles.includes('admin') && user.role === 'admin') ||
					(allowedRoles.includes('admin') && (user as any).isAdmin === 1)
				));

			console.log('🔍 ProtectedRoute - Role Check:', {
				userRole,
				allowedRoles,
				isRoleAllowed,
				accountType: user?.account_type,
				role: user?.role,
				isAdmin: (user as any)?.isAdmin
			});

			if (!isRoleAllowed) {
				console.log('❌ ProtectedRoute - Role not allowed, redirecting based on user role');
				switch (userRole) {
					case 'patient':
						console.log('↪️  Redirecting to patient dashboard');
						router.push('/patient/dashboard');
						break;
					case 'doctor':
						console.log('↪️  Redirecting to doctor dashboard');
						router.push('/doctor/dashboard');
						break;
					case 'hospital':
					case 'admin':
						console.log('↪️  Redirecting to admin dashboard');
						router.push('/admin/dashboard');
						break;
					default:
						console.log('↪️  Unknown role, redirecting to login');
						router.push('/login');
				}
			} else {
				console.log('✅ ProtectedRoute - Access granted');
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
	const userRole = user?.role || user?.account_type;
	if (
		!isAuthenticated ||
		(allowedRoles.length > 0 &&
			user &&
			userRole &&
			!allowedRoles.includes(userRole))
	) {
		return null;
	}

	return <>{children}</>;
}
