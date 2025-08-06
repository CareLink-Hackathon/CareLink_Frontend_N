'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Search,
	Send,
	Book,
	MessageCircle,
	Phone,
	Mail,
	ExternalLink,
	Download,
	Play,
	ChevronRight,
	Star,
	Clock,
	CheckCircle,
	AlertCircle,
	Info,
	Droplets,
	Lightbulb,
	Video,
	FileVideo,
	Headphones,
	MessageSquare,
	LogOut,
	Users,
	Calendar,
	Settings,
	Activity,
	Bell,
	HelpCircle,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHelp() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const sidebarItems = getAdminSidebarItems('help');
	const userInfo = getAdminUserInfo({ first_name: 'Admin', last_name: 'User' });

	const [contactForm, setContactForm] = useState({
		subject: '',
		message: '',
		priority: 'normal',
		category: 'general',
	});

	const faqCategories = [
		{ id: 'all', label: 'All Categories', icon: Book },
		{ id: 'getting-started', label: 'Getting Started', icon: Play },
		{ id: 'user-management', label: 'User Management', icon: Users },
		{ id: 'appointments', label: 'Appointments', icon: Calendar },
		{ id: 'system', label: 'System Settings', icon: Settings },
		{ id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
	];

	const faqs = [
		{
			id: 1,
			question: 'How do I add a new doctor to the system?',
			answer:
				"To add a new doctor, navigate to the Doctors page and click the 'Add Doctor' button. Fill in all required information including personal details, specialty, license number, and contact information. The doctor will receive login credentials via email once the account is created.",
			category: 'user-management',
			tags: ['doctors', 'add user', 'registration'],
			helpful: 45,
			notHelpful: 3,
		},
		{
			id: 2,
			question: 'How can I manage appointment scheduling conflicts?',
			answer:
				"The system automatically prevents double-booking by checking doctor availability. If a conflict occurs, you'll see a warning message. You can resolve conflicts by reassigning appointments to available time slots or different doctors with the same specialty.",
			category: 'appointments',
			tags: ['scheduling', 'conflicts', 'availability'],
			helpful: 38,
			notHelpful: 2,
		},
		{
			id: 3,
			question: 'What should I do if the system is running slowly?',
			answer:
				'System slowness can be caused by high server load, network issues, or browser cache problems. Try clearing your browser cache, refreshing the page, or accessing the system during off-peak hours. If the problem persists, contact technical support.',
			category: 'troubleshooting',
			tags: ['performance', 'slow', 'cache'],
			helpful: 29,
			notHelpful: 5,
		},
		{
			id: 4,
			question: 'How do I set up notification preferences?',
			answer:
				'Go to Settings > Notifications to configure system-wide notification preferences. You can enable/disable email, SMS, and push notifications for different event types including appointments, emergencies, and system updates.',
			category: 'system',
			tags: ['notifications', 'settings', 'preferences'],
			helpful: 52,
			notHelpful: 1,
		},
		{
			id: 5,
			question: 'What are the system requirements for optimal performance?',
			answer:
				'The system works best with modern browsers (Chrome, Firefox, Safari, Edge) updated to the latest version. Recommended screen resolution is 1280x720 or higher. Ensure stable internet connection with minimum 10 Mbps for smooth operation.',
			category: 'getting-started',
			tags: ['requirements', 'browser', 'performance'],
			helpful: 41,
			notHelpful: 2,
		},
		{
			id: 6,
			question: 'How do I generate and export reports?',
			answer:
				'Reports can be generated from the Dashboard by clicking on any statistic card or using the Reports section. Select your desired date range, filters, and export format (PDF, Excel, CSV). Large reports may take a few minutes to process.',
			category: 'system',
			tags: ['reports', 'export', 'analytics'],
			helpful: 35,
			notHelpful: 4,
		},
	];

	const quickLinks = [
		{
			title: 'System Status',
			description: 'Check current system status and uptime',
			icon: Activity,
			href: '/admin/system-status',
			external: false,
		},
		{
			title: 'Video Tutorials',
			description: 'Step-by-step video guides',
			icon: Video,
			href: 'https://tutorials.carelink.com',
			external: true,
		},
		{
			title: 'API Documentation',
			description: 'Technical documentation for developers',
			icon: Book,
			href: 'https://docs.carelink.com/api',
			external: true,
		},
		{
			title: 'Download User Manual',
			description: 'Complete PDF user guide',
			icon: Download,
			href: '/downloads/user-manual.pdf',
			external: true,
		},
	];

	const supportOptions = [
		{
			title: 'Email Support',
			description: 'Get help via email within 24 hours',
			icon: Mail,
			action: 'support@carelink.com',
			available: '24/7',
		},
		{
			title: 'Phone Support',
			description: 'Speak with our technical team',
			icon: Phone,
			action: '+1 (555) 123-HELP',
			available: 'Mon-Fri 9AM-6PM EST',
		},
		{
			title: 'Live Chat',
			description: 'Instant help from our support team',
			icon: MessageCircle,
			action: 'Start Chat',
			available: 'Mon-Fri 9AM-6PM EST',
		},
		{
			title: 'Remote Assistance',
			description: 'Screen sharing support session',
			icon: Headphones,
			action: 'Schedule Session',
			available: 'By appointment',
		},
	];

	const filteredFaqs = faqs.filter((faq) => {
		const matchesSearch =
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesCategory =
			selectedCategory === 'all' || faq.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	const handleContactSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setIsContactOpen(false);
			setContactForm({
				subject: '',
				message: '',
				priority: 'normal',
				category: 'general',
			});
			// Show success message
		}, 1000);
	};

	const handleFeedback = (faqId: number, helpful: boolean) => {
		// Update FAQ feedback
		console.log(
			`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`
		);
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white hidden md:block">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
							<div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
								<div className="w-4 h-4 bg-white rounded-sm"></div>
							</div>
						</div>
						<div>
							<h2 className="text-xl font-bold">CareLink</h2>
							<p className="text-blue-100 text-sm">Admin Portal</p>
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
				<header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search help articles..."
									className="pl-10 w-64 md:w-96 border-gray-300"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
								<DialogTrigger asChild>
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">
										<MessageSquare className="w-4 h-4 mr-2" />
										Contact Support
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl">
									<DialogHeader>
										<DialogTitle>Contact Support</DialogTitle>
									</DialogHeader>
									<form onSubmit={handleContactSubmit} className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="category">Category</Label>
												<Select
													value={contactForm.category}
													onValueChange={(value) =>
														setContactForm({ ...contactForm, category: value })
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select category" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="general">
															General Inquiry
														</SelectItem>
														<SelectItem value="technical">
															Technical Issue
														</SelectItem>
														<SelectItem value="feature">
															Feature Request
														</SelectItem>
														<SelectItem value="bug">Bug Report</SelectItem>
														<SelectItem value="training">
															Training Request
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="priority">Priority</Label>
												<Select
													value={contactForm.priority}
													onValueChange={(value) =>
														setContactForm({ ...contactForm, priority: value })
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select priority" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="low">Low</SelectItem>
														<SelectItem value="normal">Normal</SelectItem>
														<SelectItem value="high">High</SelectItem>
														<SelectItem value="urgent">Urgent</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="subject">Subject</Label>
											<Input
												id="subject"
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

										<div className="space-y-2">
											<Label htmlFor="message">Message</Label>
											<Textarea
												id="message"
												value={contactForm.message}
												onChange={(e) =>
													setContactForm({
														...contactForm,
														message: e.target.value,
													})
												}
												placeholder="Provide detailed information about your issue or question"
												rows={6}
												required
											/>
										</div>

										<div className="flex justify-end space-x-2">
											<Button
												type="button"
												variant="outline"
												onClick={() => setIsContactOpen(false)}
											>
												Cancel
											</Button>
											<Button type="submit" disabled={isLoading}>
												<Send className="w-4 h-4 mr-2" />
												{isLoading ? 'Sending...' : 'Send Message'}
											</Button>
										</div>
									</form>
								</DialogContent>
							</Dialog>

							<Button variant="ghost" size="icon" className="md:hidden">
								<Settings className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="relative hidden md:flex"
							>
								<Bell className="w-5 h-5" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
							</Button>
						</div>
					</div>
				</header>

				{/* Help Content */}
				<div className="flex-1 p-4 md:p-6 overflow-y-auto">
					<div className="max-w-6xl mx-auto">
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Help Center
							</h1>
							<p className="text-gray-600">
								Find answers to common questions and get the support you need
							</p>
						</div>

						{/* Quick Links */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							{quickLinks.map((link, index) => (
								<Card
									key={index}
									className="hover:shadow-lg transition-shadow cursor-pointer"
								>
									<CardContent className="p-6 text-center">
										<link.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
										<h3 className="font-semibold mb-2">{link.title}</h3>
										<p className="text-sm text-gray-600 mb-3">
											{link.description}
										</p>
										<div className="flex items-center justify-center text-blue-600 text-sm">
											<span>Access</span>
											{link.external ? (
												<ExternalLink className="w-4 h-4 ml-1" />
											) : (
												<ChevronRight className="w-4 h-4 ml-1" />
											)}
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* FAQ Section */}
							<div className="lg:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<HelpCircle className="w-5 h-5" />
											<span>Frequently Asked Questions</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										{/* Category Filter */}
										<div className="mb-6">
											<Tabs
												value={selectedCategory}
												onValueChange={setSelectedCategory}
											>
												<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
													{faqCategories.map((category) => (
														<TabsTrigger
															key={category.id}
															value={category.id}
															className="text-xs"
														>
															{category.id === 'all'
																? 'All'
																: category.label.split(' ')[0]}
														</TabsTrigger>
													))}
												</TabsList>
											</Tabs>
										</div>

										{/* FAQ Accordion */}
										<Accordion type="single" collapsible className="space-y-4">
											{filteredFaqs.map((faq) => (
												<AccordionItem
													key={faq.id}
													value={`item-${faq.id}`}
													className="border rounded-lg"
												>
													<AccordionTrigger className="px-4 py-3 hover:no-underline">
														<div className="flex items-start space-x-3 text-left">
															<div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
																<span className="text-xs font-semibold text-blue-600">
																	?
																</span>
															</div>
															<span className="font-medium">
																{faq.question}
															</span>
														</div>
													</AccordionTrigger>
													<AccordionContent className="px-4 pb-4">
														<div className="pl-9">
															<p className="text-gray-600 mb-4">{faq.answer}</p>
															<div className="flex items-center justify-between">
																<div className="flex flex-wrap gap-2">
																	{faq.tags.map((tag) => (
																		<Badge
																			key={tag}
																			variant="secondary"
																			className="text-xs"
																		>
																			{tag}
																		</Badge>
																	))}
																</div>
																<div className="flex items-center space-x-4 text-sm text-gray-500">
																	<span>Was this helpful?</span>
																	<div className="flex items-center space-x-2">
																		<Button
																			size="sm"
																			variant="ghost"
																			onClick={() =>
																				handleFeedback(faq.id, true)
																			}
																			className="h-6 px-2"
																		>
																			<CheckCircle className="w-4 h-4 mr-1" />
																			{faq.helpful}
																		</Button>
																		<Button
																			size="sm"
																			variant="ghost"
																			onClick={() =>
																				handleFeedback(faq.id, false)
																			}
																			className="h-6 px-2"
																		>
																			<AlertCircle className="w-4 h-4 mr-1" />
																			{faq.notHelpful}
																		</Button>
																	</div>
																</div>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>

										{filteredFaqs.length === 0 && (
											<div className="text-center py-12">
												<HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
												<h3 className="text-lg font-semibold text-gray-900 mb-2">
													No articles found
												</h3>
												<p className="text-gray-600">
													Try adjusting your search terms or browse different
													categories.
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</div>

							{/* Support Options */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Headphones className="w-5 h-5" />
											<span>Get Support</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{supportOptions.map((option, index) => (
											<div
												key={index}
												className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
											>
												<div className="flex items-start space-x-3">
													<div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
														<option.icon className="w-5 h-5 text-blue-600" />
													</div>
													<div className="flex-1">
														<h4 className="font-semibold mb-1">
															{option.title}
														</h4>
														<p className="text-sm text-gray-600 mb-2">
															{option.description}
														</p>
														<div className="flex items-center justify-between">
															<span className="text-xs text-gray-500">
																{option.available}
															</span>
															<Button size="sm" variant="outline">
																{option.action}
															</Button>
														</div>
													</div>
												</div>
											</div>
										))}
									</CardContent>
								</Card>

								{/* System Status */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Activity className="w-5 h-5" />
											<span>System Status</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm">API Services</span>
												<div className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<span className="text-xs text-green-600">
														Operational
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm">Database</span>
												<div className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<span className="text-xs text-green-600">
														Operational
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm">File Storage</span>
												<div className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
													<span className="text-xs text-yellow-600">
														Maintenance
													</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm">Notifications</span>
												<div className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<span className="text-xs text-green-600">
														Operational
													</span>
												</div>
											</div>
										</div>
										<Button variant="outline" size="sm" className="w-full mt-4">
											<ExternalLink className="w-4 h-4 mr-2" />
											View Status Page
										</Button>
									</CardContent>
								</Card>

								{/* Tips & Updates */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Lightbulb className="w-5 h-5" />
											<span>Tips & Updates</span>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="border-l-4 border-blue-500 pl-4">
												<h4 className="font-semibold text-sm">
													New Feature: Bulk Actions
												</h4>
												<p className="text-xs text-gray-600 mt-1">
													You can now perform bulk operations on multiple
													records at once.
												</p>
												<span className="text-xs text-blue-600">
													2 days ago
												</span>
											</div>
											<div className="border-l-4 border-green-500 pl-4">
												<h4 className="font-semibold text-sm">
													Performance Improvements
												</h4>
												<p className="text-xs text-gray-600 mt-1">
													The system now loads 40% faster with optimized
													database queries.
												</p>
												<span className="text-xs text-green-600">
													1 week ago
												</span>
											</div>
											<div className="border-l-4 border-yellow-500 pl-4">
												<h4 className="font-semibold text-sm">
													Scheduled Maintenance
												</h4>
												<p className="text-xs text-gray-600 mt-1">
													System maintenance scheduled for this weekend.
												</p>
												<span className="text-xs text-yellow-600">
													3 days from now
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
