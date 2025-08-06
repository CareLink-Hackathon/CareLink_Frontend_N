'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { bloodBankService } from '@/lib/services/blood-bank-service';
import {
	InventoryStatus,
	ForecastResponse,
	OptimizationResult,
} from '@/lib/types';
import { ResponsiveDashboardLayout } from '@/components/layout/responsive-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Droplets,
	TrendingUp,
	AlertTriangle,
	Plus,
	BarChart3,
	RefreshCw,
} from 'lucide-react';
import { getAdminSidebarItems, getAdminUserInfo } from '@/lib/utils/admin-layout';

export default function BloodBankDashboard() {
	const router = useRouter();
	const { user } = useAuth();

	// State management
	const [inventoryData, setInventoryData] = useState<InventoryStatus[]>([]);
	const [forecastData, setForecastData] = useState<ForecastResponse[]>([]);
	const [optimizationData, setOptimizationData] = useState<OptimizationResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sidebar items
	const sidebarItems = getAdminSidebarItems('blood-bank');

	// User info for layout
	const userInfo = getAdminUserInfo(user);

	// Load data on component mount
	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const adminId = user?._id || user?.user_id;
			console.log('🔍 User object:', user);
			console.log('🆔 Admin ID found:', adminId);
			
			if (!adminId) {
				throw new Error('Admin ID not found. Please log in again.');
			}

			// Load admin-specific inventory data
			const inventory = await bloodBankService.getAdminInventory(adminId);
			setInventoryData(inventory as InventoryStatus[]);

			// Load 7-day forecast (legacy endpoint)
			const today = new Date();
			const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
			
			const forecast = await bloodBankService.predictDemand({
				start_date: today.toISOString().split('T')[0],
				end_date: weekFromNow.toISOString().split('T')[0],
			});
			setForecastData(forecast);

			// Load optimization recommendations (legacy endpoint)
			const optimization = await bloodBankService.optimizeInventory({
				forecast_days: 7,
				safety_stock_days: 3,
			});
			setOptimizationData(optimization);
		} catch (err: any) {
			console.error('❌ Dashboard load error:', err);
			setError(err.message || 'Failed to load dashboard data');
		} finally {
			setIsLoading(false);
		}
	};

	const getTotalStock = () => {
		return inventoryData.reduce((total, item) => total + item.current_stock, 0);
	};

	const getCriticalStockCount = () => {
		return inventoryData.filter((item) => {
			const { level } = bloodBankService.getStockLevel(item.current_stock, item.blood_type);
			return level === 'critical';
		}).length;
	};

	const getTotalForecastDemand = () => {
		return forecastData.reduce((total, item) => total + item.predicted_count, 0);
	};

	const getRecommendedOrders = () => {
		return optimizationData.reduce((total, item) => total + item.recommended_order, 0);
	};

	return (
		<ResponsiveDashboardLayout
			userInfo={userInfo}
			sidebarItems={sidebarItems}
			showSearch={true}
			onSearch={(query) => console.log('Search:', query)}
		>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Blood Bank Management</h1>
						<p className="text-gray-600">Monitor inventory, forecast demand, and optimize blood supply</p>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={loadDashboardData}
							disabled={isLoading}
							variant="outline"
						>
							<RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
							Refresh
						</Button>
						<Button
							onClick={() => router.push('/admin/blood-bank/add-donor')}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Donor
						</Button>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<Card className="border-red-200 bg-red-50">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<AlertTriangle className="w-5 h-5 text-red-600" />
									<p className="text-red-700">{error}</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setError(null)}
									className="text-red-600 hover:bg-red-100"
								>
									Dismiss
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Stock</CardTitle>
							<Droplets className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{getTotalStock()}</div>
							<p className="text-xs text-muted-foreground">units available</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
							<AlertTriangle className="h-4 w-4 text-red-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">{getCriticalStockCount()}</div>
							<p className="text-xs text-muted-foreground">blood types critical</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">7-Day Demand</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{getTotalForecastDemand()}</div>
							<p className="text-xs text-muted-foreground">predicted units needed</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Recommended Orders</CardTitle>
							<Plus className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{getRecommendedOrders()}</div>
							<p className="text-xs text-muted-foreground">units to order</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="inventory" className="space-y-4">
					<TabsList>
						<TabsTrigger value="inventory">Current Inventory</TabsTrigger>
						<TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
						<TabsTrigger value="optimization">Optimization</TabsTrigger>
					</TabsList>

					{/* Inventory Tab */}
					<TabsContent value="inventory" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Blood Inventory Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{inventoryData.map((item) => {
										const { level, color, message } = bloodBankService.getStockLevel(
											item.current_stock,
											item.blood_type
										);
										const bloodTypeColor = bloodBankService.getBloodTypeColor(item.blood_type);

										return (
											<div
												key={item.blood_type}
												className="p-4 border rounded-lg space-y-3"
											>
												<div className="flex items-center justify-between">
													<div className={`w-8 h-8 rounded-full ${bloodTypeColor} flex items-center justify-center text-white font-bold text-sm`}>
														{item.blood_type}
													</div>
													<Badge
														variant={level === 'critical' ? 'destructive' : level === 'low' ? 'default' : 'secondary'}
													>
														{level}
													</Badge>
												</div>
												<div>
													<div className="text-2xl font-bold">{item.current_stock}</div>
													<div className={`text-sm ${color}`}>{message}</div>
												</div>
												{Object.keys(item.expiry_dates).length > 0 && (
													<div className="text-xs text-gray-500">
														<strong>Expiring soon:</strong>
														{Object.entries(item.expiry_dates)
															.slice(0, 2)
															.map(([date, qty]) => (
																<div key={date}>
																	{qty} units on {bloodBankService.formatDate(date)}
																</div>
															))}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Forecast Tab */}
					<TabsContent value="forecast" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>7-Day Demand Forecast</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{bloodBankService.getBloodTypes().map((bloodType) => {
										const typeForecasts = forecastData.filter(f => f.blood_type === bloodType);
										const totalDemand = typeForecasts.reduce((sum, f) => sum + f.predicted_count, 0);
										
										return (
											<div key={bloodType} className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center space-x-3">
													<div className={`w-6 h-6 rounded-full ${bloodBankService.getBloodTypeColor(bloodType)} flex items-center justify-center text-white font-bold text-xs`}>
														{bloodType}
													</div>
													<span className="font-medium">{bloodType}</span>
												</div>
												<div className="text-right">
													<div className="font-bold">{totalDemand} units</div>
													<div className="text-sm text-gray-500">
														{(totalDemand / 7).toFixed(1)} units/day avg
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Optimization Tab */}
					<TabsContent value="optimization" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Inventory Optimization Recommendations</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{optimizationData.map((item) => (
										<div key={item.blood_type} className="p-4 border rounded-lg">
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center space-x-3">
													<div className={`w-6 h-6 rounded-full ${bloodBankService.getBloodTypeColor(item.blood_type)} flex items-center justify-center text-white font-bold text-xs`}>
														{item.blood_type}
													</div>
													<span className="font-medium">{item.blood_type}</span>
												</div>
												<Badge variant={item.recommended_order > 0 ? 'default' : 'secondary'}>
													{item.recommended_order > 0 ? 'Order Needed' : 'Sufficient Stock'}
												</Badge>
											</div>
											
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
												<div>
													<div className="text-gray-500">Recommended Order</div>
													<div className="font-bold">{item.recommended_order} units</div>
												</div>
												<div>
													<div className="text-gray-500">Expected Shortage</div>
													<div className={`font-bold ${item.expected_shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
														{item.expected_shortage} units
													</div>
												</div>
												<div>
													<div className="text-gray-500">Expected Wastage</div>
													<div className={`font-bold ${item.expected_wastage > 0 ? 'text-orange-600' : 'text-green-600'}`}>
														{item.expected_wastage} units
													</div>
												</div>
												<div>
													<div className="text-gray-500">Optimal Cost</div>
													<div className="font-bold">${item.optimal_cost.toFixed(2)}</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</ResponsiveDashboardLayout>
	);
}
