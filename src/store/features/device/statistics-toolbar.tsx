'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle, Server } from 'lucide-react';
import { useMemo } from 'react';
import { Device } from './type';

interface StatisticsToolbarProps {
	devices?: Device[];
}

export function StatisticsToolbar({ devices = [] }: StatisticsToolbarProps) {
	const stats = useMemo(() => {
		const total = devices.length;
		const online = devices.filter((d) => d.status === 'online').length;
		const offline = devices.filter((d) => d.status === 'offline').length;
		const onlinePercentage = total > 0 ? Math.round((online / total) * 100) : 0;

		return {
			total,
			online,
			offline,
			onlinePercentage,
		};
	}, [devices]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
			{/* Total Devices */}
			<Card className="border-l-4 border-l-blue-500 py-1">
				<CardContent className="p-2">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Devices
							</p>
							<p className="text-2xl font-bold mt-1">{stats.total}</p>
						</div>
						<div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
							<Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Online Devices */}
			<Card className="border-l-4 border-l-emerald-500 py-1">
				<CardContent className="p-2">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Online Devices
							</p>
							<div className="flex items-baseline gap-2 mt-1">
								<p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
									{stats.online}
								</p>
								<p className="text-xs text-muted-foreground">
									({stats.onlinePercentage}%)
								</p>
							</div>
						</div>
						<div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
							<Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Offline Devices */}
			<Card className="border-l-4 border-l-amber-500 py-1">
				<CardContent className="p-2">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Offline Devices
							</p>
							<div className="flex items-baseline gap-2 mt-1">
								<p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
									{stats.offline}
								</p>
								<p className="text-xs text-muted-foreground">
									({100 - stats.onlinePercentage}%)
								</p>
							</div>
						</div>
						<div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
							<AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
