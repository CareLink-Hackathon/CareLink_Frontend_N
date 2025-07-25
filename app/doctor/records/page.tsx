'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Search,
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Calendar,
	Users,
	Activity,
	FileText,
	Filter,
	Eye,
	Download,
	Upload,
	Plus,
	Edit,
	Trash2,
	Image,
	File,
	Stethoscope,
	Heart,
	Brain,
	Clipboard,
} from 'lucide-react';

export default function DoctorRecords() {
	const router = useRouter();
	const [selectedRecord, setSelectedRecord] = useState<any>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('all');

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/doctor/dashboard' },
		{ icon: Calendar, label: 'My Appointments', href: '/doctor/appointments' },
		{ icon: Users, label: 'My Patients', href: '/doctor/patients' },
		{
			icon: FileText,
			label: 'Medical Records',
			href: '/doctor/records',
			active: true,
		},
		{
			icon: Bell,
			label: 'Notifications',
			href: '/doctor/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
	];

	const medicalRecords = [
		{
			id: 1,
			patientName: 'John Doe',
			patientId: 'P001',
			recordType: 'Lab Results',
			title: 'Complete Blood Count & Lipid Panel',
			date: '2025-01-27',
			status: 'completed',
			priority: 'normal',
			category: 'laboratory',
			description:
				'Routine blood work including CBC, lipid panel, and glucose levels',
			results: {
				hemoglobin: '14.2 g/dL (Normal)',
				whiteBloodCells: '6,800/μL (Normal)',
				platelets: '285,000/μL (Normal)',
				glucose: '98 mg/dL (Normal)',
				cholesterol: '195 mg/dL (Borderline)',
				ldl: '125 mg/dL (Borderline)',
				hdl: '45 mg/dL (Low)',
				triglycerides: '165 mg/dL (Normal)',
			},
			attachments: [
				{ name: 'lab_results_20250127.pdf', type: 'pdf', size: '2.4 MB' },
				{ name: 'blood_work_chart.png', type: 'png', size: '1.2 MB' },
			],
			notes:
				'HDL cholesterol is slightly low. Recommend dietary changes and follow-up in 3 months.',
		},
		{
			id: 2,
			patientName: 'Jane Smith',
			patientId: 'P002',
			recordType: 'Imaging',
			title: 'Chest X-Ray - Routine Screening',
			date: '2025-01-25',
			status: 'completed',
			priority: 'normal',
			category: 'imaging',
			description: 'Annual chest X-ray for asthma monitoring',
			results: {
				findings: 'Clear lung fields bilaterally',
				impression: 'No acute cardiopulmonary abnormalities',
				recommendation: 'Continue current asthma management',
			},
			attachments: [
				{ name: 'chest_xray_20250125.dcm', type: 'dcm', size: '45.2 MB' },
				{ name: 'radiology_report.pdf', type: 'pdf', size: '890 KB' },
			],
			notes:
				'Excellent response to current asthma treatment. No changes needed.',
		},
		{
			id: 3,
			patientName: 'Bob Wilson',
			patientId: 'P003',
			recordType: 'Cardiac Study',
			title: 'Echocardiogram - Post-MI Follow-up',
			date: '2025-01-20',
			status: 'completed',
			priority: 'high',
			category: 'cardiology',
			description:
				'Follow-up echocardiogram after recent myocardial infarction',
			results: {
				ejectionFraction: '45% (Mildly reduced)',
				wallMotion: 'Hypokinesis of anterior wall',
				valves: 'Mild mitral regurgitation',
				recommendation: 'Continue cardiac rehabilitation, optimize medications',
			},
			attachments: [
				{ name: 'echo_report_20250120.pdf', type: 'pdf', size: '3.2 MB' },
				{ name: 'echo_images.zip', type: 'zip', size: '125 MB' },
			],
			notes:
				'EF improvement from 40% to 45%. Patient responding well to treatment. Continue ACE inhibitor and beta-blocker.',
		},
		{
			id: 4,
			patientName: 'Alice Brown',
			patientId: 'P004',
			recordType: 'Consultation',
			title: 'Neurology Consultation - Migraine Management',
			date: '2025-01-15',
			status: 'completed',
			priority: 'normal',
			category: 'consultation',
			description: 'Specialist consultation for chronic migraine management',
			results: {
				assessment: 'Chronic migraine with medication overuse',
				plan: 'Discontinue overused medications, start preventive therapy',
				followUp: '4 weeks',
			},
			attachments: [
				{ name: 'neuro_consult_20250115.pdf', type: 'pdf', size: '1.8 MB' },
			],
			notes:
				'Patient education provided on medication overuse headache. Started on topiramate for prevention.',
		},
		{
			id: 5,
			patientName: 'John Doe',
			patientId: 'P001',
			recordType: 'Procedure',
			title: 'Cardiac Catheterization',
			date: '2025-01-10',
			status: 'completed',
			priority: 'high',
			category: 'procedure',
			description: 'Diagnostic cardiac catheterization to evaluate chest pain',
			results: {
				findings: '70% stenosis in LAD, 40% stenosis in RCA',
				intervention: 'PCI with DES to LAD',
				outcome: 'Successful revascularization',
			},
			attachments: [
				{ name: 'cath_report_20250110.pdf', type: 'pdf', size: '4.1 MB' },
				{ name: 'angiogram_images.zip', type: 'zip', size: '89 MB' },
			],
			notes:
				'Successful PCI. Patient doing well post-procedure. Continue dual antiplatelet therapy.',
		},
	];

	const filteredRecords = medicalRecords.filter((record) => {
		const matchesSearch =
			record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = filterType === 'all' || record.category === filterType;
		return matchesSearch && matchesType;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'in-progress':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'normal':
				return 'bg-gray-100 text-gray-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'laboratory':
				return <FileText className="w-4 h-4" />;
			case 'imaging':
				return <Image className="w-4 h-4" />;
			case 'cardiology':
				return <Heart className="w-4 h-4" />;
			case 'consultation':
				return <Stethoscope className="w-4 h-4" />;
			case 'procedure':
				return <Activity className="w-4 h-4" />;
			default:
				return <Clipboard className="w-4 h-4" />;
		}
	};

	const getFileIcon = (type: string) => {
		switch (type) {
			case 'pdf':
				return <FileText className="w-4 h-4 text-red-500" />;
			case 'png':
			case 'jpg':
			case 'jpeg':
				return <Image className="w-4 h-4 text-green-500" />;
			case 'dcm':
				return <File className="w-4 h-4 text-blue-500" />;
			case 'zip':
				return <File className="w-4 h-4 text-purple-500" />;
			default:
				return <File className="w-4 h-4 text-gray-500" />;
		}
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>SJ</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">DR. SARAH JOHNSON</h3>
							<p className="text-blue-100 text-sm">Cardiologist</p>
						</div>
					</div>

					<nav className="space-y-2">
						{sidebarItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
									item.active
										? 'bg-white text-blue-600'
										: 'text-white hover:bg-blue-500'
								}`}
							>
								<item.icon className="w-5 h-5" />
								<span className="flex-1">{item.label}</span>
								{item.badge && (
									<Badge className="bg-red-500 text-white text-xs">
										{item.badge}
									</Badge>
								)}
							</Link>
						))}
					</nav>
				</div>

				<div className="absolute bottom-6 left-6">
					<Button
						variant="ghost"
						className="text-white hover:bg-blue-500 w-full justify-start"
						onClick={() => router.push('/login')}
					>
						<LogOut className="w-5 h-5 mr-3" />
						Sign-out
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="bg-white border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900">
								Medical Records
							</h1>
							<Badge className="bg-blue-100 text-blue-800">
								{filteredRecords.length} Records
							</Badge>
						</div>
						<div className="flex items-center space-x-4">
							<Dialog>
								<DialogTrigger asChild>
									<Button className="bg-blue-600 hover:bg-blue-700">
										<Plus className="w-4 h-4 mr-2" />
										New Record
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-4xl">
									<DialogHeader>
										<DialogTitle className="text-xl">
											Create New Medical Record
										</DialogTitle>
									</DialogHeader>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="patientSelect">Patient</Label>
												<Select>
													<SelectTrigger id="patientSelect">
														<SelectValue placeholder="Select a patient" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="P001">
															John Doe (P001)
														</SelectItem>
														<SelectItem value="P002">
															Jane Smith (P002)
														</SelectItem>
														<SelectItem value="P003">
															Bob Wilson (P003)
														</SelectItem>
														<SelectItem value="P004">
															Alice Brown (P004)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="recordType">Record Type</Label>
												<Select>
													<SelectTrigger id="recordType">
														<SelectValue placeholder="Select record type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="labResults">
															Lab Results
														</SelectItem>
														<SelectItem value="imaging">Imaging</SelectItem>
														<SelectItem value="cardiacStudy">
															Cardiac Study
														</SelectItem>
														<SelectItem value="consultation">
															Consultation
														</SelectItem>
														<SelectItem value="procedure">Procedure</SelectItem>
														<SelectItem value="diagnosis">Diagnosis</SelectItem>
														<SelectItem value="prescription">
															Prescription
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="recordTitle">Title</Label>
												<Input id="recordTitle" placeholder="Record title" />
											</div>

											<div className="space-y-2">
												<Label htmlFor="recordDate">Date</Label>
												<Input id="recordDate" type="date" />
											</div>

											<div className="space-y-2">
												<Label htmlFor="priority">Priority</Label>
												<Select>
													<SelectTrigger id="priority">
														<SelectValue placeholder="Select priority" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="low">Low</SelectItem>
														<SelectItem value="normal">Normal</SelectItem>
														<SelectItem value="high">High</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="status">Status</Label>
												<Select>
													<SelectTrigger id="status">
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="pending">Pending</SelectItem>
														<SelectItem value="in-progress">
															In Progress
														</SelectItem>
														<SelectItem value="completed">Completed</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="recordDescription">Description</Label>
												<Textarea
													id="recordDescription"
													placeholder="Detailed description of the medical record"
													className="min-h-[100px]"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="recordNotes">Clinical Notes</Label>
												<Textarea
													id="recordNotes"
													placeholder="Additional notes, observations, or recommendations"
													className="min-h-[100px]"
												/>
											</div>

											<div className="space-y-2">
												<Label>Attachments</Label>
												<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
													<input
														type="file"
														id="fileUpload"
														className="hidden"
														multiple
													/>
													<label
														htmlFor="fileUpload"
														className="cursor-pointer flex flex-col items-center justify-center"
													>
														<Upload className="w-10 h-10 text-gray-400 mb-2" />
														<span className="text-sm font-medium">
															Click to upload files or drag and drop
														</span>
														<span className="text-xs text-gray-500 mt-1">
															PDF, Images, Documents up to 10MB each
														</span>
													</label>
												</div>
												<div className="text-xs text-gray-500 mt-2">
													Uploaded files will be securely stored and accessible
													only to authorized medical personnel.
												</div>
											</div>
										</div>
									</div>
									<div className="flex justify-end space-x-4 mt-4">
										<DialogTrigger asChild>
											<Button variant="outline">Cancel</Button>
										</DialogTrigger>
										<Button
											className="bg-blue-600 hover:bg-blue-700"
											onClick={() => {
												// In a real app, this would save the record to the database
												console.log('New medical record created');
												// You would then close the dialog and refresh the list
											}}
										>
											Create Record
										</Button>
									</div>
								</DialogContent>
							</Dialog>
							<Button variant="outline" size="icon">
								<Bell className="w-4 h-4" />
							</Button>
							<Button variant="outline" size="icon">
								<Settings className="w-4 h-4" />
							</Button>
							<Avatar className="w-8 h-8">
								<AvatarImage src="/placeholder.svg?height=32&width=32" />
								<AvatarFallback>SJ</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				{/* Filters and Search */}
				<div className="p-6 border-b border-gray-200 bg-white">
					<div className="flex items-center space-x-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								placeholder="Search records, patients..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Filter className="w-4 h-4 text-gray-500" />
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm"
							>
								<option value="all">All Categories</option>
								<option value="laboratory">Laboratory</option>
								<option value="imaging">Imaging</option>
								<option value="cardiology">Cardiology</option>
								<option value="consultation">Consultation</option>
								<option value="procedure">Procedure</option>
							</select>
						</div>
						<Button variant="outline">
							<Upload className="w-4 h-4 mr-2" />
							Upload
						</Button>
					</div>
				</div>

				{/* Records List */}
				<div className="flex-1 p-6 overflow-y-auto">
					<div className="space-y-4">
						{filteredRecords.map((record) => (
							<Card
								key={record.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-4 flex-1">
											<div className="p-3 bg-blue-50 rounded-lg">
												{getCategoryIcon(record.category)}
											</div>
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h3 className="text-lg font-semibold">
														{record.title}
													</h3>
													<Badge className={getStatusColor(record.status)}>
														{record.status}
													</Badge>
													<Badge className={getPriorityColor(record.priority)}>
														{record.priority}
													</Badge>
												</div>
												<div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
													<span>
														<strong>Patient:</strong> {record.patientName} (
														{record.patientId})
													</span>
													<span>
														<strong>Date:</strong> {record.date}
													</span>
													<span>
														<strong>Type:</strong> {record.recordType}
													</span>
												</div>
												<p className="text-gray-600 mb-3">
													{record.description}
												</p>

												{record.attachments &&
													record.attachments.length > 0 && (
														<div className="flex items-center space-x-2 mb-3">
															<span className="text-sm text-gray-500">
																Attachments:
															</span>
															{record.attachments.map((attachment, index) => (
																<div
																	key={index}
																	className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1"
																>
																	{getFileIcon(attachment.type)}
																	<span className="text-xs">
																		{attachment.name}
																	</span>
																	<span className="text-xs text-gray-400">
																		({attachment.size})
																	</span>
																</div>
															))}
														</div>
													)}
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button
														size="sm"
														variant="outline"
														onClick={() => setSelectedRecord(record)}
													>
														<Eye className="w-4 h-4 mr-2" />
														View
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
													<DialogHeader>
														<DialogTitle className="flex items-center space-x-3">
															<div className="p-2 bg-blue-50 rounded-lg">
																{getCategoryIcon(record.category)}
															</div>
															<div>
																<h3 className="text-xl font-bold">
																	{record.title}
																</h3>
																<p className="text-gray-500">
																	{record.patientName} ({record.patientId}) -{' '}
																	{record.date}
																</p>
															</div>
														</DialogTitle>
													</DialogHeader>

													<div className="space-y-6">
														{/* Status and Priority */}
														<div className="flex items-center space-x-4">
															<Badge className={getStatusColor(record.status)}>
																{record.status}
															</Badge>
															<Badge
																className={getPriorityColor(record.priority)}
															>
																{record.priority} priority
															</Badge>
														</div>

														{/* Description */}
														<div>
															<h4 className="font-semibold mb-2">
																Description
															</h4>
															<p className="text-gray-600">
																{record.description}
															</p>
														</div>

														{/* Results */}
														<div>
															<h4 className="font-semibold mb-3">
																Results & Findings
															</h4>
															<Card>
																<CardContent className="p-4">
																	<div className="space-y-3">
																		{Object.entries(record.results).map(
																			([key, value]) => (
																				<div
																					key={key}
																					className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
																				>
																					<span className="font-medium capitalize">
																						{key
																							.replace(/([A-Z])/g, ' $1')
																							.trim()}
																						:
																					</span>
																					<span className="text-gray-600">
																						{value}
																					</span>
																				</div>
																			)
																		)}
																	</div>
																</CardContent>
															</Card>
														</div>

														{/* Attachments */}
														{record.attachments &&
															record.attachments.length > 0 && (
																<div>
																	<h4 className="font-semibold mb-3">
																		Attachments
																	</h4>
																	<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
																		{record.attachments.map(
																			(attachment, index) => (
																				<Card key={index} className="p-4">
																					<div className="flex items-center justify-between">
																						<div className="flex items-center space-x-3">
																							{getFileIcon(attachment.type)}
																							<div>
																								<p className="font-medium text-sm">
																									{attachment.name}
																								</p>
																								<p className="text-xs text-gray-500">
																									{attachment.size}
																								</p>
																							</div>
																						</div>
																						<Button size="sm" variant="outline">
																							<Download className="w-3 h-3 mr-1" />
																							Download
																						</Button>
																					</div>
																				</Card>
																			)
																		)}
																	</div>
																</div>
															)}

														{/* Doctor's Notes */}
														<div>
															<h4 className="font-semibold mb-3">
																Doctor's Notes
															</h4>
															<Card>
																<CardContent className="p-4">
																	<Textarea
																		value={record.notes}
																		placeholder="Add your notes..."
																		className="min-h-[100px] border-0 p-0 resize-none focus-visible:ring-0"
																		readOnly
																	/>
																</CardContent>
															</Card>
														</div>
													</div>
												</DialogContent>
											</Dialog>
											<Button size="sm" variant="outline">
												<Download className="w-4 h-4 mr-2" />
												Download
											</Button>
											<Button size="sm" variant="outline">
												<Edit className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
