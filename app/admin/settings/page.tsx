'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
	Save,
	Upload,
	Shield,
	Database,
	Mail,
	Phone,
	MapPin,
	Building,
	Globe,
	Clock,
	Palette,
	Monitor,
	Smartphone,
	Lock,
	Key,
	AlertTriangle,
	Droplets,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [logoImage, setLogoImage] = useState<string | null>(null);

	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Users, label: 'Doctors', href: '/admin/doctors' },
		{ icon: Users, label: 'Patients', href: '/admin/patients' },
		{ icon: FileText, label: 'Feedback Analytics', href: '/admin/feedback' },
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge: '5',
		},
		{
			icon: Settings,
			label: 'Settings',
			href: '/admin/settings',
			active: true,
		},
		{ icon: HelpCircle, label: 'Help Center', href: '/admin/help' },
	];

	const [hospitalSettings, setHospitalSettings] = useState({
		name: 'CareLink Medical Center',
		email: 'admin@carelink.com',
		phone: '+1 (555) 123-4567',
		address: '123 Medical Plaza, Healthcare City, HC 12345',
		website: 'https://carelink.com',
		description:
			'A leading healthcare facility providing comprehensive medical services with state-of-the-art technology and compassionate care.',
		establishedYear: '1995',
		licenseNumber: 'HL-2023-001',
		accreditation: 'JCI Accredited',
	});

	const [systemSettings, setSystemSettings] = useState({
		timezone: 'America/New_York',
		dateFormat: 'MM/DD/YYYY',
		timeFormat: '12-hour',
		language: 'English',
		currency: 'USD',
		maintenanceMode: false,
		allowRegistration: true,
		requireEmailVerification: true,
		sessionTimeout: '30',
		maxLoginAttempts: '5',
	});

	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		smsNotifications: true,
		pushNotifications: true,
		appointmentReminders: true,
		systemAlerts: true,
		maintenanceNotifications: true,
		emergencyAlerts: true,
		weeklyReports: false,
		monthlyReports: true,
	});

	const [securitySettings, setSecuritySettings] = useState({
		twoFactorAuth: true,
		passwordMinLength: '8',
		passwordRequireNumbers: true,
		passwordRequireSymbols: true,
		passwordRequireUppercase: true,
		passwordExpiry: '90',
		loginAuditLog: true,
		dataEncryption: true,
		backupFrequency: 'daily',
		backupRetention: '30',
	});

	const [appearanceSettings, setAppearanceSettings] = useState({
		primaryColor: '#3B82F6',
		secondaryColor: '#10B981',
		theme: 'light',
		fontFamily: 'Inter',
		showHospitalLogo: true,
		showWelcomeMessage: true,
		enableAnimations: true,
		compactMode: false,
	});

	const handleSave = async (settingType: string) => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			// Show success message
			console.log(`${settingType} settings saved successfully`);
		}, 1000);
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setLogoImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
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
							<h1 className="text-2xl font-bold text-gray-900">
								System Settings
							</h1>
						</div>

						<div className="flex items-center space-x-4">
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

				{/* Settings Content */}
				<div className="flex-1 p-4 md:p-6 overflow-y-auto">
					<div className="max-w-4xl mx-auto">
						<div className="mb-6">
							<p className="text-gray-600">
								Configure and manage your hospital management system settings
							</p>
						</div>

						<Tabs defaultValue="hospital" className="space-y-6">
							<TabsList className="grid w-full grid-cols-5">
								<TabsTrigger value="hospital">Hospital</TabsTrigger>
								<TabsTrigger value="system">System</TabsTrigger>
								<TabsTrigger value="notifications">Notifications</TabsTrigger>
								<TabsTrigger value="security">Security</TabsTrigger>
								<TabsTrigger value="appearance">Appearance</TabsTrigger>
							</TabsList>

							{/* Hospital Settings */}
							<TabsContent value="hospital" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Building className="w-5 h-5" />
											<span>Hospital Information</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										{/* Logo Upload */}
										<div className="space-y-4">
											<Label>Hospital Logo</Label>
											<div className="flex items-center space-x-4">
												<div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
													{logoImage ? (
														<img
															src={logoImage}
															alt="Logo"
															className="w-full h-full object-cover rounded-lg"
														/>
													) : (
														<Building className="w-8 h-8 text-gray-400" />
													)}
												</div>
												<div>
													<Button
														variant="outline"
														onClick={() => fileInputRef.current?.click()}
													>
														<Upload className="w-4 h-4 mr-2" />
														Upload Logo
													</Button>
													<input
														ref={fileInputRef}
														type="file"
														accept="image/*"
														onChange={handleImageUpload}
														className="hidden"
													/>
													<p className="text-sm text-gray-500 mt-1">
														Recommended: 200x200px, PNG or JPEG
													</p>
												</div>
											</div>
										</div>

										<Separator />

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="hospitalName">Hospital Name</Label>
												<Input
													id="hospitalName"
													value={hospitalSettings.name}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															name: e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="establishedYear">
													Established Year
												</Label>
												<Input
													id="establishedYear"
													value={hospitalSettings.establishedYear}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															establishedYear: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="email">Email Address</Label>
												<div className="relative">
													<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
													<Input
														id="email"
														type="email"
														className="pl-10"
														value={hospitalSettings.email}
														onChange={(e) =>
															setHospitalSettings({
																...hospitalSettings,
																email: e.target.value,
															})
														}
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">Phone Number</Label>
												<div className="relative">
													<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
													<Input
														id="phone"
														className="pl-10"
														value={hospitalSettings.phone}
														onChange={(e) =>
															setHospitalSettings({
																...hospitalSettings,
																phone: e.target.value,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="address">Address</Label>
											<div className="relative">
												<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
												<Input
													id="address"
													className="pl-10"
													value={hospitalSettings.address}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															address: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="website">Website</Label>
											<div className="relative">
												<Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
												<Input
													id="website"
													className="pl-10"
													value={hospitalSettings.website}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															website: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="licenseNumber">License Number</Label>
												<Input
													id="licenseNumber"
													value={hospitalSettings.licenseNumber}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															licenseNumber: e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="accreditation">Accreditation</Label>
												<Input
													id="accreditation"
													value={hospitalSettings.accreditation}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															accreditation: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="description">Description</Label>
											<Textarea
												id="description"
												rows={4}
												value={hospitalSettings.description}
												onChange={(e) =>
													setHospitalSettings({
														...hospitalSettings,
														description: e.target.value,
													})
												}
											/>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Hospital')}
												disabled={isLoading}
											>
												<Save className="w-4 h-4 mr-2" />
												{isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* System Settings */}
							<TabsContent value="system" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Settings className="w-5 h-5" />
											<span>System Configuration</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="timezone">Timezone</Label>
												<Select
													value={systemSettings.timezone}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															timezone: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="America/New_York">
															Eastern Time
														</SelectItem>
														<SelectItem value="America/Chicago">
															Central Time
														</SelectItem>
														<SelectItem value="America/Denver">
															Mountain Time
														</SelectItem>
														<SelectItem value="America/Los_Angeles">
															Pacific Time
														</SelectItem>
														<SelectItem value="UTC">UTC</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="language">Default Language</Label>
												<Select
													value={systemSettings.language}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															language: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="English">English</SelectItem>
														<SelectItem value="Spanish">Spanish</SelectItem>
														<SelectItem value="French">French</SelectItem>
														<SelectItem value="German">German</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div className="space-y-2">
												<Label htmlFor="dateFormat">Date Format</Label>
												<Select
													value={systemSettings.dateFormat}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															dateFormat: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="MM/DD/YYYY">
															MM/DD/YYYY
														</SelectItem>
														<SelectItem value="DD/MM/YYYY">
															DD/MM/YYYY
														</SelectItem>
														<SelectItem value="YYYY-MM-DD">
															YYYY-MM-DD
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="timeFormat">Time Format</Label>
												<Select
													value={systemSettings.timeFormat}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															timeFormat: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="12-hour">
															12-hour (AM/PM)
														</SelectItem>
														<SelectItem value="24-hour">24-hour</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="currency">Currency</Label>
												<Select
													value={systemSettings.currency}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															currency: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="USD">USD ($)</SelectItem>
														<SelectItem value="EUR">EUR (€)</SelectItem>
														<SelectItem value="GBP">GBP (£)</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">System Options</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Maintenance Mode</Label>
														<p className="text-sm text-gray-500">
															Temporarily disable the system for maintenance
														</p>
													</div>
													<Switch
														checked={systemSettings.maintenanceMode}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																maintenanceMode: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Allow New User Registration</Label>
														<p className="text-sm text-gray-500">
															Allow new patients to register accounts
														</p>
													</div>
													<Switch
														checked={systemSettings.allowRegistration}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																allowRegistration: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Require Email Verification</Label>
														<p className="text-sm text-gray-500">
															Require users to verify their email addresses
														</p>
													</div>
													<Switch
														checked={systemSettings.requireEmailVerification}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																requireEmailVerification: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="sessionTimeout">
													Session Timeout (minutes)
												</Label>
												<Input
													id="sessionTimeout"
													type="number"
													value={systemSettings.sessionTimeout}
													onChange={(e) =>
														setSystemSettings({
															...systemSettings,
															sessionTimeout: e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="maxLoginAttempts">
													Max Login Attempts
												</Label>
												<Input
													id="maxLoginAttempts"
													type="number"
													value={systemSettings.maxLoginAttempts}
													onChange={(e) =>
														setSystemSettings({
															...systemSettings,
															maxLoginAttempts: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('System')}
												disabled={isLoading}
											>
												<Save className="w-4 h-4 mr-2" />
												{isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Notification Settings */}
							<TabsContent value="notifications" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Bell className="w-5 h-5" />
											<span>Notification Preferences</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-4">
											<h4 className="font-semibold">Communication Channels</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Email Notifications</Label>
														<p className="text-sm text-gray-500">
															Send notifications via email
														</p>
													</div>
													<Switch
														checked={notificationSettings.emailNotifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																emailNotifications: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>SMS Notifications</Label>
														<p className="text-sm text-gray-500">
															Send notifications via SMS
														</p>
													</div>
													<Switch
														checked={notificationSettings.smsNotifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																smsNotifications: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Push Notifications</Label>
														<p className="text-sm text-gray-500">
															Send browser/app push notifications
														</p>
													</div>
													<Switch
														checked={notificationSettings.pushNotifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																pushNotifications: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">Notification Types</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Appointment Reminders</Label>
														<p className="text-sm text-gray-500">
															Automatic appointment reminders to patients
														</p>
													</div>
													<Switch
														checked={notificationSettings.appointmentReminders}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																appointmentReminders: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>System Alerts</Label>
														<p className="text-sm text-gray-500">
															System-wide alerts and announcements
														</p>
													</div>
													<Switch
														checked={notificationSettings.systemAlerts}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																systemAlerts: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Maintenance Notifications</Label>
														<p className="text-sm text-gray-500">
															Scheduled maintenance notifications
														</p>
													</div>
													<Switch
														checked={
															notificationSettings.maintenanceNotifications
														}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																maintenanceNotifications: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Emergency Alerts</Label>
														<p className="text-sm text-gray-500">
															Critical emergency notifications
														</p>
													</div>
													<Switch
														checked={notificationSettings.emergencyAlerts}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																emergencyAlerts: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">Reports</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Weekly Reports</Label>
														<p className="text-sm text-gray-500">
															Weekly system activity reports
														</p>
													</div>
													<Switch
														checked={notificationSettings.weeklyReports}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																weeklyReports: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Monthly Reports</Label>
														<p className="text-sm text-gray-500">
															Monthly analytics and summary reports
														</p>
													</div>
													<Switch
														checked={notificationSettings.monthlyReports}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																monthlyReports: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Notifications')}
												disabled={isLoading}
											>
												<Save className="w-4 h-4 mr-2" />
												{isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Security Settings */}
							<TabsContent value="security" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Shield className="w-5 h-5" />
											<span>Security & Privacy</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-4">
											<h4 className="font-semibold">Authentication</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Two-Factor Authentication</Label>
														<p className="text-sm text-gray-500">
															Require 2FA for all admin accounts
														</p>
													</div>
													<Switch
														checked={securitySettings.twoFactorAuth}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																twoFactorAuth: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Login Audit Log</Label>
														<p className="text-sm text-gray-500">
															Log all login attempts and activities
														</p>
													</div>
													<Switch
														checked={securitySettings.loginAuditLog}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																loginAuditLog: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">Password Policy</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<Label htmlFor="passwordMinLength">
														Minimum Password Length
													</Label>
													<Input
														id="passwordMinLength"
														type="number"
														value={securitySettings.passwordMinLength}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																passwordMinLength: e.target.value,
															})
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="passwordExpiry">
														Password Expiry (days)
													</Label>
													<Input
														id="passwordExpiry"
														type="number"
														value={securitySettings.passwordExpiry}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																passwordExpiry: e.target.value,
															})
														}
													/>
												</div>
											</div>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Require Numbers</Label>
														<p className="text-sm text-gray-500">
															Password must contain numbers
														</p>
													</div>
													<Switch
														checked={securitySettings.passwordRequireNumbers}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																passwordRequireNumbers: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Require Symbols</Label>
														<p className="text-sm text-gray-500">
															Password must contain special characters
														</p>
													</div>
													<Switch
														checked={securitySettings.passwordRequireSymbols}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																passwordRequireSymbols: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Require Uppercase</Label>
														<p className="text-sm text-gray-500">
															Password must contain uppercase letters
														</p>
													</div>
													<Switch
														checked={securitySettings.passwordRequireUppercase}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																passwordRequireUppercase: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">Data Protection</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Data Encryption</Label>
														<p className="text-sm text-gray-500">
															Encrypt sensitive data at rest
														</p>
													</div>
													<Switch
														checked={securitySettings.dataEncryption}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																dataEncryption: checked,
															})
														}
													/>
												</div>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<Label htmlFor="backupFrequency">
														Backup Frequency
													</Label>
													<Select
														value={securitySettings.backupFrequency}
														onValueChange={(value) =>
															setSecuritySettings({
																...securitySettings,
																backupFrequency: value,
															})
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="hourly">Hourly</SelectItem>
															<SelectItem value="daily">Daily</SelectItem>
															<SelectItem value="weekly">Weekly</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="backupRetention">
														Backup Retention (days)
													</Label>
													<Input
														id="backupRetention"
														type="number"
														value={securitySettings.backupRetention}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																backupRetention: e.target.value,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Security')}
												disabled={isLoading}
											>
												<Save className="w-4 h-4 mr-2" />
												{isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Appearance Settings */}
							<TabsContent value="appearance" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<Palette className="w-5 h-5" />
											<span>Appearance & Theming</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="primaryColor">Primary Color</Label>
												<div className="flex items-center space-x-2">
													<Input
														id="primaryColor"
														type="color"
														value={appearanceSettings.primaryColor}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																primaryColor: e.target.value,
															})
														}
														className="w-16 h-10"
													/>
													<Input
														value={appearanceSettings.primaryColor}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																primaryColor: e.target.value,
															})
														}
														className="flex-1"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor="secondaryColor">Secondary Color</Label>
												<div className="flex items-center space-x-2">
													<Input
														id="secondaryColor"
														type="color"
														value={appearanceSettings.secondaryColor}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																secondaryColor: e.target.value,
															})
														}
														className="w-16 h-10"
													/>
													<Input
														value={appearanceSettings.secondaryColor}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																secondaryColor: e.target.value,
															})
														}
														className="flex-1"
													/>
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="theme">Theme</Label>
												<Select
													value={appearanceSettings.theme}
													onValueChange={(value) =>
														setAppearanceSettings({
															...appearanceSettings,
															theme: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="light">Light</SelectItem>
														<SelectItem value="dark">Dark</SelectItem>
														<SelectItem value="auto">Auto (System)</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="fontFamily">Font Family</Label>
												<Select
													value={appearanceSettings.fontFamily}
													onValueChange={(value) =>
														setAppearanceSettings({
															...appearanceSettings,
															fontFamily: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Inter">Inter</SelectItem>
														<SelectItem value="Roboto">Roboto</SelectItem>
														<SelectItem value="Open Sans">Open Sans</SelectItem>
														<SelectItem value="Poppins">Poppins</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-semibold">Interface Options</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div>
														<Label>Show Hospital Logo</Label>
														<p className="text-sm text-gray-500">
															Display hospital logo in the header
														</p>
													</div>
													<Switch
														checked={appearanceSettings.showHospitalLogo}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																showHospitalLogo: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Show Welcome Message</Label>
														<p className="text-sm text-gray-500">
															Display welcome message on dashboard
														</p>
													</div>
													<Switch
														checked={appearanceSettings.showWelcomeMessage}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																showWelcomeMessage: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Enable Animations</Label>
														<p className="text-sm text-gray-500">
															Enable UI animations and transitions
														</p>
													</div>
													<Switch
														checked={appearanceSettings.enableAnimations}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																enableAnimations: checked,
															})
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<div>
														<Label>Compact Mode</Label>
														<p className="text-sm text-gray-500">
															Use compact layout for better space utilization
														</p>
													</div>
													<Switch
														checked={appearanceSettings.compactMode}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																compactMode: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Appearance')}
												disabled={isLoading}
											>
												<Save className="w-4 h-4 mr-2" />
												{isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}
