'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import {
	adminService,
	AdminDashboardStats,
	AdminAppointment,
	Doctor,
	Patient,
	FeedbackAnalytics,
	SystemNotification,
} from '@/lib/services/admin-service';
import { useAuth } from '@/lib/auth-context';

interface AdminContextType {
	// Data
	dashboardStats: AdminDashboardStats | null;
	appointments: AdminAppointment[];
	doctors: Doctor[];
	patients: Patient[];
	feedbackAnalytics: FeedbackAnalytics | null;
	notifications: SystemNotification[];
	unreadNotifications: number;

	// Loading states
	loading: boolean;
	appointmentsLoading: boolean;
	doctorsLoading: boolean;
	patientsLoading: boolean;
	feedbackLoading: boolean;
	notificationsLoading: boolean;

	// Error states
	error: string | null;
	appointmentsError: string | null;
	doctorsError: string | null;
	patientsError: string | null;
	feedbackError: string | null;
	notificationsError: string | null;

	// Actions
	loadDashboardStats: () => Promise<void>;
	loadAppointments: () => Promise<void>;
	loadDoctors: () => Promise<void>;
	loadPatients: () => Promise<void>;
	loadFeedbackAnalytics: () => Promise<void>;
	loadNotifications: () => Promise<void>;

	// Appointment actions
	acceptAppointment: (appointmentId: string) => Promise<void>;
	assignDoctorToAppointment: (
		appointmentId: string,
		doctorId: string
	) => Promise<void>;
	updateAppointmentStatus: (
		appointmentId: string,
		status: string
	) => Promise<void>;

	// Doctor actions
	updateDoctor: (doctorId: string, updates: Partial<Doctor>) => Promise<void>;
	suspendDoctor: (doctorId: string) => Promise<void>;

	// Feedback actions
	updateFeedbackStatus: (feedbackId: string, status: string) => Promise<void>;

	// Notification actions
	markNotificationAsRead: (notificationId: string) => Promise<void>;

	// Utility
	clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();

	// State
	const [dashboardStats, setDashboardStats] =
		useState<AdminDashboardStats | null>(null);
	const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [feedbackAnalytics, setFeedbackAnalytics] =
		useState<FeedbackAnalytics | null>(null);
	const [notifications, setNotifications] = useState<SystemNotification[]>([]);

	// Loading states
	const [loading, setLoading] = useState(false);
	const [appointmentsLoading, setAppointmentsLoading] = useState(false);
	const [doctorsLoading, setDoctorsLoading] = useState(false);
	const [patientsLoading, setPatientsLoading] = useState(false);
	const [feedbackLoading, setFeedbackLoading] = useState(false);
	const [notificationsLoading, setNotificationsLoading] = useState(false);

	// Error states
	const [error, setError] = useState<string | null>(null);
	const [appointmentsError, setAppointmentsError] = useState<string | null>(
		null
	);
	const [doctorsError, setDoctorsError] = useState<string | null>(null);
	const [patientsError, setPatientsError] = useState<string | null>(null);
	const [feedbackError, setFeedbackError] = useState<string | null>(null);
	const [notificationsError, setNotificationsError] = useState<string | null>(
		null
	);

	// Computed values
	const unreadNotifications = notifications.filter((n) => !n.read).length;

	// Action functions
	const loadDashboardStats = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setLoading(true);
		setError(null);

