import {
	Calendar,
	Users,
	Activity,
	FileText,
	UserCheck,
	Clock,
	Bell,
	Settings,
	HelpCircle,
	Droplets,
	Building2,
} from 'lucide-react';

export function getAdminSidebarItems(activePage: string) {
	return [
		{
			icon: Activity,
			label: 'Dashboard',
			href: '/admin/dashboard',
			active: activePage === 'dashboard',
		},
		{ 
			icon: Calendar, 
			label: 'Appointments', 
			href: '/admin/appointments',
			active: activePage === 'appointments',
		},
		{ 
			icon: Droplets, 
			label: 'Blood Bank', 
			href: '/admin/blood-bank',
			active: activePage === 'blood-bank',
		},
		{ 
			icon: Building2, 
			label: 'Departments', 
			href: '/admin/departments',
			active: activePage === 'departments',
		},
		{ 
			icon: Users, 
			label: 'Doctors', 
			href: '/admin/doctors',
			active: activePage === 'doctors',
		},
		{ 
			icon: Users, 
			label: 'Patients', 
			href: '/admin/patients',
			active: activePage === 'patients',
		},
		{ 
			icon: FileText, 
			label: 'Feedback Analytics', 
			href: '/admin/feedback',
			active: activePage === 'feedback',
		},
		{
			icon: Bell,
			label: 'Notifications',
			href: '/admin/notifications',
			badge: '0',
			active: activePage === 'notifications',
		},
		{ 
			icon: Settings, 
			label: 'Settings', 
			href: '/admin/settings',
			active: activePage === 'settings',
		},
		{ 
			icon: HelpCircle, 
			label: 'Help Center', 
			href: '/admin/help',
			active: activePage === 'help',
		},
	];
}

export function getAdminUserInfo(user: any) {
	return {
		name:
			user?.first_name && user?.last_name
				? `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
				: 'ADMIN USER',
		id: user?.user_id ? `Admin ID: ${user.user_id.slice(-6)}` : 'Admin ID: A001',
		avatar: '/placeholder.svg?height=64&width=64',
		fallback:
			user?.first_name && user?.last_name
				? `${user.first_name[0]}${user.last_name[0]}`
				: 'AU',
		role: user?.hospital_name
			? `${user.hospital_name} Administrator`
			: 'Hospital Administrator',
	};
}
