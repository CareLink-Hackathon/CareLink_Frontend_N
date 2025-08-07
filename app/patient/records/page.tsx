'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth-context';
import { patientService } from '@/lib/services/patient-service';
import {
	Activity,
	Calendar,
	Star,
	FileText,
	Bell,
	Settings,
	HelpCircle,
	Search,
	Bot,
	Download,
	Eye,
	Heart,
	Pill,
	TestTube,
	Stethoscope,
	User,
	RefreshCw,
	AlertTriangle,
	Calendar as CalendarIcon,
} from 'lucide-react';

// Interface for medical record
interface MedicalRecord {
	_id: string;
	patient_id: string;
	doctor_id: string;
	record_type: 'consultation' | 'diagnosis' | 'prescription' | 'laboratory' | 'imaging';
	title: string;
	chief_complaint: string;
	history_of_present_illness: string;
	physical_examination: string;
	diagnosis: string;
	treatment_plan: string;
	medications?: Array<{
		name: string;
		dosage: string;
		frequency: string;
		duration: string;
		instructions?: string;
	}>;
	follow_up_instructions: string;
	notes?: string;
	vital_signs?: {
		blood_pressure?: string;
		heart_rate?: string;
		temperature?: string;
		weight?: string;
		height?: string;
		respiratory_rate?: string;
		oxygen_saturation?: string;
	};
	lab_results?: Array<{
		test_name: string;
		result: string;
		reference_range?: string;
		status: 'normal' | 'abnormal' | 'critical';
	}>;
	created_at: string;
	updated_at?: string;
}