		try {
			const stats = await adminService.getDashboardStats(user._id);
			setDashboardStats(stats);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to load dashboard data'
			);
		} finally {
			setLoading(false);
		}
	};

	const loadAppointments = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setAppointmentsLoading(true);
		setAppointmentsError(null);

		try {
			const appointmentsData = await adminService.getAllAppointments(user._id);
			setAppointments(appointmentsData);
		} catch (err) {
			setAppointmentsError(
				err instanceof Error ? err.message : 'Failed to load appointments'
			);
		} finally {
			setAppointmentsLoading(false);
		}
	};

	const loadDoctors = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setDoctorsLoading(true);
		setDoctorsError(null);

		try {
			const doctorsData = await adminService.getDoctors(user._id);
			setDoctors(doctorsData);
		} catch (err) {
			setDoctorsError(
				err instanceof Error ? err.message : 'Failed to load doctors'
			);
		} finally {
			setDoctorsLoading(false);
		}
	};

	const loadPatients = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setPatientsLoading(true);
		setPatientsError(null);

		try {
			const patientsData = await adminService.getPatients(user._id);
			setPatients(patientsData);
		} catch (err) {
			setPatientsError(
				err instanceof Error ? err.message : 'Failed to load patients'
			);
		} finally {
			setPatientsLoading(false);
		}
	};

	const loadFeedbackAnalytics = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setFeedbackLoading(true);
		setFeedbackError(null);

		try {
			const feedbackData = await adminService.getFeedbackAnalytics(user._id);
			setFeedbackAnalytics(feedbackData);
		} catch (err) {
			setFeedbackError(
				err instanceof Error ? err.message : 'Failed to load feedback data'
			);
		} finally {
			setFeedbackLoading(false);
		}
	};

	const loadNotifications = async () => {
		if (!user?._id || user.account_type !== 'hospital') return;

		setNotificationsLoading(true);
		setNotificationsError(null);

		try {
			const notificationsData = await adminService.getNotifications(user._id);
			setNotifications(notificationsData);
		} catch (err) {
			setNotificationsError(
				err instanceof Error ? err.message : 'Failed to load notifications'
			);
		} finally {
			setNotificationsLoading(false);
		}
	};

	const acceptAppointment = async (appointmentId: string) => {
		if (!user?._id) return;

		try {
			await adminService.acceptAppointment(appointmentId, user._id);
			await loadAppointments(); // Refresh appointments
			await loadDashboardStats(); // Update dashboard stats
		} catch (err) {
			throw err;
		}
	};

	const assignDoctorToAppointment = async (
		appointmentId: string,
		doctorId: string
	) => {
		if (!user?._id) return;

		try {
			await adminService.assignDoctorToAppointment(
				appointmentId,
				doctorId,
				user._id
			);
			await loadAppointments();
		} catch (err) {
			throw err;
		}
	};

	const updateAppointmentStatus = async (
		appointmentId: string,
		status: string
	) => {
		if (!user?._id) return;

		try {
			await adminService.updateAppointmentStatus(
				appointmentId,
				status,
				user._id
			);
			await loadAppointments();
			await loadDashboardStats();
		} catch (err) {
			throw err;
		}
	};

	const updateDoctor = async (doctorId: string, updates: Partial<Doctor>) => {
		if (!user?._id) return;

		try {
			await adminService.updateDoctor(doctorId, updates, user._id);
			await loadDoctors();
		} catch (err) {
			throw err;
		}
	};

	const suspendDoctor = async (doctorId: string) => {
		if (!user?._id) return;

		try {
			await adminService.suspendDoctor(doctorId, user._id);
			await loadDoctors();
		} catch (err) {
			throw err;
		}
	};

	const updateFeedbackStatus = async (feedbackId: string, status: string) => {
		if (!user?._id) return;

		try {
			await adminService.updateFeedbackStatus(feedbackId, status, user._id);
			await loadFeedbackAnalytics();
		} catch (err) {
			throw err;
		}
	};

	const markNotificationAsRead = async (notificationId: string) => {
		if (!user?._id) return;

		try {
			await adminService.markNotificationAsRead(notificationId, user._id);
			await loadNotifications();
		} catch (err) {
			throw err;
		}
	};

	const clearError = () => setError(null);

	// Load data on user change
	useEffect(() => {
		if (user && user.account_type === 'hospital' && (user as any).isAdmin) {
			loadDashboardStats();
			loadAppointments();
			loadDoctors();
			loadPatients();
			loadFeedbackAnalytics();
			loadNotifications();
		}
	}, [user]);

	const contextValue: AdminContextType = {
		// Data
		dashboardStats,
		appointments,
		doctors,
		patients,
		feedbackAnalytics,
		notifications,
		unreadNotifications,

		// Loading states
		loading,
		appointmentsLoading,
		doctorsLoading,
		patientsLoading,
		feedbackLoading,
		notificationsLoading,

		// Error states
		error,
		appointmentsError,
		doctorsError,
		patientsError,
		feedbackError,
		notificationsError,

		// Actions
		loadDashboardStats,
		loadAppointments,
		loadDoctors,
		loadPatients,
		loadFeedbackAnalytics,
		loadNotifications,

		// Appointment actions
		acceptAppointment,
		assignDoctorToAppointment,
		updateAppointmentStatus,

		// Doctor actions
		updateDoctor,
		suspendDoctor,

		// Feedback actions
		updateFeedbackStatus,

		// Notification actions
		markNotificationAsRead,

		// Utility
		clearError,
	};

	return (
		<AdminContext.Provider value={contextValue}>
			{children}
		</AdminContext.Provider>
	);
}

export function useAdmin() {
	const context = useContext(AdminContext);
	if (context === undefined) {
		throw new Error('useAdmin must be used within an AdminProvider');
	}
	return context;
}
