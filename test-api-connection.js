// Simple test script to verify API connection
const API_BASE_URL = 'http://localhost:8000';

async function testDashboardStats() {
    try {
        console.log('Testing dashboard stats endpoint...');
        const response = await fetch(`${API_BASE_URL}/admin/test123/dashboard-stats`);
        const data = await response.json();
        console.log('Dashboard stats:', data);
        console.log('Total Patients:', data.totalPatients);
        console.log('Total Doctors:', data.totalDoctors);
        console.log('Total Departments:', data.totalDepartments);
        return data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

async function testPatients() {
    try {
        console.log('\nTesting patients endpoint...');
        const response = await fetch(`${API_BASE_URL}/admin/test123/patients`);
        const data = await response.json();
        console.log('Patients count:', data.length);
        console.log('Patients:', data);
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

async function testDoctors() {
    try {
        console.log('\nTesting doctors endpoint...');
        const response = await fetch(`${API_BASE_URL}/admin/doctors`);
        const data = await response.json();
        console.log('Doctors count:', data.length);
        console.log('Doctors:', data);
        return data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

async function runTests() {
    console.log('=== API Connection Test ===');
    
    const stats = await testDashboardStats();
    const patients = await testPatients();
    const doctors = await testDoctors();
    
    console.log('\n=== Test Summary ===');
    console.log(`Backend says: ${stats?.totalPatients || 0} patients, ${stats?.totalDoctors || 0} doctors`);
    console.log(`Direct API calls: ${patients?.length || 0} patients, ${doctors?.length || 0} doctors`);
    
    if (stats?.totalPatients === patients?.length) {
        console.log('✅ Patient counts match!');
    } else {
        console.log('❌ Patient counts do not match');
    }
    
    if (stats?.totalDoctors === doctors?.length) {
        console.log('✅ Doctor counts match!');
    } else {
        console.log('❌ Doctor counts do not match');
    }
}

runTests();
