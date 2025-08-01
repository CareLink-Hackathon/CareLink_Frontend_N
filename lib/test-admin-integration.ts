import { adminService } from '@/lib/services/admin-service';

export async function testAdminIntegration() {
	try {
		console.log('Testing admin integration...');

		// Test getting dashboard stats (mocked)
		const dashboardStats = await adminService.getDashboardStats();
		console.log('Dashboard stats:', dashboardStats);

		// Test getting feedback analytics (real backend)
		const feedbackAnalytics = await adminService.getFeedbackAnalytics();
		console.log('Feedback analytics:', feedbackAnalytics);

		// Test getting appointments (mocked for now)
		const appointments = await adminService.getAppointments();
		console.log('Appointments:', appointments);

		return {
			success: true,
			message: 'Admin integration working correctly',
		};
	} catch (error) {
		console.error('Admin integration test failed:', error);
		return {
			success: false,
			message: `Test failed: ${error}`,
		};
	}
}
