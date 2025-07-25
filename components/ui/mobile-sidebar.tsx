'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, X } from 'lucide-react';

interface SidebarItem {
	icon: React.ElementType;
	label: string;
	href: string;
	active?: boolean;
	badge?: string;
}

interface MobileSidebarProps {
	sidebarItems: SidebarItem[];
	userInfo?: {
		name: string;
		email?: string;
		avatar?: string;
		fallback: string;
		role?: string;
	};
	logoText: string;
	logoSubtext: string;
}

export function MobileSidebar({
	sidebarItems,
	userInfo,
	logoText,
	logoSubtext,
}: MobileSidebarProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0 w-80">
				<div className="flex h-full flex-col bg-gradient-to-b from-blue-600 to-blue-700 text-white">
					<div className="p-6">
						{/* User Info or Logo */}
						{userInfo ? (
							<div className="flex items-center space-x-3 mb-8">
								<Avatar className="w-12 h-12 border-2 border-white">
									<AvatarImage src={userInfo.avatar} />
									<AvatarFallback>{userInfo.fallback}</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<h3 className="font-bold text-sm truncate">
										{userInfo.name}
									</h3>
									{userInfo.email && (
										<p className="text-blue-100 text-xs truncate">
											{userInfo.email}
										</p>
									)}
									{userInfo.role && (
										<p className="text-blue-100 text-xs">{userInfo.role}</p>
									)}
								</div>
							</div>
						) : (
							<div className="flex items-center space-x-3 mb-8">
								<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
									<div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
										<div className="w-4 h-4 bg-white rounded-sm"></div>
									</div>
								</div>
								<div>
									<h2 className="text-xl font-bold">{logoText}</h2>
									<p className="text-blue-100 text-sm">{logoSubtext}</p>
								</div>
							</div>
						)}

						{/* Navigation */}
						<nav className="space-y-2">
							{sidebarItems.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									onClick={() => setOpen(false)}
									className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
										item.active
											? 'bg-white text-blue-600'
											: 'text-white hover:bg-blue-500'
									}`}
								>
									<item.icon className="w-5 h-5 flex-shrink-0" />
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
					<div className="mt-auto p-6">
						<Button
							variant="ghost"
							className="text-white hover:bg-blue-500 w-full justify-start"
							onClick={() => {
								setOpen(false);
								router.push('/login');
							}}
						>
							<LogOut className="w-5 h-5 mr-3" />
							Sign-out
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
