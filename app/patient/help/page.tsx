'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
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
	Search,
	Bot,
	Phone,
	Mail,
	MessageSquare,
	ExternalLink,
	Clock,
	MapPin,
	Users,
	Book,
	Video,
	Headphones,
	ChevronRight,
	Download,
	Play,
} from 'lucide-react';

export default function PatientHelp() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');

	// User info for responsive layout
	const userInfo = {
		name: "JOHN DOE",
		fallback: "JD",
		role: "Patient",
		id: "P001"
	};

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/patient/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{ icon: Settings, label: 'Settings', href: '/patient/settings' },
		{
			icon: HelpCircle,
			label: 'Help Center',
			href: '/patient/help',
			active: true,
		},
	];

	const faqData = [
		{
			question: 'How do I book an appointment?',
			answer: 'You can book an appointment by going to the Appointments section and clicking "Book Appointment". Choose your preferred doctor, date, and time.',
		},
		{
			question: 'How can I access my medical records?',
			answer: 'Your medical records are available in the Medical Records section. You can view, download, and share your records with healthcare providers.',
		},
		{
			question: 'How do I reschedule or cancel an appointment?',
			answer: 'Go to your Appointments section, find the appointment you want to modify, and click the "Reschedule" or "Cancel" button.',
		},
		{
			question: 'How do I update my profile information?',
			answer: 'Navigate to Settings > Profile to update your personal information, contact details, and preferences.',
		},
		{
			question: 'How do I enable notifications?',
			answer: 'Go to Settings > Notifications to customize which alerts you want to receive and how you want to receive them.',
		},
		{
			question: 'Is my health data secure?',
			answer: 'Yes, we use industry-standard encryption and security measures to protect your health information. Your data is HIPAA compliant.',
		},
	];

	const contactOptions = [
		{
			icon: Phone,
			title: 'Phone Support',
			description: 'Call us for immediate assistance',
			contact: '+1 (555) 123-4567',
			availability: '24/7 Emergency | 8AM-6PM General',
		},
		{
			icon: Mail,
			title: 'Email Support',
			description: 'Send us a detailed message',
			contact: 'support@carelink.com',
			availability: 'Response within 24 hours',
		},
		{
			icon: MessageSquare,
			title: 'Live Chat',
			description: 'Chat with our support team',
			contact: 'Start Chat',
			availability: '8AM-10PM Daily',
		},
	];

	const filteredFAQs = faqData.filter(faq =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
		faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<ResponsiveDashboardLayout 
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={false}
		>
			<div className="space-y-4 sm:space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">Help Center</h1>
						<p className="text-sm sm:text-base text-gray-600">Find answers and get support</p>
					</div>
					
					<Button
						onClick={() => router.push("/patient/chatbot")}
						className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
					>
						<Bot className="w-4 h-4 mr-2" />
						<span>AI Assistant</span>
					</Button>
				</div>

				{/* Search Bar - Mobile responsive */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						placeholder="Search for help topics..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 text-sm sm:text-base"
					/>
				</div>

				{/* Help Tabs - Mobile responsive */}
				<Tabs defaultValue="faq" className="w-full">
					<TabsList className="grid w-full grid-cols-3 h-auto">
						<TabsTrigger value="faq" className="text-xs sm:text-sm">
							<Book className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							FAQ
						</TabsTrigger>
						<TabsTrigger value="contact" className="text-xs sm:text-sm">
							<Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Contact
						</TabsTrigger>
						<TabsTrigger value="guides" className="text-xs sm:text-sm">
							<Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Guides
						</TabsTrigger>
					</TabsList>

					{/* FAQ Section */}
					<TabsContent value="faq" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-base sm:text-lg">Frequently Asked Questions</CardTitle>
							</CardHeader>
							<CardContent>
								<Accordion type="single" collapsible className="w-full">
									{filteredFAQs.map((faq, index) => (
										<AccordionItem key={index} value={`item-${index}`}>
											<AccordionTrigger className="text-left text-sm sm:text-base">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="text-xs sm:text-sm text-gray-600">
												{faq.answer}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>

								{filteredFAQs.length === 0 && (
									<div className="text-center py-8">
										<Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
										<h3 className="text-base sm:text-lg font-semibold text-gray-500 mb-2">
											No results found
										</h3>
										<p className="text-sm text-gray-400">
											Try searching for different keywords
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Contact Section */}
					<TabsContent value="contact" className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{contactOptions.map((option, index) => (
								<Card key={index} className="hover:shadow-lg transition-shadow">
									<CardContent className="p-4 sm:p-6">
										<div className="flex flex-col items-center text-center space-y-3">
											<div className="p-3 bg-blue-100 rounded-full">
												<option.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
											</div>
											<div>
												<h3 className="font-semibold text-sm sm:text-base">{option.title}</h3>
												<p className="text-xs sm:text-sm text-gray-600 mt-1">
													{option.description}
												</p>
											</div>
											<div className="text-center">
												<p className="font-medium text-sm sm:text-base text-blue-600">
													{option.contact}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{option.availability}
												</p>
											</div>
											<Button 
												variant="outline" 
												size="sm" 
												className="w-full text-xs sm:text-sm"
											>
												{option.title === 'Live Chat' ? 'Start Chat' : 'Contact'}
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Emergency Contact */}
						<Card className="border-red-200 bg-red-50">
							<CardContent className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row items-center gap-4">
									<div className="p-3 bg-red-100 rounded-full flex-shrink-0">
										<Phone className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
									</div>
									<div className="text-center sm:text-left flex-1">
										<h3 className="font-semibold text-base sm:text-lg text-red-800">
											Emergency Support
										</h3>
										<p className="text-sm text-red-600 mt-1">
											For medical emergencies, call 911 or go to your nearest emergency room
										</p>
									</div>
									<Button variant="destructive" size="sm" className="w-full sm:w-auto">
										Call 911
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Guides Section */}
					<TabsContent value="guides" className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{[
								{
									title: 'Getting Started',
									description: 'Learn the basics of using CareLink',
									duration: '5 min',
									type: 'video',
								},
								{
									title: 'Booking Appointments',
									description: 'Step-by-step appointment booking guide',
									duration: '3 min',
									type: 'video',
								},
								{
									title: 'Managing Records',
									description: 'How to access and manage your medical records',
									duration: '4 min',
									type: 'guide',
								},
								{
									title: 'Privacy Settings',
									description: 'Customize your privacy and security settings',
									duration: '2 min',
									type: 'guide',
								},
								{
									title: 'Mobile App Features',
									description: 'Make the most of the mobile experience',
									duration: '6 min',
									type: 'video',
								},
								{
									title: 'Troubleshooting',
									description: 'Common issues and how to resolve them',
									duration: '8 min',
									type: 'guide',
								},
							].map((guide, index) => (
								<Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
									<CardContent className="p-4">
										<div className="space-y-3">
											<div className="flex items-start justify-between">
												<div className="p-2 bg-blue-100 rounded-lg">
													{guide.type === 'video' ? (
														<Video className="w-4 h-4 text-blue-600" />
													) : (
														<Book className="w-4 h-4 text-blue-600" />
													)}
												</div>
												<Badge variant="outline" className="text-xs">
													{guide.duration}
												</Badge>
											</div>
											<div>
												<h3 className="font-semibold text-sm sm:text-base">
													{guide.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 mt-1">
													{guide.description}
												</p>
											</div>
											<Button variant="outline" size="sm" className="w-full">
												<Play className="w-3 h-3 mr-2" />
												{guide.type === 'video' ? 'Watch' : 'Read'}
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ResponsiveDashboardLayout>
	);
}