export default function PatientMedicalRecords() {
	const router = useRouter();
	const { user } = useAuth();
	const [filter, setFilter] = useState('all');
	const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
	const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Get patient ID from user
	const getPatientId = () => {
		return user?.user_id || user?._id || (user as any)?.id;
	};

	// User info for responsive layout
	const userInfo = {
		name: user ? `${(user.first_name || '').toUpperCase()} ${(user.last_name || '').toUpperCase()}` : 'Patient',
		fallback: user ? `${(user.first_name || 'P')[0]}${(user.last_name || 'T')[0]}` : 'PT',
		role: 'Patient',
		id: user ? `Patient ID: ${(user.user_id || user._id || '').slice(-6)}` : 'Loading...',
	};

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{
			icon: FileText,
			label: 'Medical Records',
			href: '/patient/records',
			active: true,
		},
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	// Load medical records
	const loadMedicalRecords = async () => {
		const patientId = getPatientId();
		if (!patientId) {
			console.warn('No patient ID found');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log('Loading medical records for patient:', patientId);
			const records = await patientService.getMedicalRecords(patientId);
			setMedicalRecords(records);

		} catch (error) {
			console.error('Error loading medical records:', error);
			setError('Failed to load medical records');
		} finally {
			setLoading(false);
		}
	};

	// Load data on component mount
	useEffect(() => {
		if (user?.role === 'patient') {
			loadMedicalRecords();
		} else {
			setLoading(false);
		}
	}, [user]);

	// Get record icon based on type
	const getRecordIcon = (type: string) => {
		switch (type) {
			case 'consultation':
				return <Stethoscope className="w-5 h-5" />;
			case 'laboratory':
				return <TestTube className="w-5 h-5" />;
			case 'imaging':
				return <Eye className="w-5 h-5" />;
			case 'prescription':
				return <Pill className="w-5 h-5" />;
			case 'diagnosis':
				return <Heart className="w-5 h-5" />;
			default:
				return <FileText className="w-5 h-5" />;
		}
	};

	// Get status color (all records are completed since they exist)
	const getStatusColor = () => {
		return 'bg-green-100 text-green-800 border-green-200';
	};

	// Handle PDF download
	const handleDownloadPDF = async (recordId: string) => {
		try {
			setError(null);
			await patientService.downloadMedicalRecordPDF(recordId);
			
			// Show success feedback
			const tempSuccessDiv = document.createElement('div');
			tempSuccessDiv.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300';
			tempSuccessDiv.innerHTML = `
				<div class="flex items-center space-x-2">
					<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
					</svg>
					<span class="font-medium">PDF downloaded successfully!</span>
				</div>
			`;
			document.body.appendChild(tempSuccessDiv);
			
			setTimeout(() => {
				if (document.body.contains(tempSuccessDiv)) {
					tempSuccessDiv.style.opacity = '0';
					setTimeout(() => {
						if (document.body.contains(tempSuccessDiv)) {
							document.body.removeChild(tempSuccessDiv);
						}
					}, 300);
				}
			}, 3000);
			
		} catch (error) {
			setError(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	// Filter records based on search and type
	const filteredRecords = medicalRecords.filter((record) => {
		const matchesFilter = filter === 'all' || record.record_type === filter;
		const matchesSearch = 
			record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	// Format date for display
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	};

	// Format date and time for display
	const formatDateTime = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateString;
		}
	};

	// Loading state
	if (loading) {
		return (
			<ProtectedRoute allowedRoles={['patient']}>
				<ResponsiveDashboardLayout
					userInfo={userInfo}
					sidebarItems={sidebarItems}
					pageTitle="Medical Records"
				>
					<div className="flex items-center justify-center h-64">
						<RefreshCw className="w-8 h-8 animate-spin mr-2" />
						<span>Loading medical records...</span>
					</div>
				</ResponsiveDashboardLayout>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute allowedRoles={['patient']}>
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				pageTitle="Medical Records"
			>
				<div className="space-y-4 sm:space-y-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
								Medical Records
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Access your complete medical history
							</p>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={loadMedicalRecords}
								variant="outline"
								size="sm"
								className="flex items-center gap-2"
								disabled={loading}
							>
								<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								Refresh
							</Button>
							<Button
								onClick={() => router.push('/patient/chatbot')}
								className="bg-blue-600 hover:bg-blue-700 text-white"
								size="sm"
							>
								<Bot className="w-4 h-4 mr-2" />
								AI Assistant
							</Button>
						</div>
					</div>

					{/* Search Section */}
					<div className="mb-6">
						<div className="relative max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search medical records..."
								className="pl-10 border-gray-300"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Records</p>
										<p className="text-2xl font-bold">{medicalRecords.length}</p>
									</div>
									<FileText className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Consultations</p>
										<p className="text-2xl font-bold text-green-600">
											{medicalRecords.filter(r => r.record_type === 'consultation').length}
										</p>
									</div>
									<Stethoscope className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Lab Results</p>
										<p className="text-2xl font-bold text-orange-600">
											{medicalRecords.filter(r => r.record_type === 'laboratory').length}
										</p>
									</div>
									<TestTube className="w-8 h-8 text-orange-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Error Message */}
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
							{error}
						</div>
					)}

					{/* Filter Tabs */}
					<Tabs value={filter} onValueChange={setFilter} className="w-full">
						<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
							<TabsTrigger value="all" className="text-xs sm:text-sm">
								All
							</TabsTrigger>
							<TabsTrigger value="consultation" className="text-xs sm:text-sm">
								Consults
							</TabsTrigger>
							<TabsTrigger value="laboratory" className="text-xs sm:text-sm">
								Labs
							</TabsTrigger>
							<TabsTrigger value="imaging" className="text-xs sm:text-sm hidden lg:flex">
								Imaging
							</TabsTrigger>
							<TabsTrigger value="prescription" className="text-xs sm:text-sm hidden lg:flex">
								Meds
							</TabsTrigger>
							<TabsTrigger value="diagnosis" className="text-xs sm:text-sm hidden lg:flex">
								Diagnosis
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Records List */}
					<div className="space-y-4">
						{filteredRecords.map((record) => (
							<Card
								key={record._id}
								className="hover:shadow-lg transition-shadow cursor-pointer"
								onClick={() =>
									setSelectedRecord(
										selectedRecord?._id === record._id ? null : record
									)
								}
							>
								<CardContent className="p-4 sm:p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start space-x-3 min-w-0 flex-1">
											<div className={`p-2 rounded-lg ${getStatusColor()} flex-shrink-0`}>
												{getRecordIcon(record.record_type)}
											</div>
											<div className="min-w-0 flex-1">
												<h3 className="font-semibold text-sm sm:text-base truncate">
													{record.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600">
													Record Type: {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1)}
												</p>
												<p className="text-xs text-gray-500">
													{formatDate(record.created_at)}
												</p>
												{record.chief_complaint && (
													<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
														{record.chief_complaint}
													</p>
												)}
											</div>
										</div>

										<div className="flex flex-col items-end space-y-2 flex-shrink-0">
											<Badge className={`text-xs ${getStatusColor()}`}>
												Completed
											</Badge>
											<div className="flex space-x-1">
												<Button
													variant="ghost"
													size="icon"
													className="w-6 h-6 sm:w-8 sm:h-8"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedRecord(selectedRecord?._id === record._id ? null : record);
													}}
												>
													<Eye className="w-3 h-3 sm:w-4 sm:h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="w-6 h-6 sm:w-8 sm:h-8"
													onClick={(e) => {
														e.stopPropagation();
														handleDownloadPDF(record._id);
													}}
												>
													<Download className="w-3 h-3 sm:w-4 sm:h-4" />
												</Button>
											</div>
										</div>
									</div>

									{/* Expanded Details */}
									{selectedRecord?._id === record._id && (
										<div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
											{record.diagnosis && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Diagnosis:
													</span>
													<p className="text-xs sm:text-sm mt-1">
														{record.diagnosis}
													</p>
												</div>
											)}

											{record.vital_signs && Object.keys(record.vital_signs).length > 0 && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Vital Signs:
													</span>
													<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
														{Object.entries(record.vital_signs).map(([key, value]) => (
															value && (
																<div key={key} className="bg-gray-50 p-2 rounded text-center">
																	<p className="text-xs text-gray-600 capitalize">
																		{key.replace(/_/g, ' ')}
																	</p>
																	<p className="text-xs sm:text-sm font-medium">
																		{value}
																	</p>
																</div>
															)
														))}
													</div>
												</div>
											)}

											{record.lab_results && record.lab_results.length > 0 && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Lab Results:
													</span>
													<div className="space-y-2 mt-2">
														{record.lab_results.map((lab, index) => (
															<div key={index} className="flex justify-between text-xs sm:text-sm">
																<span className="text-gray-600">{lab.test_name}:</span>
																<span className={`font-medium ${
																	lab.status === 'critical' ? 'text-red-600' :
																	lab.status === 'abnormal' ? 'text-yellow-600' :
																	'text-green-600'
																}`}>
																	{lab.result} ({lab.status})
																</span>
															</div>
														))}
													</div>
												</div>
											)}

											{record.medications && record.medications.length > 0 && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Medications:
													</span>
													<div className="space-y-2 mt-2">
														{record.medications.map((med, index) => (
															<div key={index} className="flex items-center space-x-2">
																<Pill className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
																<span className="text-xs sm:text-sm">
																	{med.name} - {med.dosage} ({med.frequency})
																</span>
															</div>
														))}
													</div>
												</div>
											)}

											{record.treatment_plan && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Treatment Plan:
													</span>
													<p className="text-xs sm:text-sm mt-1">
														{record.treatment_plan}
													</p>
												</div>
											)}

											{record.follow_up_instructions && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Follow-up Instructions:
													</span>
													<p className="text-xs sm:text-sm mt-1">
														{record.follow_up_instructions}
													</p>
												</div>
											)}

											{record.notes && (
												<div>
													<span className="text-gray-500 text-xs sm:text-sm font-medium">
														Additional Notes:
													</span>
													<p className="text-xs sm:text-sm mt-1">
														{record.notes}
													</p>
												</div>
											)}

											<div className="mt-4 pt-2 border-t border-gray-100">
												<p className="text-xs text-gray-400">
													Created: {formatDateTime(record.created_at)}
												</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					{/* Empty State */}
					{filteredRecords.length === 0 && (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-base sm:text-lg font-semibold text-gray-500 mb-2">
								{medicalRecords.length === 0 ? 'No Medical Records' : 'No Records Match Filter'}
							</h3>
							<p className="text-sm text-gray-400">
								{medicalRecords.length === 0 
									? 'You don\'t have any medical records yet. Visit a doctor to create your first record.'
									: 'No medical records match your current search and filter criteria.'}
							</p>
							{searchTerm && (
								<Button
									variant="outline"
									onClick={() => setSearchTerm('')}
									className="mt-4"
								>
									Clear Search
								</Button>
							)}
						</div>
					)}
				</div>
			</ResponsiveDashboardLayout>
		</ProtectedRoute>
	);
}
