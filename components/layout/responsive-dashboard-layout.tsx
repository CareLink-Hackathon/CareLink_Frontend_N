'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Menu, Search, Bell, Settings, LogOut, X } from 'lucide-react';

interface SidebarItem {
	icon: React.ElementType;
	label: string;
	href: string;
	active?: boolean;
	badge?: string;
}

interface UserInfo {
	name: string;
	email?: string;
	avatar?: string;
	fallback: string;
	role?: string;
	id?: string;
}

interface ResponsiveDashboardLayoutProps {
	children: React.ReactNode;
	sidebarItems: SidebarItem[];
	userInfo: UserInfo;
	pageTitle?: string;
	showSearch?: boolean;
	onSearch?: (query: string) => void;
}

export function ResponsiveDashboardLayout({
	children,
	sidebarItems,
	userInfo,
	pageTitle,
	showSearch = true,
	onSearch,
}: ResponsiveDashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSearch) {
			onSearch(searchQuery);
		}
	};

	const SidebarContent = () => (
		<div className="flex h-full flex-col bg-gradient-to-b from-blue-600 to-blue-700 text-white">
			<div className="p-4 sm:p-6">
				{/* User Profile Section */}
				<div className="flex items-center space-x-3 mb-6 sm:mb-8">
					<Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white">
						<AvatarImage src={userInfo.avatar} />
						<AvatarFallback>{userInfo.fallback}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<h3 className="font-bold text-sm sm:text-base truncate">
							{userInfo.name}
						</h3>
						{userInfo.id && (
							<p className="text-blue-100 text-xs sm:text-sm truncate">
								{userInfo.id}
							</p>
						)}
						{userInfo.role && (
							<p className="text-blue-100 text-xs">{userInfo.role}</p>
						)}
					</div>
					{/* Close button for mobile */}
					<Button
						variant="ghost"
						size="icon"
						className="text-white hover:bg-blue-500 md:hidden"
						onClick={() => setSidebarOpen(false)}
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* Navigation */}
				<nav className="space-y-1 sm:space-y-2">
					{sidebarItems.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							onClick={() => setSidebarOpen(false)}
							className={`flex items-center space-x-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
								item.active
									? 'bg-white text-blue-600'
									: 'text-white hover:bg-blue-500'
							}`}
						>
							<item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
							<span className="flex-1 truncate">{item.label}</span>
							{item.badge && (
								<Badge className="bg-red-500 text-white text-xs ml-auto">
									{item.badge}
								</Badge>
							)}
						</Link>
					))}
				</nav>
			</div>

			{/* Sign out button */}
			<div className="mt-auto p-4 sm:p-6">
				<Button
					variant="ghost"
					className="text-white hover:bg-blue-500 w-full justify-start text-sm sm:text-base"
					onClick={() => {
						setSidebarOpen(false);
						router.push('/login');
					}}
				>
					<LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
					Sign-out
				</Button>
			</div>
		</div>
	);

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Desktop Sidebar */}
			<div className="hidden md:flex md:w-64 md:flex-col">
				<SidebarContent />
			</div>

			{/* Mobile Sidebar */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="p-0 w-80">
					<SidebarContent />
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3 sm:space-x-4">
							{/* Mobile menu button */}
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="h-5 w-5" />
							</Button>

							{/* Page title */}
							{pageTitle && (
								<h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
									{pageTitle}
								</h1>
							)}

							{/* Search bar - hidden on very small screens */}
							{showSearch && (
								<form onSubmit={handleSearch} className="hidden sm:block">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
										<Input
											type="text"
											placeholder="Search..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="pl-10 w-64 lg:w-80 border-gray-300"
										/>
									</div>
								</form>
							)}
						</div>

						{/* Right side actions */}
						<div className="flex items-center space-x-2 sm:space-x-3">
							{/* Mobile search button */}
							{showSearch && (
								<Button variant="ghost" size="icon" className="sm:hidden">
									<Search className="h-5 w-5" />
								</Button>
							)}

							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-4 h-4 sm:w-5 sm:h-5" />
								<div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
							</Button>

							<Button variant="ghost" size="icon">
								<Settings className="w-4 h-4 sm:w-5 sm:h-5" />
							</Button>
						</div>
					</div>
				</header>

				{/* Main content area */}
				<main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
			</div>
		</div>
	);
}
