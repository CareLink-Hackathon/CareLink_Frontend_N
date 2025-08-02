import { bloodBankAPI } from '../api';
import {
	DonorData,
	ForecastRequest,
	ForecastResponse,
	InventoryStatus,
	OptimizationRequest,
	OptimizationResult,
} from '../types';

export class BloodBankService {
	// Donor data ingestion
	async ingestDonorData(donorData: DonorData) {
		return await bloodBankAPI.ingestDonorData(donorData);
	}

	// Demand forecasting
	async predictDemand(request: ForecastRequest): Promise<ForecastResponse[]> {
		return await bloodBankAPI.predictDemand(request);
	}

	// Inventory management
	async getInventoryStatus(): Promise<InventoryStatus[]> {
		return await bloodBankAPI.getInventoryStatus();
	}

	// Inventory optimization
	async optimizeInventory(
		params: OptimizationRequest = {}
	): Promise<OptimizationResult[]> {
		return await bloodBankAPI.optimizeInventory(params);
	}

	// Utility methods
	getBloodTypes(): string[] {
		return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
	}

	formatBloodType(bloodType: string): string {
		return bloodType;
	}

	getBloodTypeColor(bloodType: string): string {
		const colors: Record<string, string> = {
			'A+': 'bg-red-500',
			'A-': 'bg-red-400',
			'B+': 'bg-blue-500',
			'B-': 'bg-blue-400',
			'AB+': 'bg-purple-500',
			'AB-': 'bg-purple-400',
			'O+': 'bg-green-500',
			'O-': 'bg-green-400',
		};
		return colors[bloodType] || 'bg-gray-400';
	}

	getStockLevel(currentStock: number, bloodType: string): {
		level: 'critical' | 'low' | 'normal' | 'high';
		color: string;
		message: string;
	} {
		// Basic thresholds - can be customized per blood type
		const thresholds = {
			critical: 10,
			low: 25,
			normal: 50,
		};

		if (currentStock <= thresholds.critical) {
			return {
				level: 'critical',
				color: 'text-red-600',
				message: 'Critical - Immediate action required',
			};
		} else if (currentStock <= thresholds.low) {
			return {
				level: 'low',
				color: 'text-orange-600',
				message: 'Low stock - Consider ordering',
			};
		} else if (currentStock <= thresholds.normal) {
			return {
				level: 'normal',
				color: 'text-yellow-600',
				message: 'Normal stock level',
			};
		} else {
			return {
				level: 'high',
				color: 'text-green-600',
				message: 'Good stock level',
			};
		}
	}

	formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	getDaysUntilExpiry(expiryDate: string): number {
		const today = new Date();
		const expiry = new Date(expiryDate);
		const diffTime = expiry.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	validateDonorData(data: Partial<DonorData>): string[] {
		const errors: string[] = [];

		if (!data.donor_id) errors.push('Donor ID is required');
		if (!data.age || data.age < 16 || data.age > 70) {
			errors.push('Age must be between 16 and 70');
		}
		if (!data.sex) errors.push('Sex is required');
		if (!data.occupation) errors.push('Occupation is required');
		if (!data.blood_type) errors.push('Blood type is required');
		if (!data.screening_result) errors.push('Screening result is required');
		if (!data.donation_date) errors.push('Donation date is required');
		if (!data.expiry_date) errors.push('Expiry date is required');

		// Validate donation date is not in the future
		if (data.donation_date) {
			const donationDate = new Date(data.donation_date);
			const today = new Date();
			if (donationDate > today) {
				errors.push('Donation date cannot be in the future');
			}
		}

		// Validate expiry date is after donation date
		if (data.donation_date && data.expiry_date) {
			const donationDate = new Date(data.donation_date);
			const expiryDate = new Date(data.expiry_date);
			if (expiryDate <= donationDate) {
				errors.push('Expiry date must be after donation date');
			}
		}

		return errors;
	}

	// Error handling helpers
	parseApiError(error: any): string {
		if (error.data?.detail) {
			const detail = error.data.detail;
			if (Array.isArray(detail)) {
				return detail
					.map((d: any) => d.msg || d.message || JSON.stringify(d))
					.join(', ');
			}
			return typeof detail === 'string' ? detail : JSON.stringify(detail);
		}

		if (error.message) {
			return error.message;
		}

		return 'An unexpected error occurred';
	}
}

// Create and export a singleton instance
export const bloodBankService = new BloodBankService();
