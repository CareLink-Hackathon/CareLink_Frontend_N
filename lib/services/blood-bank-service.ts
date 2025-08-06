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
	// ===== ADMIN-SPECIFIC METHODS =====
	
	// Donor Management
	async getDonors(adminId: string, params?: { page?: number; limit?: number; blood_type?: string; status?: string }) {
		return await bloodBankAPI.getDonors(adminId, params);
	}

	async createDonor(adminId: string, donorData: DonorData) {
		const validationErrors = this.validateDonorData(donorData);
		if (validationErrors.length > 0) {
			throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
		}
		
		try {
			return await bloodBankAPI.createDonor(adminId, donorData);
		} catch (error: any) {
			// Handle specific duplicate donor error
			if (error.status === 409 && error.message?.includes('already exists')) {
				throw new Error(`Donor ID "${donorData.donor_id}" already exists. Please use a different ID.`);
			}
			
			// Handle other API errors
			const errorMessage = this.parseApiError(error);
			throw new Error(errorMessage);
		}
	}

	async getDonor(adminId: string, donorId: string) {
		return await bloodBankAPI.getDonor(adminId, donorId);
	}

	async updateDonor(adminId: string, donorId: string, donorData: Partial<DonorData>) {
		return await bloodBankAPI.updateDonor(adminId, donorId, donorData);
	}

	async deleteDonor(adminId: string, donorId: string) {
		return await bloodBankAPI.deleteDonor(adminId, donorId);
	}

	// Inventory Management
	async getAdminInventory(adminId: string) {
		return await bloodBankAPI.getAdminInventory(adminId);
	}

	async updateInventory(adminId: string, inventoryData: {
		blood_type: string;
		quantity: number;
		operation: 'add' | 'remove' | 'set';
		expiry_date?: string;
		reason?: string;
	}) {
		return await bloodBankAPI.updateInventory(adminId, inventoryData);
	}

	// Statistics and Analytics
	async getBloodBankStats(adminId: string) {
		return await bloodBankAPI.getBloodBankStats(adminId);
	}

	// Blood Requests Management
	async getBloodRequests(adminId: string, params?: { status?: string; page?: number; limit?: number }) {
		return await bloodBankAPI.getBloodRequests(adminId, params);
	}

	async createBloodRequest(adminId: string, requestData: {
		blood_type: string;
		quantity: number;
		patient_name: string;
		request_date: string;
		urgency: 'low' | 'medium' | 'high' | 'critical';
		hospital_unit: string;
		requested_by: string;
		patient_id?: string;
		notes?: string;
	}) {
		return await bloodBankAPI.createBloodRequest(adminId, requestData);
	}

	async updateBloodRequestStatus(adminId: string, requestId: string, status: 'pending' | 'approved' | 'fulfilled' | 'rejected' | 'cancelled') {
		return await bloodBankAPI.updateBloodRequestStatus(adminId, requestId, status);
	}

	// ===== LEGACY METHODS (for backward compatibility) =====
	
	// Donor data ingestion
	async ingestDonorData(donorData: DonorData) {
		return await bloodBankAPI.ingestDonorData(donorData);
	}

	// Demand forecasting
	async predictDemand(request: ForecastRequest): Promise<ForecastResponse[]> {
		return await bloodBankAPI.predictDemand(request);
	}

	// Inventory management (legacy)
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

	// Helper method to generate unique donor ID
	generateDonorId(): string {
		const prefix = 'DON';
		const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
		const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
		return `${prefix}${timestamp}${random}`;
	}

	// Helper method to check if donor ID exists
	async checkDonorIdExists(adminId: string, donorId: string): Promise<boolean> {
		try {
			await this.getDonor(adminId, donorId);
			return true; // If no error, donor exists
		} catch (error: any) {
			if (error.status === 404) {
				return false; // 404 means donor doesn't exist
			}
			throw error; // Re-throw other errors
		}
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
		// Handle specific HTTP status codes
		if (error.status === 409) {
			return error.message || error.data?.detail || 'This record already exists';
		}
		
		if (error.status === 400) {
			const detail = error.data?.detail;
			if (Array.isArray(detail)) {
				return detail
					.map((d: any) => d.msg || d.message || JSON.stringify(d))
					.join(', ');
			}
			return detail || error.message || 'Invalid request data';
		}
		
		if (error.status === 401) {
			return 'Authentication required. Please log in again.';
		}
		
		if (error.status === 403) {
			return 'Access denied. You do not have permission for this action.';
		}
		
		if (error.status === 404) {
			return 'Resource not found.';
		}
		
		if (error.status >= 500) {
			return 'Server error. Please try again later.';
		}

		// Handle detailed error responses
		if (error.data?.detail) {
			const detail = error.data.detail;
			if (Array.isArray(detail)) {
				return detail
					.map((d: any) => d.msg || d.message || JSON.stringify(d))
					.join(', ');
			}
			return typeof detail === 'string' ? detail : JSON.stringify(detail);
		}

		// Handle simple error messages
		if (error.message) {
			return error.message;
		}

		return 'An unexpected error occurred';
	}
}

// Create and export a singleton instance
export const bloodBankService = new BloodBankService();
