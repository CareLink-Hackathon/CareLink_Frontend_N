'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Calendar,
	Users,
	Activity,
	FileText,
	Search,
	MessageSquare,
	Phone,
	Mail,
	Book,
	Video,
	Download,
	ExternalLink,
	Star,
	ThumbsUp,
	Send,
} from 'lucide-react';

export default function DoctorHelp() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [contactForm, setContactForm] = useState({
		subject: '',
		message: '',
		priority: 'normal',
	});

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/doctor/dashboard' },
		{ icon: Calendar, label: 'My Appointments', href: '/doctor/appointments' },
		{ icon: Users, label: 'My Patients', href: '/doctor/patients' },
		{ icon: FileText, label: 'Medical Records', href: '/doctor/records' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/doctor/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/doctor/settings' },
		{
			icon: HelpCircle,
			label: 'Help Center',
			href: '/doctor/help',
			active: true,
		},
	];

	const faqCategories = [
		{
			id: 'getting-started',
			title: 'Getting Started',
			icon: <Book className="w-5 h-5" />,
			questions: [
				{
					question: 'How do I log into my CareLink account?',
					answer:
						"You can log into your CareLink account using your registered email address and password. If you've forgotten your password, click 'Forgot Password' on the login page to reset it.",
				},
				{
					question: 'How do I update my profile information?',
					answer:
						'Go to Settings > Profile to update your personal information, contact details, and professional credentials. Make sure to save your changes.',
				},
				{
					question: 'How do I set my working hours?',
					answer:
						'Navigate to Settings > Schedule to configure your working hours for each day of the week. You can enable/disable specific days and set start and end times.',
				},
			],
		},
		{
			id: 'appointments',
			title: 'Appointments',
			icon: <Calendar className="w-5 h-5" />,
			questions: [
				{
					question: 'How do I view my upcoming appointments?',
					answer:
						'Go to the Appointments section in your dashboard to see all upcoming, ongoing, and completed appointments. You can filter by date, patient, or status.',
				},
				{
					question: 'Can I reschedule an appointment?',
					answer:
						"Yes, you can reschedule appointments by clicking on the appointment and selecting 'Reschedule'. The patient will be notified automatically of the change.",
				},
				{
					question: 'How do I mark an appointment as completed?',
					answer:
						"During or after an appointment, you can mark it as completed by clicking the 'Complete' button. You can also add notes about the visit.",
				},
				{
					question: 'What happens if a patient cancels an appointment?',
					answer:
						"You'll receive a notification when a patient cancels. The appointment will be marked as cancelled and the time slot will become available for other bookings.",
				},
			],
		},
		{
			id: 'patients',
			title: 'Patient Management',
			icon: <Users className="w-5 h-5" />,
			questions: [
				{
					question: 'How do I view patient medical history?',
					answer:
						'Click on any patient from your patient list to view their complete medical history, including past appointments, medications, and test results.',
				},
				{
					question: 'Can I add notes about a patient?',
					answer:
						'Yes, you can add private notes about patients in their profile. These notes are only visible to you and help track treatment progress.',
				},
				{
					question: 'How do I communicate with patients?',
					answer:
						'You can send secure messages to patients through the platform. Patients will receive notifications and can respond through their patient portal.',
				},
			],
		},
		{
			id: 'medical-records',
			title: 'Medical Records',
			icon: <FileText className="w-5 h-5" />,
			questions: [
				{
					question: 'How do I upload medical records?',
					answer:
						"Go to Medical Records and click 'New Record'. You can upload files, images, and documents. All uploads are encrypted and HIPAA compliant.",
				},
				{
					question: 'What file formats are supported?',
					answer:
						'We support PDF, DOC, DOCX, JPG, PNG, DICOM files, and many other medical file formats. Maximum file size is 50MB per upload.',
				},
				{
					question: 'Can I share records with other doctors?',
					answer:
						"Yes, you can securely share medical records with other healthcare providers with proper patient consent. Use the 'Share' feature in the record details.",
				},
			],
		},
		{
			id: 'technical',
			title: 'Technical Support',
			icon: <Settings className="w-5 h-5" />,
			questions: [
				{
					question: 'The system is running slowly. What should I do?',
					answer:
						'Try clearing your browser cache, ensure you have a stable internet connection, and close unnecessary browser tabs. If issues persist, contact support.',
				},
				{
					question: "I'm having trouble uploading files. What's wrong?",
					answer:
						'Check your internet connection, ensure the file size is under 50MB, and verify the file format is supported. Try using a different browser if the issue continues.',
				},
				{
					question: 'How do I enable notifications?',
					answer:
						'Go to Settings > Notifications to configure your notification preferences. You can enable/disable email, SMS, and in-app notifications.',
				},
			],
		},
	];

	const quickActions = [
		{
			title: 'Contact Support',
			description: 'Get help from our support team',
			icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
			action: 'contact',
		},
		{
			title: 'Video Tutorials',
			description: 'Watch step-by-step guides',
			icon: <Video className="w-8 h-8 text-purple-500" />,
			action: 'tutorials',
		},
		{
			title: 'Download User Guide',
			description: 'Complete documentation PDF',
			icon: <Download className="w-8 h-8 text-green-500" />,
			action: 'download',
		},
		{
			title: 'System Status',
			description: 'Check platform status',
			icon: <Activity className="w-8 h-8 text-orange-500" />,
			action: 'status',
		},
	];

	const tutorials = [
		{
			title: 'Getting Started with CareLink',
			duration: '5:30',
			views: '1.2K',
			rating: 4.8,
			thumbnail: '/placeholder.svg?height=120&width=200',
		},
		{
			title: 'Managing Patient Appointments',
			duration: '8:15',
			views: '856',
			rating: 4.9,
			thumbnail: '/placeholder.svg?height=120&width=200',
		},
		{
			title: 'Using Medical Records System',
			duration: '12:45',
			views: '743',
			rating: 4.7,
			thumbnail: '/placeholder.svg?height=120&width=200',
		},
		{
			title: 'Patient Communication Tools',
			duration: '6:20',
			views: '612',
			rating: 4.6,
			thumbnail: '/placeholder.svg?height=120&width=200',
		},
	];

	const filteredFAQs = faqCategories
		.map((category) => ({
			...category,
			questions: category.questions.filter(
				(q) =>
					q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
					q.answer.toLowerCase().includes(searchTerm.toLowerCase())
			),
		}))
		.filter((category) => category.questions.length > 0);

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Contact form submitted:', contactForm);
		// Reset form
		setContactForm({ subject: '', message: '', priority: 'normal' });
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
							<h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
						</div>
						<div className="flex items-center space-x-4">
							<Button variant="outline">
								<Phone className="w-4 h-4 mr-2" />
								Call Support
							</Button>
							<Button variant="outline" size="icon">
								<Bell className="w-4 h-4" />
							</Button>
							<Avatar className="w-8 h-8">
								<AvatarImage src="/placeholder.svg?height=32&width=32" />
								<AvatarFallback>SJ</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>

				{/* Help Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					{/* Search */}
					<div className="mb-8">
						<div className="relative max-w-2xl mx-auto">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<Input
								placeholder="Search for help articles, tutorials, or FAQs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-12 h-12 text-lg"
							/>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{quickActions.map((action, index) => (
							<Card
								key={index}
								className="hover:shadow-lg transition-shadow cursor-pointer"
							>
								<CardContent className="p-6 text-center">
									<div className="mb-4 flex justify-center">{action.icon}</div>
									<h3 className="font-semibold mb-2">{action.title}</h3>
									<p className="text-sm text-gray-600">{action.description}</p>
								</CardContent>
							</Card>
						))}
					</div>

					<Tabs defaultValue="faq" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
							<TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
							<TabsTrigger value="contact">Contact Support</TabsTrigger>
						</TabsList>

						{/* FAQ Tab */}
						<TabsContent value="faq" className="mt-6">
							<div className="space-y-6">
								{filteredFAQs.map((category) => (
									<Card key={category.id}>
										<CardHeader>
											<CardTitle className="flex items-center space-x-3">
												{category.icon}
												<span>{category.title}</span>
												<Badge variant="outline">
													{category.questions.length}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Accordion type="single" collapsible className="w-full">
												{category.questions.map((faq, index) => (
													<AccordionItem
														key={index}
														value={`item-${category.id}-${index}`}
													>
														<AccordionTrigger className="text-left">
															{faq.question}
														</AccordionTrigger>
														<AccordionContent className="text-gray-600">
															{faq.answer}
														</AccordionContent>
													</AccordionItem>
												))}
											</Accordion>
										</CardContent>
									</Card>
								))}

								{filteredFAQs.length === 0 && searchTerm && (
									<div className="text-center py-12">
										<HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No results found
										</h3>
										<p className="text-gray-500">
											Try adjusting your search terms or browse categories
											above.
										</p>
									</div>
								)}
							</div>
						</TabsContent>

						{/* Tutorials Tab */}
						<TabsContent value="tutorials" className="mt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{tutorials.map((tutorial, index) => (
									<Card
										key={index}
										className="hover:shadow-lg transition-shadow cursor-pointer"
									>
										<div className="relative">
											<img
												src={tutorial.thumbnail}
												alt={tutorial.title}
												className="w-full h-32 object-cover rounded-t-lg"
											/>
											<div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg flex items-center justify-center">
												<Button
													size="sm"
													className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-white hover:bg-white hover:text-black"
												>
													<Video className="w-4 h-4 mr-2" />
													Play
												</Button>
											</div>
											<div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
												{tutorial.duration}
											</div>
										</div>
										<CardContent className="p-4">
											<h3 className="font-semibold mb-2">{tutorial.title}</h3>
											<div className="flex items-center justify-between text-sm text-gray-600">
												<span>{tutorial.views} views</span>
												<div className="flex items-center space-x-1">
													<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													<span>{tutorial.rating}</span>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* Contact Tab */}
						<TabsContent value="contact" className="mt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Contact Form */}
								<Card>
									<CardHeader>
										<CardTitle>Send us a message</CardTitle>
									</CardHeader>
									<CardContent>
										<form onSubmit={handleContactSubmit} className="space-y-4">
											<div>
												<label className="block text-sm font-medium mb-2">
													Subject
												</label>
												<Input
													value={contactForm.subject}
													onChange={(e) =>
														setContactForm({
															...contactForm,
															subject: e.target.value,
														})
													}
													placeholder="Brief description of your issue"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium mb-2">
													Priority
												</label>
												<select
													value={contactForm.priority}
													onChange={(e) =>
														setContactForm({
															...contactForm,
															priority: e.target.value,
														})
													}
													className="w-full border border-gray-300 rounded-md px-3 py-2"
												>
													<option value="low">Low</option>
													<option value="normal">Normal</option>
													<option value="high">High</option>
													<option value="urgent">Urgent</option>
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium mb-2">
													Message
												</label>
												<Textarea
													value={contactForm.message}
													onChange={(e) =>
														setContactForm({
															...contactForm,
															message: e.target.value,
														})
													}
													placeholder="Please describe your issue in detail..."
													className="min-h-[120px]"
													required
												/>
											</div>

											<Button
												type="submit"
												className="w-full bg-blue-600 hover:bg-blue-700"
											>
												<Send className="w-4 h-4 mr-2" />
												Send Message
											</Button>
										</form>
									</CardContent>
								</Card>

								{/* Contact Information */}
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Contact Information</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="flex items-center space-x-3">
												<Phone className="w-5 h-5 text-blue-500" />
												<div>
													<p className="font-medium">Phone Support</p>
													<p className="text-sm text-gray-600">
														1-800-CARELINK (24/7)
													</p>
												</div>
											</div>

											<div className="flex items-center space-x-3">
												<Mail className="w-5 h-5 text-blue-500" />
												<div>
													<p className="font-medium">Email Support</p>
													<p className="text-sm text-gray-600">
														support@carelink.com
													</p>
												</div>
											</div>

											<div className="flex items-center space-x-3">
												<MessageSquare className="w-5 h-5 text-blue-500" />
												<div>
													<p className="font-medium">Live Chat</p>
													<p className="text-sm text-gray-600">
														Available 9 AM - 6 PM EST
													</p>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Response Times</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="flex justify-between">
												<span className="text-sm">Urgent Issues</span>
												<Badge className="bg-red-100 text-red-800">
													Within 1 hour
												</Badge>
											</div>
											<div className="flex justify-between">
												<span className="text-sm">High Priority</span>
												<Badge className="bg-orange-100 text-orange-800">
													Within 4 hours
												</Badge>
											</div>
											<div className="flex justify-between">
												<span className="text-sm">Normal Priority</span>
												<Badge className="bg-blue-100 text-blue-800">
													Within 24 hours
												</Badge>
											</div>
											<div className="flex justify-between">
												<span className="text-sm">Low Priority</span>
												<Badge className="bg-gray-100 text-gray-800">
													Within 48 hours
												</Badge>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
