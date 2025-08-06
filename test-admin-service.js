// Simple test to verify admin service is working
const fetch = require('node-fetch');

async function testAdminService() {
    try {
        console.log('Testing admin service getDashboardStats...');
        
        const response = await fetch('http://localhost:8000/admin/test123/dashboard-stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Backend response:', JSON.stringify(data, null, 2));
        
        // Check if we have the expected data structure
        console.log('\nData verification:');
        console.log('totalPatients:', data.totalPatients);
        console.log('totalDoctors:', data.totalDoctors);
        console.log('totalDepartments:', data.totalDepartments);
        console.log('totalAppointments:', data.totalAppointments);
        
        return data;
    } catch (error) {
        console.error('Error testing admin service:', error);
        throw error;
    }
}

testAdminService()
    .then(data => {
        console.log('\nTest completed successfully!');
        console.log('Dashboard stats are available from backend');
    })
    .catch(error => {
        console.error('Test failed:', error);
    });
