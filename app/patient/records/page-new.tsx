'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Activity,
	Calendar,
	Star,
	FileText,
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Search,
	Bot,
	Download,
	Eye,
	Filter,
	Plus,
	Heart,
	Pill,
	TestTube,
	Stethoscope,
	Calendar as CalendarIcon,
	User,
	ChevronRight,
	X,
} from 'lucide-react';

export default function PatientMedicalRecords() {
	const router = useRouter();
	const [filter, setFilter] = useState('all');
	const [selectedRecord, setSelectedRecord] = useState<any>(null);

	// User info for responsive layout
	const userInfo = {
		name: 'JOHN DOE',
		fallback: 'JD',
		role: 'Patient',
		id: 'P001',
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
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	const medicalRecords = [
		{
			id: 1,
			type: 'consultation',
			title: 'Cardiology Consultation',
			doctor: 'Dr. Sarah Johnson',
			date: '2025-01-20',
			status: 'completed',
			description: 'Regular cardiovascular checkup and ECG',
			diagnosis: 'Normal heart rhythm, slight elevation in blood pressure',
			medications: ['Lisinopril 10mg', 'Aspirin 81mg'],
			attachments: ['ECG_report.pdf', 'blood_pressure_chart.png'],
			vitals: {
				bloodPressure: '135/85',
				heartRate: '72 bpm',
				temperature: '98.6°F',
				weight: '165 lbs',
			},
		},
		{
			id: 2,
			type: 'lab',
			title: 'Blood Test Results',
			doctor: 'Dr. Michael Chen',
			date: '2025-01-15',
			status: 'completed',
			description: 'Comprehensive metabolic panel and lipid profile',
			diagnosis: 'Cholesterol levels slightly elevated, otherwise normal',
			medications: ['Atorvastatin 20mg'],
			attachments: ['lab_results_detailed.pdf'],
			results: {
				'Total Cholesterol': '220 mg/dL',
				HDL: '45 mg/dL',
				LDL: '150 mg/dL',
				Triglycerides: '180 mg/dL',
				Glucose: '95 mg/dL',
			},
		},
		{
			id: 3,
			type: 'imaging',
			title: 'Chest X-Ray',
			doctor: 'Dr. Emily Davis',
			date: '2025-01-10',
			status: 'completed',
			description: 'Routine chest X-ray for annual physical',
			diagnosis: 'Clear lungs, no abnormalities detected',
			attachments: ['chest_xray.dcm', 'radiology_report.pdf'],
		},
		{
			id: 4,
			type: 'prescription',
			title: 'Medication Refill',
			doctor: 'Dr. Sarah Johnson',
			date: '2025-01-05',
			status: 'active',
			description: 'Monthly medication refill for hypertension',
			medications: [
				'Lisinopril 10mg - 30 tablets',
				'Aspirin 81mg - 30 tablets',
			],
		},
		{
			id: 5,
			type: 'vaccination',
			title: 'Annual Flu Shot',
			doctor: 'Nurse Practitioner Johnson',
			date: '2024-12-15',
			status: 'completed',
			description: 'Annual influenza vaccination',
			vaccine: 'Influenza Vaccine (Quadrivalent)',
			lotNumber: 'FL2024-456',
		},
	];

	const getRecordIcon = (type: string) => {
		switch (type) {
			case 'consultation':
				return <Stethoscope className="w-5 h-5" />;
			case 'lab':
				return <TestTube className="w-5 h-5" />;
			case 'imaging':
				return <Eye className="w-5 h-5" />;
			case 'prescription':
				return <Pill className="w-5 h-5" />;
			case 'vaccination':
				return <Heart className="w-5 h-5" />;
			default:
				return <FileText className="w-5 h-5" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'active':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const filteredRecords = medicalRecords.filter((record) => {
		if (filter === 'all') return true;
		return record.type === filter;
	});

	return (
		<ResponsiveDashboardLayout
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={true}
			onSearch={(query) => console.log('Search:', query)}
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

					<Button
						onClick={() => router.push('/patient/chatbot')}
						className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
					>
						<Bot className="w-4 h-4 mr-2" />
						<span>AI Assistant</span>
					</Button>
				</div>

				{/* Filter Tabs - Mobile responsive */}
				<Tabs value={filter} onValueChange={setFilter} className="w-full">
					<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
						<TabsTrigger value="all" className="text-xs sm:text-sm">
							All
						</TabsTrigger>
						<TabsTrigger value="consultation" className="text-xs sm:text-sm">
							Consults
						</TabsTrigger>
						<TabsTrigger value="lab" className="text-xs sm:text-sm">
							Labs
						</TabsTrigger>
						<TabsTrigger
							value="imaging"
							className="text-xs sm:text-sm hidden lg:flex"
						>
							Imaging
						</TabsTrigger>
						<TabsTrigger
							value="prescription"
							className="text-xs sm:text-sm hidden lg:flex"
						>
							Meds
						</TabsTrigger>
						<TabsTrigger
							value="vaccination"
							className="text-xs sm:text-sm hidden lg:flex"
						>
							Vaccines
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Records List - Mobile optimized */}
				<div className="space-y-4">
					{filteredRecords.map((record) => (
						<Card
							key={record.id}
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() =>
								setSelectedRecord(
									selectedRecord?.id === record.id ? null : record
								)
							}
						>
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-start space-x-3 min-w-0 flex-1">
										<div
											className={`p-2 rounded-lg ${getStatusColor(
												record.status
											)} flex-shrink-0`}
										>
											{getRecordIcon(record.type)}
										</div>
										<div className="min-w-0 flex-1">
											<h3 className="font-semibold text-sm sm:text-base truncate">
												{record.title}
											</h3>
											<p className="text-xs sm:text-sm text-gray-600">
												{record.doctor}
											</p>
											<p className="text-xs text-gray-500">{record.date}</p>
											{record.description && (
												<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
													{record.description}
												</p>
											)}
										</div>
									</div>

									<div className="flex flex-col items-end space-y-2 flex-shrink-0">
										<Badge
											className={`text-xs ${getStatusColor(record.status)}`}
										>
											{record.status}
										</Badge>
										<div className="flex space-x-1">
											<Button
												variant="ghost"
												size="icon"
												className="w-6 h-6 sm:w-8 sm:h-8"
											>
												<Eye className="w-3 h-3 sm:w-4 sm:h-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="w-6 h-6 sm:w-8 sm:h-8"
											>
												<Download className="w-3 h-3 sm:w-4 sm:h-4" />
											</Button>
										</div>
									</div>
								</div>

								{/* Expanded Details - Mobile responsive */}
								{selectedRecord?.id === record.id && (
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

										{record.vitals && (
											<div>
												<span className="text-gray-500 text-xs sm:text-sm font-medium">
													Vitals:
												</span>
												<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
													{Object.entries(record.vitals).map(([key, value]) => (
														<div
															key={key}
															className="bg-gray-50 p-2 rounded text-center"
														>
															<p className="text-xs text-gray-600">{key}</p>
															<p className="text-xs sm:text-sm font-medium">
																{String(value)}
															</p>
														</div>
													))}
												</div>
											</div>
										)}

										{record.results && (
											<div>
												<span className="text-gray-500 text-xs sm:text-sm font-medium">
													Lab Results:
												</span>
												<div className="space-y-2 mt-2">
													{Object.entries(record.results).map(
														([key, value]) => (
															<div
																key={key}
																className="flex justify-between text-xs sm:text-sm"
															>
																<span className="text-gray-600">{key}:</span>
																<span className="font-medium">
																	{String(value)}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}

										{record.medications && (
											<div>
												<span className="text-gray-500 text-xs sm:text-sm font-medium">
													Medications:
												</span>
												<div className="space-y-2 mt-2">
													{record.medications.map(
														(med: string, index: number) => (
															<div
																key={index}
																className="flex items-center space-x-2"
															>
																<Pill className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
																<span className="text-xs sm:text-sm">
																	{med}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}

										{record.vaccine && (
											<div>
												<span className="text-gray-500 text-xs sm:text-sm font-medium">
													Vaccine:
												</span>
												<p className="text-xs sm:text-sm mt-1">
													{record.vaccine}
												</p>
												{record.lotNumber && (
													<p className="text-xs text-gray-500 mt-1">
														Lot: {record.lotNumber}
													</p>
												)}
											</div>
										)}

										{record.attachments && (
											<div>
												<span className="text-gray-500 text-xs sm:text-sm font-medium">
													Attachments:
												</span>
												<div className="space-y-2 mt-2">
													{record.attachments.map(
														(attachment: string, index: number) => (
															<div
																key={index}
																className="flex items-center justify-between p-2 bg-gray-50 rounded"
															>
																<div className="flex items-center space-x-2 min-w-0 flex-1">
																	<FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
																	<span className="text-xs sm:text-sm truncate">
																		{attachment}
																	</span>
																</div>
																<Button
																	variant="ghost"
																	size="icon"
																	className="w-6 h-6 flex-shrink-0"
																>
																	<Download className="w-3 h-3" />
																</Button>
															</div>
														)
													)}
												</div>
											</div>
										)}
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
							No records found
						</h3>
						<p className="text-sm text-gray-400">
							No medical records match your current filter.
						</p>
					</div>
				)}
			</div>
		</ResponsiveDashboardLayout>
	);
}
