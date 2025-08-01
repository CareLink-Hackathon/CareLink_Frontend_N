import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/lib/auth-context';
import { PatientProvider } from '@/lib/contexts/patient-context';
import { DoctorProvider } from '@/lib/contexts/doctor-context';
import { AdminProvider } from '@/lib/contexts/admin-context';
import './globals.css';

export const metadata: Metadata = {
	title: 'CareLink',
	description:
		'CareLink connects patients and healthcare providers through a secure platform for streamlined communication, appointment management, and improved care delivery.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
			</head>
			<body>
				<AuthProvider>
					<PatientProvider>
						<DoctorProvider>
							<AdminProvider>{children}</AdminProvider>
						</DoctorProvider>
					</PatientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
