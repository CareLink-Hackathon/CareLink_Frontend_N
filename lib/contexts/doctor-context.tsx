'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
	doctorService,
	DoctorProfile,
	PatientRecord,
	Appointment,
	MedicalRecord,
	Notification,
	DashboardStats,
} from '@/lib/services/doctor-service';
import { useAuth } from '@/lib/auth-context';

// State interface
interface DoctorState {
	// Profile
	profile: DoctorProfile | null;

	// Dashboard
	dashboardStats: DashboardStats | null;

	// Appointments
	appointments: Appointment[];
	selectedAppointment: Appointment | null;
	appointmentsLoading: boolean;

	// Patients
	patients: PatientRecord[];
	selectedPatient: PatientRecord | null;
	patientsLoading: boolean;

	// Medical Records
	medicalRecords: MedicalRecord[];
	selectedRecord: MedicalRecord | null;
	recordsLoading: boolean;

	// Notifications
	notifications: Notification[];
	unreadNotifications: number;
	notificationsLoading: boolean;

	// UI State
	loading: boolean;
	error: string | null;
}

// Action types
type DoctorAction =
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'SET_ERROR'; payload: string | null }
	| { type: 'SET_PROFILE'; payload: DoctorProfile }
	| { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
	| { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
	| { type: 'SET_APPOINTMENTS_LOADING'; payload: boolean }
	| { type: 'SET_SELECTED_APPOINTMENT'; payload: Appointment | null }
	| { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
	| { type: 'SET_PATIENTS'; payload: PatientRecord[] }
	| { type: 'SET_PATIENTS_LOADING'; payload: boolean }
	| { type: 'SET_SELECTED_PATIENT'; payload: PatientRecord | null }
	| { type: 'UPDATE_PATIENT'; payload: PatientRecord }
	| { type: 'SET_MEDICAL_RECORDS'; payload: MedicalRecord[] }
	| { type: 'SET_RECORDS_LOADING'; payload: boolean }
	| { type: 'SET_SELECTED_RECORD'; payload: MedicalRecord | null }
	| { type: 'ADD_MEDICAL_RECORD'; payload: MedicalRecord }
	| { type: 'UPDATE_MEDICAL_RECORD'; payload: MedicalRecord }
	| { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
	| { type: 'SET_NOTIFICATIONS_LOADING'; payload: boolean }
	| { type: 'MARK_NOTIFICATION_READ'; payload: string }
	| { type: 'MARK_ALL_NOTIFICATIONS_READ' }
	| { type: 'RESET_STATE' };

// Initial state
const initialState: DoctorState = {
	profile: null,
	dashboardStats: null,
	appointments: [],
	selectedAppointment: null,
	appointmentsLoading: false,
	patients: [],
	selectedPatient: null,
	patientsLoading: false,
	medicalRecords: [],
	selectedRecord: null,
	recordsLoading: false,
	notifications: [],
	unreadNotifications: 0,
	notificationsLoading: false,
	loading: false,
	error: null,
};

// Reducer
function doctorReducer(state: DoctorState, action: DoctorAction): DoctorState {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, loading: action.payload };

		case 'SET_ERROR':
			return { ...state, error: action.payload, loading: false };

		case 'SET_PROFILE':
			return { ...state, profile: action.payload };

		case 'SET_DASHBOARD_STATS':
			return { ...state, dashboardStats: action.payload };

		case 'SET_APPOINTMENTS':
			return { ...state, appointments: action.payload };

		case 'SET_APPOINTMENTS_LOADING':
			return { ...state, appointmentsLoading: action.payload };

		case 'SET_SELECTED_APPOINTMENT':
			return { ...state, selectedAppointment: action.payload };

		case 'UPDATE_APPOINTMENT':
			return {
				...state,
				appointments: state.appointments.map((apt) =>
					apt._id === action.payload._id ? action.payload : apt
				),
				selectedAppointment:
					state.selectedAppointment?._id === action.payload._id
						? action.payload
						: state.selectedAppointment,
			};

		case 'SET_PATIENTS':
			return { ...state, patients: action.payload };

		case 'SET_PATIENTS_LOADING':
			return { ...state, patientsLoading: action.payload };

		case 'SET_SELECTED_PATIENT':
			return { ...state, selectedPatient: action.payload };

		case 'UPDATE_PATIENT':
			return {
				...state,
				patients: state.patients.map((patient) =>
					patient.id === action.payload.id ? action.payload : patient
				),
				selectedPatient:
					state.selectedPatient?.id === action.payload.id
						? action.payload
						: state.selectedPatient,
			};

		case 'SET_MEDICAL_RECORDS':
			return { ...state, medicalRecords: action.payload };

		case 'SET_RECORDS_LOADING':
			return { ...state, recordsLoading: action.payload };

		case 'SET_SELECTED_RECORD':
			return { ...state, selectedRecord: action.payload };

		case 'ADD_MEDICAL_RECORD':
			return {
				...state,
				medicalRecords: [action.payload, ...state.medicalRecords],
			};

		case 'UPDATE_MEDICAL_RECORD':
			return {
				...state,
				medicalRecords: state.medicalRecords.map((record) =>
					record.id === action.payload.id ? action.payload : record
				),
				selectedRecord:
					state.selectedRecord?.id === action.payload.id
						? action.payload
						: state.selectedRecord,
			};

		case 'SET_NOTIFICATIONS':
			const unreadCount = action.payload.filter((n) => !n.read).length;
			return {
				...state,
				notifications: action.payload,
				unreadNotifications: unreadCount,
			};

		case 'SET_NOTIFICATIONS_LOADING':
			return { ...state, notificationsLoading: action.payload };

		case 'MARK_NOTIFICATION_READ':
			const updatedNotifications = state.notifications.map((notification) =>
				notification.id === action.payload
					? { ...notification, read: true }
					: notification
			);
			const newUnreadCount = updatedNotifications.filter((n) => !n.read).length;
			return {
				...state,
				notifications: updatedNotifications,
				unreadNotifications: newUnreadCount,
			};

		case 'MARK_ALL_NOTIFICATIONS_READ':
			return {
				...state,
				notifications: state.notifications.map((notification) => ({
					...notification,
					read: true,
				})),
				unreadNotifications: 0,
			};

		case 'RESET_STATE':
			return initialState;

		default:
			return state;
	}
}

// Context interface
interface DoctorContextType {
	state: DoctorState;

	// Dashboard actions
	loadDashboardStats: () => Promise<void>;

	// Appointment actions
	loadAppointments: () => Promise<void>;
	selectAppointment: (appointment: Appointment | null) => void;
	updateAppointmentStatus: (
		appointmentId: string,
		status: string
	) => Promise<void>;
	acceptAppointment: (appointmentId: string) => Promise<void>;

	// Patient actions
	loadPatients: () => Promise<void>;
	selectPatient: (patient: PatientRecord | null) => void;
	updatePatientNotes: (patientId: string, notes: string) => Promise<void>;

	// Medical records actions
	loadMedicalRecords: (filters?: {
		patientId?: string;
		type?: string;
	}) => Promise<void>;
	selectRecord: (record: MedicalRecord | null) => void;
	createMedicalRecord: (record: Partial<MedicalRecord>) => Promise<void>;
	updateMedicalRecord: (
		recordId: string,
		updates: Partial<MedicalRecord>
	) => Promise<void>;

	// Notification actions
	loadNotifications: () => Promise<void>;
	markNotificationAsRead: (notificationId: string) => Promise<void>;
	markAllNotificationsAsRead: () => Promise<void>;

	// Utility actions
	clearError: () => void;
}

// Create context
const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

// Provider component
export function DoctorProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(doctorReducer, initialState);
	const { user } = useAuth();

	// Helper function to get doctor ID
	const getDoctorId = (): string => {
		if (!user || user.account_type !== 'doctor') {
			throw new Error('User is not a doctor or not authenticated');
		}
		return user._id;
	};

	// Dashboard actions
	const loadDashboardStats = async (): Promise<void> => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true });
			const doctorId = getDoctorId();
			const stats = await doctorService.getDashboardStats(doctorId);
			dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
		} catch (error) {
			console.error('Error loading dashboard stats:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to load dashboard statistics',
			});
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	};

	// Appointment actions
	const loadAppointments = async (): Promise<void> => {
		try {
			dispatch({ type: 'SET_APPOINTMENTS_LOADING', payload: true });
			const doctorId = getDoctorId();
			const appointments = await doctorService.getAppointments(doctorId);
			dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
		} catch (error) {
			console.error('Error loading appointments:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to load appointments' });
		} finally {
			dispatch({ type: 'SET_APPOINTMENTS_LOADING', payload: false });
		}
	};

	const selectAppointment = (appointment: Appointment | null): void => {
		dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: appointment });
	};

	const updateAppointmentStatus = async (
		appointmentId: string,
		status: string
	): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.updateAppointmentStatus(
				appointmentId,
				status,
				doctorId
			);

			// Update local state
			const updatedAppointment = state.appointments.find(
				(apt) => apt._id === appointmentId
			);
			if (updatedAppointment) {
				const updated = { ...updatedAppointment, status: status as any };
				dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
			}
		} catch (error) {
			console.error('Error updating appointment status:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to update appointment status',
			});
		}
	};

	const acceptAppointment = async (appointmentId: string): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.acceptAppointment(appointmentId, doctorId);

			// Update local state
			const updatedAppointment = state.appointments.find(
				(apt) => apt._id === appointmentId
			);
			if (updatedAppointment) {
				const updated = { ...updatedAppointment, status: 'scheduled' as any };
				dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
			}
		} catch (error) {
			console.error('Error accepting appointment:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to accept appointment' });
		}
	};

	// Patient actions
	const loadPatients = async (): Promise<void> => {
		try {
			dispatch({ type: 'SET_PATIENTS_LOADING', payload: true });
			const doctorId = getDoctorId();
			const patients = await doctorService.getPatients(doctorId);
			dispatch({ type: 'SET_PATIENTS', payload: patients });
		} catch (error) {
			console.error('Error loading patients:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to load patients' });
		} finally {
			dispatch({ type: 'SET_PATIENTS_LOADING', payload: false });
		}
	};

	const selectPatient = (patient: PatientRecord | null): void => {
		dispatch({ type: 'SET_SELECTED_PATIENT', payload: patient });
	};

	const updatePatientNotes = async (
		patientId: string,
		notes: string
	): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.updatePatientNotes(patientId, notes, doctorId);

			// Update local state
			const updatedPatient = state.patients.find(
				(patient) => patient.id === patientId
			);
			if (updatedPatient) {
				const updated = { ...updatedPatient, notes };
				dispatch({ type: 'UPDATE_PATIENT', payload: updated });
			}
		} catch (error) {
			console.error('Error updating patient notes:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to update patient notes',
			});
		}
	};

	// Medical records actions
	const loadMedicalRecords = async (filters?: {
		patientId?: string;
		type?: string;
	}): Promise<void> => {
		try {
			dispatch({ type: 'SET_RECORDS_LOADING', payload: true });
			const doctorId = getDoctorId();
			const records = await doctorService.getMedicalRecords(doctorId, filters);
			dispatch({ type: 'SET_MEDICAL_RECORDS', payload: records });
		} catch (error) {
			console.error('Error loading medical records:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to load medical records',
			});
		} finally {
			dispatch({ type: 'SET_RECORDS_LOADING', payload: false });
		}
	};

	const selectRecord = (record: MedicalRecord | null): void => {
		dispatch({ type: 'SET_SELECTED_RECORD', payload: record });
	};

	const createMedicalRecord = async (
		record: Partial<MedicalRecord>
	): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			const newRecord = await doctorService.createMedicalRecord(
				record,
				doctorId
			);
			dispatch({ type: 'ADD_MEDICAL_RECORD', payload: newRecord });
		} catch (error) {
			console.error('Error creating medical record:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to create medical record',
			});
		}
	};

	const updateMedicalRecord = async (
		recordId: string,
		updates: Partial<MedicalRecord>
	): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.updateMedicalRecord(recordId, updates, doctorId);

			// Update local state
			const updatedRecord = state.medicalRecords.find(
				(record) => record.id === recordId
			);
			if (updatedRecord) {
				const updated = { ...updatedRecord, ...updates };
				dispatch({ type: 'UPDATE_MEDICAL_RECORD', payload: updated });
			}
		} catch (error) {
			console.error('Error updating medical record:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to update medical record',
			});
		}
	};

	// Notification actions
	const loadNotifications = async (): Promise<void> => {
		try {
			dispatch({ type: 'SET_NOTIFICATIONS_LOADING', payload: true });
			const doctorId = getDoctorId();
			const notifications = await doctorService.getNotifications(doctorId);
			dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
		} catch (error) {
			console.error('Error loading notifications:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to load notifications' });
		} finally {
			dispatch({ type: 'SET_NOTIFICATIONS_LOADING', payload: false });
		}
	};

	const markNotificationAsRead = async (
		notificationId: string
	): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.markNotificationAsRead(notificationId, doctorId);
			dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
		} catch (error) {
			console.error('Error marking notification as read:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to mark notification as read',
			});
		}
	};

	const markAllNotificationsAsRead = async (): Promise<void> => {
		try {
			const doctorId = getDoctorId();
			await doctorService.markAllNotificationsAsRead(doctorId);
			dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
			dispatch({
				type: 'SET_ERROR',
				payload: 'Failed to mark all notifications as read',
			});
		}
	};

	// Utility actions
	const clearError = (): void => {
		dispatch({ type: 'SET_ERROR', payload: null });
	};

	// Set profile when user changes
	useEffect(() => {
		if (user && user.account_type === 'doctor') {
			// Convert User to DoctorProfile with safe fallbacks
			const doctorProfile: DoctorProfile = {
				_id: user._id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				phone_number: user.phone_number,
				specialization: user.specialty,
				account_type: 'doctor',
				created_at: user.created_at || new Date().toISOString(),
				token: (user as any).token || '', // Token might be added during login
				license_number: (user as any).license_number,
				years_of_experience: (user as any).years_of_experience,
				hospital_affiliation:
					(user as any).hospital_affiliation || user.hospital_name,
			};
			dispatch({ type: 'SET_PROFILE', payload: doctorProfile });
		} else {
			dispatch({ type: 'RESET_STATE' });
		}
	}, [user]);

	// Auto-load initial data when doctor logs in
	useEffect(() => {
		if (user && user.account_type === 'doctor') {
			loadDashboardStats();
			loadAppointments();
			loadPatients();
			loadNotifications();
		}
	}, [user]);

	const contextValue: DoctorContextType = {
		state,
		loadDashboardStats,
		loadAppointments,
		selectAppointment,
		updateAppointmentStatus,
		acceptAppointment,
		loadPatients,
		selectPatient,
		updatePatientNotes,
		loadMedicalRecords,
		selectRecord,
		createMedicalRecord,
		updateMedicalRecord,
		loadNotifications,
		markNotificationAsRead,
		markAllNotificationsAsRead,
		clearError,
	};

	return (
		<DoctorContext.Provider value={contextValue}>
			{children}
		</DoctorContext.Provider>
	);
}

// Custom hook
export function useDoctor(): DoctorContextType {
	const context = useContext(DoctorContext);
	if (context === undefined) {
		throw new Error('useDoctor must be used within a DoctorProvider');
	}
	return context;
}
