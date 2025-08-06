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
	createDoctor: (doctorData: Partial<Doctor>) => Promise<void>;
	updateDoctor: (doctorId: string, updates: Partial<Doctor>) => Promise<void>;
	deleteDoctor: (doctorId: string) => Promise<void>;
	suspendDoctor: (doctorId: string) => Promise<void>;
	unsuspendDoctor: (doctorId: string) => Promise<void>;

	// Patient actions
	updatePatient: (patientId: string, updates: Partial<Patient>) => Promise<void>;
	deletePatient: (patientId: string) => Promise<void>;
	suspendPatient: (patientId: string) => Promise<void>;
	activatePatient: (patientId: string) => Promise<void>;

	// Department actions
	departments: Array<{_id: string; name: string; description?: string}>;
	departmentsLoading: boolean;
	departmentsError: string | null;
	loadDepartments: () => Promise<void>;
	createDepartment: (data: {name: string; description?: string}) => Promise<void>;
	updateDepartment: (departmentId: string, data: {name: string; description?: string}) => Promise<void>;
	deleteDepartment: (departmentId: string) => Promise<void>;

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
	const [departments, setDepartments] = useState<Array<{_id: string; name: string; description?: string}>>([]);

	// Loading states
	const [loading, setLoading] = useState(false);
	const [appointmentsLoading, setAppointmentsLoading] = useState(false);
	const [doctorsLoading, setDoctorsLoading] = useState(false);
	const [patientsLoading, setPatientsLoading] = useState(false);
	const [feedbackLoading, setFeedbackLoading] = useState(false);
	const [notificationsLoading, setNotificationsLoading] = useState(false);
	const [departmentsLoading, setDepartmentsLoading] = useState(false);

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
	const [departmentsError, setDepartmentsError] = useState<string | null>(null);

	// Computed values
	const unreadNotifications = notifications.filter((n) => !n.read).length;

	// Action functions
	const loadDashboardStats = async () => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		
		console.log('📊 AdminContext - loadDashboardStats called with user:', {
			userId: userId,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin
		});

		if (!userId || (user.account_type !== 'hospital' && user.role !== 'admin')) {
			console.log('❌ AdminContext - Skipping dashboard stats load - invalid user or role');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log('🚀 AdminContext - Calling adminService.getDashboardStats with userId:', userId);
			const stats = await adminService.getDashboardStats(userId);
			console.log('✅ AdminContext - Received dashboard stats:', stats);
			setDashboardStats(stats);
		} catch (err) {
			console.error('❌ AdminContext - Error loading dashboard stats:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to load dashboard stats'
			);
		} finally {
			setLoading(false);
		}
	};	const loadAppointments = async () => {
		// Fix: Handle both _id and user_id properties, and check for both hospital and admin roles
		const userId = user?._id || user?.user_id;
		const userRole = user?.account_type || user?.role;
		
		console.log('📅 AdminContext - loadAppointments called with user:', {
			userId: userId,
			userRole: userRole,
			hasValidRole: userRole === 'hospital' || userRole === 'admin'
		});
		
		if (!userId || (userRole !== 'hospital' && userRole !== 'admin')) {
			console.log('❌ Skipping appointments load - user check failed');
			return;
		}

		setAppointmentsLoading(true);
		setAppointmentsError(null);

		try {
			console.log('📅 Calling adminService.getAllAppointments with userId:', userId);
			const appointmentsData = await adminService.getAllAppointments(userId);
			console.log('📅 Appointments data received:', appointmentsData);
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
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		
		console.log('👨‍⚕️ AdminContext - loadDoctors called with user:', {
			userId: userId,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin
		});

		if (!userId || (user.account_type !== 'hospital' && user.role !== 'admin')) {
			console.log('❌ AdminContext - Skipping doctors load - invalid user or role');
			return;
		}

		setDoctorsLoading(true);
		setDoctorsError(null);

		try {
			console.log('🚀 AdminContext - Calling adminService.getDoctors with userId:', userId);
			const doctorsData = await adminService.getDoctors(userId);
			console.log('✅ AdminContext - Received doctors data:', doctorsData);
			setDoctors(doctorsData);
		} catch (err) {
			console.error('❌ AdminContext - Error loading doctors:', err);
			setDoctorsError(
				err instanceof Error ? err.message : 'Failed to load doctors'
			);
		} finally {
			setDoctorsLoading(false);
		}
	};

	const loadPatients = async () => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		
		console.log('👥 AdminContext - loadPatients called with user:', {
			userId: userId,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin
		});

		if (!userId || (user.account_type !== 'hospital' && user.role !== 'admin')) {
			console.log('❌ AdminContext - Skipping patients load - invalid user or role');
			return;
		}

		setPatientsLoading(true);
		setPatientsError(null);

		try {
			console.log('🚀 AdminContext - Calling adminService.getPatients with userId:', userId);
			const patientsData = await adminService.getPatients(userId);
			console.log('✅ AdminContext - Received patients data:', patientsData);
			setPatients(patientsData);
		} catch (err) {
			console.error('❌ AdminContext - Error loading patients:', err);
			setPatientsError(
				err instanceof Error ? err.message : 'Failed to load patients'
			);
		} finally {
			setPatientsLoading(false);
		}
	};

	const loadFeedbackAnalytics = async () => {
		if (!user?._id || (user.account_type !== 'hospital' && user.role !== 'admin')) return;

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
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		if (!userId) return;

		try {
			await adminService.updateDoctor(doctorId, updates, userId);
			await loadDoctors();
		} catch (err) {
			throw err;
		}
	};

	const suspendDoctor = async (doctorId: string) => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		if (!userId) return;

		try {
			await adminService.suspendDoctor(doctorId, userId);
			await loadDoctors();
		} catch (err) {
			throw err;
		}
	};

	const unsuspendDoctor = async (doctorId: string) => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		if (!userId) return;

		try {
			await adminService.unsuspendDoctor(doctorId, userId);
			await loadDoctors();
		} catch (err) {
			throw err;
		}
	};

	const createDoctor = async (doctorData: Partial<Doctor>) => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		if (!userId) return;

		try {
			await adminService.createDoctor(doctorData, userId);
			await loadDoctors();
			await loadDashboardStats();
		} catch (err) {
			throw err;
		}
	};

	const deleteDoctor = async (doctorId: string) => {
		// Fix: Handle both _id and user_id properties
		const userId = user?._id || user?.user_id;
		if (!userId) return;

		try {
			await adminService.deleteDoctor(doctorId, userId);
			await loadDoctors();
			await loadDashboardStats();
		} catch (err) {
			throw err;
		}
	};

	// Patient actions
	const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
		if (!user?._id) return;

		try {
			await adminService.updatePatient(patientId, updates, user._id);
			await loadPatients();
		} catch (err) {
			throw err;
		}
	};

	const deletePatient = async (patientId: string) => {
		if (!user?._id) return;

		try {
			await adminService.deletePatient(patientId, user._id);
			await loadPatients();
			await loadDashboardStats();
		} catch (err) {
			throw err;
		}
	};

	const suspendPatient = async (patientId: string) => {
		if (!user?._id) return;

		try {
			await adminService.suspendPatient(patientId, user._id);
			await loadPatients();
		} catch (err) {
			throw err;
		}
	};

	const activatePatient = async (patientId: string) => {
		if (!user?._id) return;

		try {
			await adminService.activatePatient(patientId, user._id);
			await loadPatients();
		} catch (err) {
			throw err;
		}
	};

	// Department actions
	const loadDepartments = async () => {
		console.log('🏢 AdminContext - loadDepartments called');
		setDepartmentsLoading(true);
		setDepartmentsError(null);

		try {
			console.log('🚀 AdminContext - Calling adminService.getDepartments');
			const departmentsData = await adminService.getDepartments();
			console.log('✅ AdminContext - Received departments data:', departmentsData);
			setDepartments(departmentsData);
		} catch (err) {
			console.error('❌ AdminContext - Error loading departments:', err);
			setDepartmentsError(
				err instanceof Error ? err.message : 'Failed to load departments'
			);
		} finally {
			setDepartmentsLoading(false);
		}
	};

	const createDepartment = async (data: {name: string; description?: string}) => {
		try {
			await adminService.createDepartment(data);
			await loadDepartments();
		} catch (err) {
			throw err;
		}
	};

	const updateDepartment = async (departmentId: string, data: {name: string; description?: string}) => {
		try {
			await adminService.updateDepartment(departmentId, data);
			await loadDepartments();
		} catch (err) {
			throw err;
		}
	};

	const deleteDepartment = async (departmentId: string) => {
		try {
			await adminService.deleteDepartment(departmentId);
			await loadDepartments();
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
		console.log('🔄 AdminContext - useEffect triggered with user:', {
			hasUser: !!user,
			userId: user?._id,
			accountType: user?.account_type,
			role: user?.role,
			isAdmin: (user as any)?.isAdmin
		});

		if (user && (user.account_type === 'hospital' || user.role === 'admin')) {
			console.log('✅ AdminContext - Loading all admin data...');
			loadDashboardStats();
			loadAppointments();
			loadDoctors();
			loadPatients();
			loadFeedbackAnalytics();
			loadNotifications();
			loadDepartments();
		} else {
			console.log('❌ AdminContext - Not loading data - user not qualified');
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
		departments,

		// Loading states
		loading,
		appointmentsLoading,
		doctorsLoading,
		patientsLoading,
		feedbackLoading,
		notificationsLoading,
		departmentsLoading,

		// Error states
		error,
		appointmentsError,
		doctorsError,
		patientsError,
		feedbackError,
		notificationsError,
		departmentsError,

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
		createDoctor,
		updateDoctor,
		deleteDoctor,
		suspendDoctor,
		unsuspendDoctor,

		// Patient actions
		updatePatient,
		deletePatient,
		suspendPatient,
		activatePatient,

		// Department actions
		loadDepartments,
		createDepartment,
		updateDepartment,
		deleteDepartment,

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
