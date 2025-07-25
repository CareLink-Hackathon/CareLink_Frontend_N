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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
	User,
	Shield,
	Palette,
	Clock,
	Phone,
	Mail,
	MapPin,
	Camera,
	Save,
	Eye,
	EyeOff,
	Upload,
} from 'lucide-react';

export default function DoctorSettings() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [profileData, setProfileData] = useState({
		firstName: 'Sarah',
		lastName: 'Johnson',
		email: 'sarah.johnson@carelink.com',
		phone: '+1 (555) 123-4567',
		address: '123 Medical Center Dr, City, State 12345',
		specialty: 'Cardiology',
		licenseNumber: 'MD123456789',
		experience: '15 years',
		education: 'Harvard Medical School',
		bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in interventional cardiology and has performed over 2,000 cardiac procedures.',
	});

	const [notifications, setNotifications] = useState({
		emailNotifications: true,
		smsNotifications: false,
		appointmentReminders: true,
		patientMessages: true,
		systemUpdates: false,
		emergencyAlerts: true,
		marketingEmails: false,
	});

	const [preferences, setPreferences] = useState({
		theme: 'light',
		language: 'english',
		timezone: 'UTC-5',
		dateFormat: 'MM/DD/YYYY',
		timeFormat: '12-hour',
		autoSave: true,
		compactView: false,
	});

	const [schedule, setSchedule] = useState({
		monday: { start: '09:00', end: '17:00', enabled: true },
		tuesday: { start: '09:00', end: '17:00', enabled: true },
		wednesday: { start: '09:00', end: '17:00', enabled: true },
		thursday: { start: '09:00', end: '17:00', enabled: true },
		friday: { start: '09:00', end: '17:00', enabled: true },
		saturday: { start: '10:00', end: '14:00', enabled: false },
		sunday: { start: '10:00', end: '14:00', enabled: false },
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
		{
			icon: Settings,
			label: 'Settings',
			href: '/doctor/settings',
			active: true,
		},
		{ icon: HelpCircle, label: 'Help Center', href: '/doctor/help' },
	];

	const handleProfileUpdate = () => {
		// Simulate profile update
		console.log('Profile updated:', profileData);
		// Show success message
	};

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

	const handleNotificationUpdate = () => {
		// Simulate notification settings update
		console.log('Notification settings updated:', notifications);
		// Show success message
	};

	const handlePreferencesUpdate = () => {
		// Simulate preferences update
		console.log('Preferences updated:', preferences);
		// Show success message
	};

	const handleScheduleUpdate = () => {
		// Simulate schedule update
		console.log('Schedule updated:', schedule);
		// Show success message
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
				<div className="p-6">
					<div className="flex items-center space-x-3 mb-8">
						<Avatar className="w-16 h-16 border-2 border-white">
							<AvatarImage
								src={profileImage || '/placeholder.svg?height=64&width=64'}
							/>
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
							<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
						</div>
						<div className="flex items-center space-x-4">
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

				{/* Settings Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<Tabs defaultValue="profile" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger
								value="profile"
								className="flex items-center space-x-2"
							>
								<User className="w-4 h-4" />
								<span>Profile</span>
							</TabsTrigger>
							<TabsTrigger
								value="notifications"
								className="flex items-center space-x-2"
							>
								<Bell className="w-4 h-4" />
								<span>Notifications</span>
							</TabsTrigger>
							<TabsTrigger
								value="preferences"
								className="flex items-center space-x-2"
							>
								<Palette className="w-4 h-4" />
								<span>Preferences</span>
							</TabsTrigger>
							<TabsTrigger
								value="schedule"
								className="flex items-center space-x-2"
							>
								<Clock className="w-4 h-4" />
								<span>Schedule</span>
							</TabsTrigger>
							<TabsTrigger
								value="security"
								className="flex items-center space-x-2"
							>
								<Shield className="w-4 h-4" />
								<span>Security</span>
							</TabsTrigger>
						</TabsList>

						{/* Profile Settings */}
						<TabsContent value="profile" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Profile Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Profile Picture */}
									<div className="flex items-center space-x-6">
										<Avatar className="w-24 h-24">
											<AvatarImage
												src={
													profileImage || '/placeholder.svg?height=96&width=96'
												}
											/>
											<AvatarFallback>SJ</AvatarFallback>
										</Avatar>
										<div>
											<Button
												variant="outline"
												onClick={() => fileInputRef.current?.click()}
											>
												<Camera className="w-4 h-4 mr-2" />
												Change Photo
											</Button>
											<p className="text-sm text-gray-500 mt-2">
												JPG, PNG or GIF. Max size 2MB
											</p>
											<input
												type="file"
												ref={fileInputRef}
												onChange={handleImageUpload}
												accept="image/*"
												className="hidden"
											/>
										</div>
									</div>

									{/* Basic Information */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<Label htmlFor="firstName">First Name</Label>
											<Input
												id="firstName"
												value={profileData.firstName}
												onChange={(e) =>
													setProfileData({
														...profileData,
														firstName: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="lastName">Last Name</Label>
											<Input
												id="lastName"
												value={profileData.lastName}
												onChange={(e) =>
													setProfileData({
														...profileData,
														lastName: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="email">Email Address</Label>
											<Input
												id="email"
												type="email"
												value={profileData.email}
												onChange={(e) =>
													setProfileData({
														...profileData,
														email: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="phone">Phone Number</Label>
											<Input
												id="phone"
												value={profileData.phone}
												onChange={(e) =>
													setProfileData({
														...profileData,
														phone: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="specialty">Specialty</Label>
											<Input
												id="specialty"
												value={profileData.specialty}
												onChange={(e) =>
													setProfileData({
														...profileData,
														specialty: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="license">Medical License Number</Label>
											<Input
												id="license"
												value={profileData.licenseNumber}
												onChange={(e) =>
													setProfileData({
														...profileData,
														licenseNumber: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="experience">Years of Experience</Label>
											<Input
												id="experience"
												value={profileData.experience}
												onChange={(e) =>
													setProfileData({
														...profileData,
														experience: e.target.value,
													})
												}
											/>
										</div>
										<div>
											<Label htmlFor="education">Education</Label>
											<Input
												id="education"
												value={profileData.education}
												onChange={(e) =>
													setProfileData({
														...profileData,
														education: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="address">Address</Label>
										<Input
											id="address"
											value={profileData.address}
											onChange={(e) =>
												setProfileData({
													...profileData,
													address: e.target.value,
												})
											}
										/>
									</div>

									<div>
										<Label htmlFor="bio">Bio</Label>
										<Textarea
											id="bio"
											value={profileData.bio}
											onChange={(e) =>
												setProfileData({ ...profileData, bio: e.target.value })
											}
											className="min-h-[100px]"
										/>
									</div>

									<Button
										onClick={handleProfileUpdate}
										className="bg-blue-600 hover:bg-blue-700"
									>
										<Save className="w-4 h-4 mr-2" />
										Save Changes
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Notification Settings */}
						<TabsContent value="notifications" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Notification Preferences</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="email-notifications">
													Email Notifications
												</Label>
												<p className="text-sm text-gray-500">
													Receive notifications via email
												</p>
											</div>
											<Switch
												id="email-notifications"
												checked={notifications.emailNotifications}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														emailNotifications: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="sms-notifications">
													SMS Notifications
												</Label>
												<p className="text-sm text-gray-500">
													Receive notifications via text message
												</p>
											</div>
											<Switch
												id="sms-notifications"
												checked={notifications.smsNotifications}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														smsNotifications: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="appointment-reminders">
													Appointment Reminders
												</Label>
												<p className="text-sm text-gray-500">
													Get reminded about upcoming appointments
												</p>
											</div>
											<Switch
												id="appointment-reminders"
												checked={notifications.appointmentReminders}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														appointmentReminders: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="patient-messages">
													Patient Messages
												</Label>
												<p className="text-sm text-gray-500">
													Notifications for patient messages
												</p>
											</div>
											<Switch
												id="patient-messages"
												checked={notifications.patientMessages}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														patientMessages: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="system-updates">System Updates</Label>
												<p className="text-sm text-gray-500">
													Updates about system maintenance and new features
												</p>
											</div>
											<Switch
												id="system-updates"
												checked={notifications.systemUpdates}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														systemUpdates: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label
													htmlFor="emergency-alerts"
													className="text-red-600"
												>
													Emergency Alerts
												</Label>
												<p className="text-sm text-gray-500">
													Critical emergency notifications (recommended)
												</p>
											</div>
											<Switch
												id="emergency-alerts"
												checked={notifications.emergencyAlerts}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														emergencyAlerts: checked,
													})
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="marketing-emails">
													Marketing Emails
												</Label>
												<p className="text-sm text-gray-500">
													Promotional and marketing communications
												</p>
											</div>
											<Switch
												id="marketing-emails"
												checked={notifications.marketingEmails}
												onCheckedChange={(checked) =>
													setNotifications({
														...notifications,
														marketingEmails: checked,
													})
												}
											/>
										</div>
									</div>

									<Button
										onClick={handleNotificationUpdate}
										className="bg-blue-600 hover:bg-blue-700"
									>
										<Save className="w-4 h-4 mr-2" />
										Save Preferences
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Preferences */}
						<TabsContent value="preferences" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Application Preferences</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<Label htmlFor="theme">Theme</Label>
											<select
												id="theme"
												value={preferences.theme}
												onChange={(e) =>
													setPreferences({
														...preferences,
														theme: e.target.value,
													})
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
											>
												<option value="light">Light</option>
												<option value="dark">Dark</option>
												<option value="auto">Auto</option>
											</select>
										</div>

										<div>
											<Label htmlFor="language">Language</Label>
											<select
												id="language"
												value={preferences.language}
												onChange={(e) =>
													setPreferences({
														...preferences,
														language: e.target.value,
													})
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
											>
												<option value="english">English</option>
												<option value="spanish">Spanish</option>
												<option value="french">French</option>
											</select>
										</div>

										<div>
											<Label htmlFor="timezone">Timezone</Label>
											<select
												id="timezone"
												value={preferences.timezone}
												onChange={(e) =>
													setPreferences({
														...preferences,
														timezone: e.target.value,
													})
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
											>
												<option value="UTC-5">Eastern Time (UTC-5)</option>
												<option value="UTC-6">Central Time (UTC-6)</option>
												<option value="UTC-7">Mountain Time (UTC-7)</option>
												<option value="UTC-8">Pacific Time (UTC-8)</option>
											</select>
										</div>

										<div>
											<Label htmlFor="dateFormat">Date Format</Label>
											<select
												id="dateFormat"
												value={preferences.dateFormat}
												onChange={(e) =>
													setPreferences({
														...preferences,
														dateFormat: e.target.value,
													})
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
											>
												<option value="MM/DD/YYYY">MM/DD/YYYY</option>
												<option value="DD/MM/YYYY">DD/MM/YYYY</option>
												<option value="YYYY-MM-DD">YYYY-MM-DD</option>
											</select>
										</div>

										<div>
											<Label htmlFor="timeFormat">Time Format</Label>
											<select
												id="timeFormat"
												value={preferences.timeFormat}
												onChange={(e) =>
													setPreferences({
														...preferences,
														timeFormat: e.target.value,
													})
												}
												className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
											>
												<option value="12-hour">12-hour</option>
												<option value="24-hour">24-hour</option>
											</select>
										</div>
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="auto-save">Auto-save</Label>
												<p className="text-sm text-gray-500">
													Automatically save changes
												</p>
											</div>
											<Switch
												id="auto-save"
												checked={preferences.autoSave}
												onCheckedChange={(checked) =>
													setPreferences({ ...preferences, autoSave: checked })
												}
											/>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label htmlFor="compact-view">Compact View</Label>
												<p className="text-sm text-gray-500">
													Use compact layout for lists
												</p>
											</div>
											<Switch
												id="compact-view"
												checked={preferences.compactView}
												onCheckedChange={(checked) =>
													setPreferences({
														...preferences,
														compactView: checked,
													})
												}
											/>
										</div>
									</div>

									<Button
										onClick={handlePreferencesUpdate}
										className="bg-blue-600 hover:bg-blue-700"
									>
										<Save className="w-4 h-4 mr-2" />
										Save Preferences
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Schedule */}
						<TabsContent value="schedule" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Working Hours</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{Object.entries(schedule).map(([day, daySchedule]) => (
										<div
											key={day}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex items-center space-x-4">
												<Switch
													checked={daySchedule.enabled}
													onCheckedChange={(checked) =>
														setSchedule({
															...schedule,
															[day]: { ...daySchedule, enabled: checked },
														})
													}
												/>
												<Label className="capitalize font-medium w-20">
													{day}
												</Label>
											</div>
											{daySchedule.enabled && (
												<div className="flex items-center space-x-2">
													<Input
														type="time"
														value={daySchedule.start}
														onChange={(e) =>
															setSchedule({
																...schedule,
																[day]: {
																	...daySchedule,
																	start: e.target.value,
																},
															})
														}
														className="w-32"
													/>
													<span>to</span>
													<Input
														type="time"
														value={daySchedule.end}
														onChange={(e) =>
															setSchedule({
																...schedule,
																[day]: { ...daySchedule, end: e.target.value },
															})
														}
														className="w-32"
													/>
												</div>
											)}
										</div>
									))}

									<Button
										onClick={handleScheduleUpdate}
										className="bg-blue-600 hover:bg-blue-700"
									>
										<Save className="w-4 h-4 mr-2" />
										Save Schedule
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Security */}
						<TabsContent value="security" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Security Settings</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<Label htmlFor="current-password">Current Password</Label>
										<div className="relative">
											<Input
												id="current-password"
												type={showPassword ? 'text' : 'password'}
												placeholder="Enter current password"
											/>
											<Button
												variant="ghost"
												size="icon"
												className="absolute right-2 top-1/2 transform -translate-y-1/2"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>

									<div>
										<Label htmlFor="new-password">New Password</Label>
										<Input
											id="new-password"
											type="password"
											placeholder="Enter new password"
										/>
									</div>

									<div>
										<Label htmlFor="confirm-password">
											Confirm New Password
										</Label>
										<Input
											id="confirm-password"
											type="password"
											placeholder="Confirm new password"
										/>
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<Label>Two-Factor Authentication</Label>
												<p className="text-sm text-gray-500">
													Add an extra layer of security
												</p>
											</div>
											<Button variant="outline">Enable 2FA</Button>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label>Login Notifications</Label>
												<p className="text-sm text-gray-500">
													Get notified when someone logs into your account
												</p>
											</div>
											<Switch defaultChecked />
										</div>

										<div className="flex items-center justify-between">
											<div>
												<Label>Session Timeout</Label>
												<p className="text-sm text-gray-500">
													Automatically log out after inactivity
												</p>
											</div>
											<select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
												<option value="30">30 minutes</option>
												<option value="60">1 hour</option>
												<option value="120">2 hours</option>
												<option value="240">4 hours</option>
											</select>
										</div>
									</div>

									<Button className="bg-blue-600 hover:bg-blue-700">
										<Save className="w-4 h-4 mr-2" />
										Update Security Settings
									</Button>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
