'use client';

import { useState, useRef, useEffect } from 'react';
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
	LogOut,
	Settings,
	Bell,
	Loader2,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
	const router = useRouter();
	const { user } = useAuth();
	const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [logoImage, setLogoImage] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});

	const {
		loading,
		error,
		fetchHospitalSettings,
		updateHospitalSettings,
		fetchSystemSettings,
		updateSystemSettings,
		fetchNotificationSettings,
		updateNotificationSettings,
		fetchSecuritySettings,
		updateSecuritySettings,
		fetchAppearanceSettings,
		updateAppearanceSettings,
		uploadLogo,
		clearError,
	} = useAdminSettings();

	const sidebarItems = getAdminSidebarItems('settings');
	const userInfo = getAdminUserInfo({ first_name: 'Admin', last_name: 'User' });

	// Settings state
	const [hospitalSettings, setHospitalSettings] = useState({
		name: 'CareLink Medical Center',
		email: 'admin@carelink.com',
		phone: '+1 (555) 123-4567',
		address: '123 Medical Plaza, Healthcare City, HC 12345',
		website: 'https://carelink.com',
		description: 'A leading healthcare facility providing comprehensive medical services with state-of-the-art technology and compassionate care.',
		established_year: '1995',
		license_number: 'HL-2023-001',
		accreditation: 'JCI Accredited',
		logo_url: undefined as string | undefined,
	});

	const [systemSettings, setSystemSettings] = useState({
		timezone: 'America/New_York',
		date_format: 'MM/DD/YYYY',
		time_format: '12-hour',
		language: 'English',
		currency: 'USD',
		maintenance_mode: false,
		allow_registration: true,
		require_email_verification: true,
		session_timeout: 30,
		max_login_attempts: 5,
	});

	const [notificationSettings, setNotificationSettings] = useState({
		email_notifications: true,
		sms_notifications: true,
		push_notifications: true,
		appointment_reminders: true,
		system_alerts: true,
		maintenance_notifications: true,
		emergency_alerts: true,
		weekly_reports: false,
		monthly_reports: true,
	});

	const [securitySettings, setSecuritySettings] = useState({
		two_factor_auth: true,
		password_min_length: 8,
		password_require_numbers: true,
		password_require_symbols: true,
		password_require_uppercase: true,
		password_expiry: 90,
		login_audit_log: true,
		data_encryption: true,
		backup_frequency: 'daily',
		backup_retention: 30,
	});

	const [appearanceSettings, setAppearanceSettings] = useState({
		primary_color: '#3B82F6',
		secondary_color: '#10B981',
		theme: 'light',
		font_family: 'Inter',
		show_hospital_logo: true,
		show_welcome_message: true,
		enable_animations: true,
		compact_mode: false,
	});

	// Load settings on component mount
	useEffect(() => {
		loadAllSettings();
	}, []);

	const loadAllSettings = async () => {
		try {
			const [hospital, system, notifications, security, appearance] = await Promise.all([
				fetchHospitalSettings(),
				fetchSystemSettings(),
				fetchNotificationSettings(),
				fetchSecuritySettings(),
				fetchAppearanceSettings(),
			]);

			if (hospital) {
				setHospitalSettings({
					name: hospital.name || '',
					email: hospital.email || '',
					phone: hospital.phone || '',
					address: hospital.address || '',
					website: hospital.website || '',
					description: hospital.description || '',
					established_year: hospital.established_year || '',
					license_number: hospital.license_number || '',
					accreditation: hospital.accreditation || '',
					logo_url: hospital.logo_url,
				});
			}
			if (system) setSystemSettings(system);
			if (notifications) setNotificationSettings(notifications);
			if (security) setSecuritySettings(security);
			if (appearance) setAppearanceSettings(appearance);
		} catch (error) {
			console.error('Error loading settings:', error);
		}
	};

	const handleSave = async (settingType: string) => {
		setIsSaving(prev => ({ ...prev, [settingType]: true }));

		try {
			let success = false;

			switch (settingType) {
				case 'Hospital':
					success = await updateHospitalSettings(hospitalSettings);
					break;
				case 'System':
					success = await updateSystemSettings(systemSettings);
					break;
				case 'Notifications':
					success = await updateNotificationSettings(notificationSettings);
					break;
				case 'Security':
					success = await updateSecuritySettings(securitySettings);
					break;
				case 'Appearance':
					success = await updateAppearanceSettings(appearanceSettings);
					break;
			}

			if (success) {
				toast({
					title: 'Settings Updated',
					description: `${settingType} settings have been saved successfully.`,
					duration: 3000,
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: `Failed to save ${settingType.toLowerCase()} settings. Please try again.`,
				variant: 'destructive',
				duration: 3000,
			});
		} finally {
			setIsSaving(prev => ({ ...prev, [settingType]: false }));
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: 'Please select an image smaller than 5MB.',
					variant: 'destructive',
				});
				return;
			}

			// Validate file type
			if (!file.type.startsWith('image/')) {
				toast({
					title: 'Invalid file type',
					description: 'Please select an image file.',
					variant: 'destructive',
				});
				return;
			}

			try {
				const logoUrl = await uploadLogo(file);
				if (logoUrl) {
					setLogoImage(logoUrl);
					setHospitalSettings(prev => ({ ...prev, logo_url: logoUrl }));
					toast({
						title: 'Logo uploaded',
						description: 'Hospital logo has been updated successfully.',
						duration: 3000,
					});
				}
			} catch (error) {
				toast({
					title: 'Upload failed',
					description: 'Failed to upload logo. Please try again.',
					variant: 'destructive',
				});
			}
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
													value={hospitalSettings.established_year}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															established_year: e.target.value,
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
													value={hospitalSettings.license_number}
													onChange={(e) =>
														setHospitalSettings({
															...hospitalSettings,
															license_number: e.target.value,
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
												disabled={loading}
											>
												<Save className="w-4 h-4 mr-2" />
												{loading ? 'Saving...' : 'Save Changes'}
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
													value={systemSettings.date_format}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															date_format: value,
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
													value={systemSettings.time_format}
													onValueChange={(value) =>
														setSystemSettings({
															...systemSettings,
															time_format: value,
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
														checked={systemSettings.maintenance_mode}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																maintenance_mode: checked,
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
														checked={systemSettings.allow_registration}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																allow_registration: checked,
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
														checked={systemSettings.require_email_verification}
														onCheckedChange={(checked) =>
															setSystemSettings({
																...systemSettings,
																require_email_verification: checked,
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
													value={systemSettings.session_timeout}
													onChange={(e) =>
														setSystemSettings({
															...systemSettings,
															session_timeout: parseInt(e.target.value) || 0,
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
													value={systemSettings.max_login_attempts}
													onChange={(e) =>
														setSystemSettings({
															...systemSettings,
															max_login_attempts: parseInt(e.target.value) || 0,
														})
													}
												/>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('System')}
												disabled={loading}
											>
												<Save className="w-4 h-4 mr-2" />
												{loading ? 'Saving...' : 'Save Changes'}
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
														checked={notificationSettings.email_notifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																email_notifications: checked,
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
														checked={notificationSettings.sms_notifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																sms_notifications: checked,
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
														checked={notificationSettings.push_notifications}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																push_notifications: checked,
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
														checked={notificationSettings.appointment_reminders}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																appointment_reminders: checked,
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
														checked={notificationSettings.system_alerts}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																system_alerts: checked,
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
															notificationSettings.maintenance_notifications
														}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																maintenance_notifications: checked,
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
														checked={notificationSettings.emergency_alerts}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																emergency_alerts: checked,
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
														checked={notificationSettings.weekly_reports}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																weekly_reports: checked,
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
														checked={notificationSettings.monthly_reports}
														onCheckedChange={(checked) =>
															setNotificationSettings({
																...notificationSettings,
																monthly_reports: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Notifications')}
												disabled={loading}
											>
												<Save className="w-4 h-4 mr-2" />
												{loading ? 'Saving...' : 'Save Changes'}
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
														checked={securitySettings.two_factor_auth}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																two_factor_auth: checked,
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
														checked={securitySettings.login_audit_log}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																login_audit_log: checked,
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
														value={securitySettings.password_min_length}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																password_min_length: parseInt(e.target.value) || 0,
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
														value={securitySettings.password_expiry}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																password_expiry: parseInt(e.target.value) || 0,
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
														checked={securitySettings.password_require_numbers}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																password_require_numbers: checked,
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
														checked={securitySettings.password_require_symbols}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																password_require_symbols: checked,
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
														checked={securitySettings.password_require_uppercase}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																password_require_uppercase: checked,
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
														checked={securitySettings.data_encryption}
														onCheckedChange={(checked) =>
															setSecuritySettings({
																...securitySettings,
																data_encryption: checked,
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
														value={securitySettings.backup_frequency}
														onValueChange={(value) =>
															setSecuritySettings({
																...securitySettings,
																backup_frequency: value,
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
														value={securitySettings.backup_retention}
														onChange={(e) =>
															setSecuritySettings({
																...securitySettings,
																backup_retention: parseInt(e.target.value) || 0,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Security')}
												disabled={loading}
											>
												<Save className="w-4 h-4 mr-2" />
												{loading ? 'Saving...' : 'Save Changes'}
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
														value={appearanceSettings.primary_color}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																primary_color: e.target.value,
															})
														}
														className="w-16 h-10"
													/>
													<Input
														value={appearanceSettings.primary_color}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																primary_color: e.target.value,
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
														value={appearanceSettings.secondary_color}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																secondary_color: e.target.value,
															})
														}
														className="w-16 h-10"
													/>
													<Input
														value={appearanceSettings.secondary_color}
														onChange={(e) =>
															setAppearanceSettings({
																...appearanceSettings,
																secondary_color: e.target.value,
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
													value={appearanceSettings.font_family}
													onValueChange={(value) =>
														setAppearanceSettings({
															...appearanceSettings,
															font_family: value,
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
														checked={appearanceSettings.show_hospital_logo}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																show_hospital_logo: checked,
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
														checked={appearanceSettings.show_welcome_message}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																show_welcome_message: checked,
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
														checked={appearanceSettings.enable_animations}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																enable_animations: checked,
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
														checked={appearanceSettings.compact_mode}
														onCheckedChange={(checked) =>
															setAppearanceSettings({
																...appearanceSettings,
																compact_mode: checked,
															})
														}
													/>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button
												onClick={() => handleSave('Appearance')}
												disabled={loading}
											>
												<Save className="w-4 h-4 mr-2" />
												{loading ? 'Saving...' : 'Save Changes'}
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
