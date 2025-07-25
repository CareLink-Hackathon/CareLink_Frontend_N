'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileSidebar } from '@/components/ui/mobile-sidebar';
import {
	Search,
	Bell,
	Settings,
	HelpCircle,
	LogOut,
	Filter,
	X,
	MoreHorizontal,
	Calendar,
	BarChart3,
	Building2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const [activeWorkersOpen, setActiveWorkersOpen] = useState(true);
	const router = useRouter();

	const sidebarItems = [
		{ icon: BarChart3, label: 'Dashboard', href: '/dashboard', active: true },
		{ icon: Calendar, label: 'Appointments', href: '/appointments' },
		{ icon: Bell, label: 'Notifications', href: '/notifications', badge: '3' },
		{ icon: Settings, label: 'Settings', href: '/settings' },
		{ icon: HelpCircle, label: 'Help Center', href: '/help' },
	];

	const workers = [
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
		{
			name: 'Dr. Elame Jordan',
			role: 'Medical Practitioner with over 5 years of experience, providing got customer satisfaction.',
			status: 'online',
		},
	];

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Desktop Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white hidden md:flex flex-col">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage src="/placeholder.svg?height=64&width=64" />
							<AvatarFallback>NE</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-bold text-lg">NAOMIE EKON</h3>
							<p className="text-blue-100 text-sm">ekonnaomie6@gmail.com</p>
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

				<div className="mt-auto p-6">
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
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search anything..."
									className="pl-10 w-96 border-gray-300"
								/>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
								<option>EN</option>
								<option>FR</option>
							</select>
							<Button variant="outline" size="sm">
								User Guide
							</Button>
							<Button variant="ghost" size="icon">
								<Settings className="w-5 h-5" />
							</Button>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5" />
								<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
							</Button>
						</div>
					</div>
				</header>

				<div className="flex-1 flex">
					{/* Dashboard Content */}
					<div className="flex-1 p-6">
						<div className="mb-6">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								Admin Dashboard
							</h1>

							{/* Welcome Card */}
							<Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-6">
								<CardContent className="p-6">
									<h2 className="text-xl font-bold mb-2">
										Welcome to Your Dashboard
									</h2>
									<p className="text-blue-100 mb-4">
										Monitor Hospital stats and performances
									</p>

									<div className="flex space-x-8">
										<div className="text-center">
											<div className="text-2xl font-bold">25</div>
											<div className="text-blue-100 text-sm">Departments</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">50</div>
											<div className="text-blue-100 text-sm">Doctors</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">120</div>
											<div className="text-blue-100 text-sm">Nurses</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Analytics and Statistics */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
								{/* Analytics Chart */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<CardTitle className="text-lg">Analytics</CardTitle>
										<div className="flex items-center space-x-2">
											<Button variant="ghost" size="sm">
												<Filter className="w-4 h-4 mr-1" />
												Filter
											</Button>
											<select className="text-sm border border-gray-300 rounded px-2 py-1">
												<option>Last Week</option>
												<option>Last Month</option>
											</select>
										</div>
									</CardHeader>
									<CardContent>
										<div className="h-48 bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4">
											{[40, 60, 30, 80, 50, 70, 45].map((height, index) => (
												<div
													key={index}
													className="bg-blue-500 rounded-t"
													style={{ height: `${height}%`, width: '20px' }}
												></div>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Patient Stats */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">+86 Patients</CardTitle>
										<p className="text-sm text-gray-600">Last Week</p>
									</CardHeader>
									<CardContent>
										<div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
											<div className="w-full h-16 bg-blue-500 rounded relative overflow-hidden">
												<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
												<div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white font-bold">
													86
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Statistics */}
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle className="text-lg">Statistics</CardTitle>
									<select className="text-sm border border-gray-300 rounded px-2 py-1">
										<option>Last Month</option>
										<option>Last Week</option>
									</select>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-4 mb-4">
												<div className="flex items-center space-x-2">
													<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
													<span className="text-sm">45% Adults</span>
												</div>
												<div className="flex items-center space-x-2">
													<div className="w-3 h-3 bg-green-500 rounded-full"></div>
													<span className="text-sm">35% Children</span>
												</div>
												<div className="flex items-center space-x-2">
													<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
													<span className="text-sm">20% Old People</span>
												</div>
											</div>

											<div className="relative w-32 h-32">
												<div className="w-full h-full rounded-full border-8 border-blue-500"></div>
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="text-center">
														<div className="text-xl font-bold">$1,604</div>
														<div className="text-sm text-gray-600">Total</div>
													</div>
												</div>
											</div>
										</div>

										<div className="flex-1">
											<Card className="bg-blue-600 text-white">
												<CardContent className="p-4 text-center">
													<h3 className="font-bold mb-2">
														Invite Other Admins
													</h3>
													<p className="text-blue-100 text-sm mb-4">
														Do you like what you see and how you manage the
														hospital?
													</p>
													<Button className="bg-white text-blue-600 hover:bg-gray-100">
														Add Admin
													</Button>
												</CardContent>
											</Card>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Active Workers Sidebar */}
					{activeWorkersOpen && (
						<div className="w-80 bg-white border-l border-gray-200 p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-bold">Active Workers</h2>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setActiveWorkersOpen(false)}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-2">
									<Building2 className="w-4 h-4 text-gray-400" />
									<select className="text-sm border-none bg-transparent">
										<option>Department</option>
									</select>
								</div>
								<Button variant="outline" size="sm">
									View
								</Button>
							</div>

							<div className="flex space-x-2 mb-6">
								<Button size="sm" className="bg-blue-600 text-white">
									All
								</Button>
								<Button variant="outline" size="sm">
									New
								</Button>
								<Button variant="outline" size="sm">
									Old
								</Button>
							</div>

							<div className="space-y-4 max-h-96 overflow-y-auto">
								{workers.map((worker, index) => (
									<div
										key={index}
										className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
									>
										<Avatar className="w-10 h-10">
											<AvatarImage src="/placeholder.svg?height=40&width=40" />
											<AvatarFallback>EJ</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2">
												<h4 className="font-medium text-sm">{worker.name}</h4>
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
											</div>
											<p className="text-xs text-gray-600 mt-1 line-clamp-2">
												{worker.role}
											</p>
										</div>
										<Button variant="ghost" size="icon" className="w-6 h-6">
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
