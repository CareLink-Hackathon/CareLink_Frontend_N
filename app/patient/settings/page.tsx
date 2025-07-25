'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Activity,
	Calendar,
	Star,
	FileText,
	Bell,
	Settings,
	HelpCircle,
	Bot,
	User,
	Lock,
	Smartphone,
	Shield,
	Eye,
	EyeOff,
	Camera,
	Upload,
	Edit,
	Save,
	Mail,
	Phone,
	MapPin,
	Calendar as CalendarIcon,
} from 'lucide-react';

export default function PatientSettings() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [notifications, setNotifications] = useState({
		appointments: true,
		medications: true,
		results: true,
		reminders: true,
		marketing: false,
	});
	const [privacy, setPrivacy] = useState({
		shareData: false,
		allowAnalytics: true,
		publicProfile: false,
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

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
		{ icon: FileText, label: 'Medical Records', href: '/patient/records' },
		{ icon: Star, label: 'Reviews & Feedback', href: '/patient/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/patient/notifications',
			badge: '3',
		},
		{
			icon: Settings,
			label: 'Settings',
			href: '/patient/settings',
			active: true,
		},
		{ icon: HelpCircle, label: 'Help Center', href: '/patient/help' },
	];

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleNotificationChange = (key: string, value: boolean) => {
		setNotifications((prev) => ({ ...prev, [key]: value }));
	};

	const handlePrivacyChange = (key: string, value: boolean) => {
		setPrivacy((prev) => ({ ...prev, [key]: value }));
	};

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
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							Settings
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Manage your account preferences
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

				{/* Settings Tabs - Mobile responsive */}
				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
						<TabsTrigger value="profile" className="text-xs sm:text-sm">
							<User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Profile
						</TabsTrigger>
						<TabsTrigger value="security" className="text-xs sm:text-sm">
							<Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Security
						</TabsTrigger>
						<TabsTrigger value="notifications" className="text-xs sm:text-sm">
							<Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Alerts
						</TabsTrigger>
						<TabsTrigger value="privacy" className="text-xs sm:text-sm">
							<Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							Privacy
						</TabsTrigger>
					</TabsList>

					{/* Profile Settings */}
					<TabsContent value="profile" className="space-y-4 sm:space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base sm:text-lg">
									Profile Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{/* Profile Image - Mobile responsive */}
								<div className="flex flex-col sm:flex-row items-center gap-4">
									<Avatar className="w-16 h-16 sm:w-20 sm:h-20">
										<AvatarImage src={profileImage || '/placeholder.svg'} />
										<AvatarFallback className="text-lg sm:text-xl">
											JD
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col sm:flex-row gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => fileInputRef.current?.click()}
											className="text-xs sm:text-sm"
										>
											<Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											Upload Photo
										</Button>
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</div>
								</div>

								{/* Personal Info Form - Mobile responsive */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName" className="text-xs sm:text-sm">
											First Name
										</Label>
										<Input
											id="firstName"
											defaultValue="John"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName" className="text-xs sm:text-sm">
											Last Name
										</Label>
										<Input
											id="lastName"
											defaultValue="Doe"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email" className="text-xs sm:text-sm">
											Email
										</Label>
										<Input
											id="email"
											type="email"
											defaultValue="john.doe@example.com"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone" className="text-xs sm:text-sm">
											Phone
										</Label>
										<Input
											id="phone"
											defaultValue="+1 (555) 123-4567"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="dob" className="text-xs sm:text-sm">
											Date of Birth
										</Label>
										<Input
											id="dob"
											type="date"
											defaultValue="1990-01-01"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="gender" className="text-xs sm:text-sm">
											Gender
										</Label>
										<Select defaultValue="male">
											<SelectTrigger className="text-sm sm:text-base">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="address" className="text-xs sm:text-sm">
										Address
									</Label>
									<Textarea
										id="address"
										defaultValue="123 Main St, City, State 12345"
										className="text-sm sm:text-base"
									/>
								</div>

								<Button className="w-full sm:w-auto">
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Security Settings */}
					<TabsContent value="security" className="space-y-4 sm:space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base sm:text-lg">
									Password & Security
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label
											htmlFor="currentPassword"
											className="text-xs sm:text-sm"
										>
											Current Password
										</Label>
										<div className="relative">
											<Input
												id="currentPassword"
												type={showPassword ? 'text' : 'password'}
												className="text-sm sm:text-base pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="w-3 h-3" />
												) : (
													<Eye className="w-3 h-3" />
												)}
											</Button>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newPassword" className="text-xs sm:text-sm">
											New Password
										</Label>
										<Input
											id="newPassword"
											type="password"
											className="text-sm sm:text-base"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="confirmPassword"
											className="text-xs sm:text-sm"
										>
											Confirm New Password
										</Label>
										<Input
											id="confirmPassword"
											type="password"
											className="text-sm sm:text-base"
										/>
									</div>
								</div>

								<Button className="w-full sm:w-auto">
									<Lock className="w-4 h-4 mr-2" />
									Update Password
								</Button>

								{/* Two-Factor Authentication */}
								<div className="pt-4 border-t border-gray-200">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
										<div>
											<h3 className="font-medium text-sm sm:text-base">
												Two-Factor Authentication
											</h3>
											<p className="text-xs sm:text-sm text-gray-600">
												Add an extra layer of security
											</p>
										</div>
										<Button
											variant="outline"
											size="sm"
											className="w-full sm:w-auto"
										>
											<Smartphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											Enable 2FA
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Notification Settings */}
					<TabsContent value="notifications" className="space-y-4 sm:space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base sm:text-lg">
									Notification Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{Object.entries(notifications).map(([key, value]) => (
									<div
										key={key}
										className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
									>
										<div>
											<h3 className="font-medium text-sm sm:text-base capitalize">
												{key === 'marketing' ? 'Marketing Communications' : key}
											</h3>
											<p className="text-xs sm:text-sm text-gray-600">
												{key === 'appointments' &&
													'Get notified about upcoming appointments'}
												{key === 'medications' &&
													'Reminders for medication schedules'}
												{key === 'results' && 'Test results and lab reports'}
												{key === 'reminders' && 'General health reminders'}
												{key === 'marketing' && 'Promotional emails and offers'}
											</p>
										</div>
										<Switch
											checked={value}
											onCheckedChange={(checked) =>
												handleNotificationChange(key, checked)
											}
										/>
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Privacy Settings */}
					<TabsContent value="privacy" className="space-y-4 sm:space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base sm:text-lg">
									Privacy & Data
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{Object.entries(privacy).map(([key, value]) => (
									<div
										key={key}
										className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
									>
										<div>
											<h3 className="font-medium text-sm sm:text-base">
												{key === 'shareData' && 'Share Data with Partners'}
												{key === 'allowAnalytics' && 'Allow Analytics'}
												{key === 'publicProfile' && 'Public Profile'}
											</h3>
											<p className="text-xs sm:text-sm text-gray-600">
												{key === 'shareData' &&
													'Share anonymized data for research'}
												{key === 'allowAnalytics' &&
													'Help improve our services'}
												{key === 'publicProfile' &&
													'Make your profile visible to others'}
											</p>
										</div>
										<Switch
											checked={value}
											onCheckedChange={(checked) =>
												handlePrivacyChange(key, checked)
											}
										/>
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</ResponsiveDashboardLayout>
	);
}
