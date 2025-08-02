'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { bloodBankService } from '@/lib/services/blood-bank-service';
import { DonorData } from '@/lib/types';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Activity,
	Droplets,
	Calendar,
	BarChart3,
	Settings,
	ArrowLeft,
	Save,
	Loader2,
} from 'lucide-react';

export default function AddDonorPage() {
	const router = useRouter();
	const { user } = useAuth();

	// Form state
	const [formData, setFormData] = useState<Partial<DonorData>>({
		donor_id: '',
		blood_type: undefined,
		age: undefined,
		sex: undefined,
		occupation: '',
		screening_result: undefined,
		donation_date: '',
		expiry_date: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// User info for layout
	const userInfo = user
		? {
				name: `${user.first_name} ${user.last_name}`.toUpperCase(),
				fallback: `${user.first_name[0]}${user.last_name[0]}`,
				role: user.account_type === 'hospital' ? 'Admin' : 'Staff',
				id: user._id,
		  }
		: {
				name: 'Anonymous User',
				fallback: 'AU',
				role: 'Unknown',
				id: '',
		  };

	// Sidebar items
	const sidebarItems = [
		{ icon: Activity, label: 'Dashboard', href: '/admin/dashboard' },
		{ icon: Droplets, label: 'Blood Bank', href: '/admin/blood-bank' },
		{ icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
		{ icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
		{ icon: Settings, label: 'Settings', href: '/admin/settings' },
	];

	const handleInputChange = (field: keyof DonorData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateForm = (): string | null => {
		if (!formData.donor_id?.trim()) return 'Donor ID is required';
		if (!formData.blood_type) return 'Blood type is required';
		if (!formData.age || formData.age < 16 || formData.age > 70) {
			return 'Age must be between 16 and 70';
		}
		if (!formData.sex) return 'Sex is required';
		if (!formData.occupation?.trim()) return 'Occupation is required';
		if (!formData.screening_result) return 'Screening result is required';
		if (!formData.donation_date) return 'Donation date is required';
		if (!formData.expiry_date) return 'Expiry date is required';

		// Validate that expiry date is after donation date
		if (new Date(formData.expiry_date) <= new Date(formData.donation_date)) {
			return 'Expiry date must be after donation date';
		}

		return null;
	};

	const calculateExpiryDate = (donationDate: string): string => {
		if (!donationDate) return '';
		const donation = new Date(donationDate);
		const expiry = new Date(donation);
		expiry.setDate(expiry.getDate() + 42); // Blood expires after 42 days
		return expiry.toISOString().split('T')[0];
	};

	const handleDonationDateChange = (date: string) => {
		handleInputChange('donation_date', date);
		if (date) {
			handleInputChange('expiry_date', calculateExpiryDate(date));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validate form
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsSubmitting(true);

		try {
			await bloodBankService.ingestDonorData(formData as DonorData);
			setSuccess(true);
			setTimeout(() => {
				router.push('/admin/blood-bank');
			}, 2000);
		} catch (err: any) {
			setError(bloodBankService.parseApiError(err));
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			donor_id: '',
			blood_type: undefined,
			age: undefined,
			sex: undefined,
			occupation: '',
			screening_result: undefined,
			donation_date: '',
			expiry_date: '',
		});
		setError(null);
		setSuccess(false);
	};

	if (success) {
		return (
			<ResponsiveDashboardLayout
				userInfo={userInfo}
				sidebarItems={sidebarItems}
				showSearch={false}
			>
				<div className="flex items-center justify-center min-h-[400px]">
					<Card className="w-full max-w-md">
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
									<Droplets className="w-8 h-8 text-green-600" />
								</div>
								<h2 className="text-xl font-semibold text-gray-900">Donor Added Successfully!</h2>
								<p className="text-gray-600">
									Donor data has been ingested into the blood bank system.
								</p>
								<p className="text-sm text-gray-500">Redirecting to blood bank dashboard...</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</ResponsiveDashboardLayout>
		);
	}

	return (
		<ResponsiveDashboardLayout
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={false}
		>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center space-x-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => router.back()}
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Add New Donor</h1>
						<p className="text-gray-600">Register a new blood donor in the system</p>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<Card className="border-red-200 bg-red-50">
						<CardContent className="pt-6">
							<p className="text-red-700">{error}</p>
						</CardContent>
					</Card>
				)}

				{/* Add Donor Form */}
				<Card>
					<CardHeader>
						<CardTitle>Donor Information</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="donor_id">Donor ID *</Label>
									<Input
										id="donor_id"
										value={formData.donor_id || ''}
										onChange={(e) => handleInputChange('donor_id', e.target.value)}
										placeholder="e.g., D-2024-001"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="blood_type">Blood Type *</Label>
									<Select
										value={formData.blood_type || ''}
										onValueChange={(value) => handleInputChange('blood_type', value as DonorData['blood_type'])}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select blood type" />
										</SelectTrigger>
										<SelectContent>
											{bloodBankService.getBloodTypes().map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="age">Age *</Label>
									<Input
										id="age"
										type="number"
										min="16"
										max="70"
										value={formData.age || ''}
										onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
										placeholder="Age in years"
										required
									/>
									<p className="text-xs text-gray-500">Must be between 16-70 years</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="sex">Sex *</Label>
									<Select
										value={formData.sex || ''}
										onValueChange={(value) => handleInputChange('sex', value as DonorData['sex'])}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select sex" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Additional Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="occupation">Occupation *</Label>
									<Input
										id="occupation"
										value={formData.occupation || ''}
										onChange={(e) => handleInputChange('occupation', e.target.value)}
										placeholder="e.g., Teacher, Engineer, Student"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="screening_result">Screening Result *</Label>
									<Select
										value={formData.screening_result || ''}
										onValueChange={(value) => handleInputChange('screening_result', value as DonorData['screening_result'])}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select screening result" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="passed">Passed</SelectItem>
											<SelectItem value="failed">Failed</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Date Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="donation_date">Donation Date *</Label>
									<Input
										id="donation_date"
										type="date"
										value={formData.donation_date || ''}
										onChange={(e) => handleDonationDateChange(e.target.value)}
										max={new Date().toISOString().split('T')[0]}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="expiry_date">Expiry Date *</Label>
									<Input
										id="expiry_date"
										type="date"
										value={formData.expiry_date || ''}
										onChange={(e) => handleInputChange('expiry_date', e.target.value)}
										min={formData.donation_date || ''}
										required
									/>
									<p className="text-xs text-gray-500">
										Auto-calculated as 42 days from donation date
									</p>
								</div>
							</div>

							{/* Form Actions */}
							<div className="flex gap-4">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="flex-1"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Adding Donor...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Add Donor
										</>
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={resetForm}
									disabled={isSubmitting}
								>
									Reset Form
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</ResponsiveDashboardLayout>
	);
}
