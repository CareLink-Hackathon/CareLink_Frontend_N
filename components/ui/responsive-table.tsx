'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Column {
	key: string;
	header: string;
	render?: (value: any, row: any) => React.ReactNode;
	mobile?: boolean; // Show on mobile
	desktop?: boolean; // Show on desktop
}

interface ResponsiveTableProps {
	data: any[];
	columns: Column[];
	showAvatar?: boolean;
	avatarKey?: string;
	onRowClick?: (row: any) => void;
	cardTitle?: string;
}

export function ResponsiveTable({
	data,
	columns,
	showAvatar = false,
	avatarKey = 'name',
	onRowClick,
	cardTitle,
}: ResponsiveTableProps) {
	const mobileColumns = columns.filter((col) => col.mobile !== false);
	const desktopColumns = columns.filter((col) => col.desktop !== false);

	// Mobile Card View
	const MobileView = () => (
		<div className="md:hidden space-y-3">
			{data.map((row, index) => (
				<Card
					key={index}
					className={`${
						onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
					}`}
					onClick={() => onRowClick?.(row)}
				>
					<CardContent className="p-4">
						<div className="space-y-2">
							{mobileColumns.map((column) => {
								const value = row[column.key];
								return (
									<div
										key={column.key}
										className="flex justify-between items-center"
									>
										<span className="text-sm font-medium text-gray-600 min-w-0 flex-1">
											{column.header}:
										</span>
										<div className="text-sm text-gray-900 min-w-0 flex-shrink-0 ml-2 text-right">
											{column.render ? column.render(value, row) : value}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);

	// Desktop Table View
	const DesktopView = () => (
		<div className="hidden md:block">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200">
							{showAvatar && (
								<th className="text-left py-3 px-4 font-medium text-gray-900">
									User
								</th>
							)}
							{desktopColumns.map((column) => (
								<th
									key={column.key}
									className="text-left py-3 px-4 font-medium text-gray-900"
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr
								key={index}
								className={`border-b border-gray-100 ${
									onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
								}`}
								onClick={() => onRowClick?.(row)}
							>
								{showAvatar && (
									<td className="py-4 px-4">
										<div className="flex items-center space-x-3">
											<Avatar className="w-8 h-8">
												<AvatarImage
													src={
														row.avatar || '/placeholder.svg?height=32&width=32'
													}
												/>
												<AvatarFallback>
													{row[avatarKey]
														?.split(' ')
														.map((n: string) => n[0])
														.join('') || '??'}
												</AvatarFallback>
											</Avatar>
											<span className="font-medium">{row[avatarKey]}</span>
										</div>
									</td>
								)}
								{desktopColumns.map((column) => {
									const value = row[column.key];
									return (
										<td key={column.key} className="py-4 px-4">
											{column.render ? column.render(value, row) : value}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);

	if (cardTitle) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg sm:text-xl">{cardTitle}</CardTitle>
				</CardHeader>
				<CardContent>
					<MobileView />
					<DesktopView />
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<MobileView />
			<DesktopView />
		</>
	);
}

// Status Badge component for common status displays
export function StatusBadge({
	status,
	type = 'default',
}: {
	status: string;
	type?: 'default' | 'appointment' | 'health';
}) {
	const getStatusColor = () => {
		if (type === 'appointment') {
			switch (status.toLowerCase()) {
				case 'confirmed':
					return 'bg-green-100 text-green-800';
				case 'pending':
					return 'bg-yellow-100 text-yellow-800';
				case 'cancelled':
					return 'bg-red-100 text-red-800';
				case 'completed':
					return 'bg-blue-100 text-blue-800';
				default:
					return 'bg-gray-100 text-gray-800';
			}
		}

		if (type === 'health') {
			switch (status.toLowerCase()) {
				case 'stable':
					return 'bg-green-100 text-green-800';
				case 'monitoring':
					return 'bg-yellow-100 text-yellow-800';
				case 'critical':
					return 'bg-red-100 text-red-800';
				default:
					return 'bg-gray-100 text-gray-800';
			}
		}

		return 'bg-gray-100 text-gray-800';
	};

	return <Badge className={getStatusColor()}>{status}</Badge>;
}
