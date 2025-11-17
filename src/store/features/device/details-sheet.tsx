'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, LoaderCircle } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenuItem,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Device, DeviceTestResult } from './type';
import { cn } from '@/lib/utils';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from 'recharts';

export function DeviceDetailsSheet({ device }: { device: Device }) {
	const [open, setOpen] = useState(false);
	const [testResults, setTestResults] = useState<DeviceTestResult[]>([]);
	const [isFetchingTests, setIsFetchingTests] = useState(false);
	const [testsError, setTestsError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) {
			setTestResults([]);
			setTestsError(null);
			return;
		}

		let abort = false;
		setIsFetchingTests(true);
		setTestsError(null);

		const load = async () => {
			try {
				const apiKey =
					process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
				const res = await fetch(`/api/devices/${device.uuid}/data`, {
					cache: 'no-store',
					headers: {
						'X-API-Key': apiKey,
					},
				});
				if (!res.ok) {
					throw new Error('Unable to load test data');
				}
				const data: DeviceTestResult[] = await res.json();
				if (!abort) {
					setTestResults(data);
				}
			} catch (err) {
				if (!abort) {
					setTestsError(
						err instanceof Error ? err.message : 'Failed to load test data'
					);
				}
			} finally {
				if (!abort) {
					setIsFetchingTests(false);
				}
			}
		};

		load();
		return () => {
			abort = true;
		};
	}, [open, device.uuid]);

	// Prepare chart data (value over time)
	const chartData = testResults.map((tr) => ({
		timestamp: new Date(tr.timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		}),
		value: tr.value,
	}));

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
				<SheetTrigger className="flex items-center gap-2 w-full">
					<DropdownMenuShortcut className="ml-0">
						<Eye className="size-4" />
					</DropdownMenuShortcut>
					View Details
				</SheetTrigger>
			</DropdownMenuItem>

			<SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{device.deviceName}</SheetTitle>
					<SheetDescription>
						Review device information and the latest test results
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-6 mt-6 p-4">
					{/* Device Information */}
					<section className="space-y-3 rounded-lg border p-4">
						<h3 className="text-sm font-semibold">Device Information</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Device ID</span>
								<span className="font-medium font-mono">{device.deviceId}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Device Name</span>
								<span className="font-medium">{device.deviceName}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Type</span>
								<span className="font-medium">{device.deviceType}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Status</span>
								<Badge
									className="capitalize"
									variant={device.status === 'online' ? 'default' : 'secondary'}
								>
									{device.status}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Last Updated</span>
								<span className="text-xs">
									{formatDistanceToNow(new Date(device.lastUpdated), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					</section>

					{/* Test Results Chart */}
					{testResults.length > 0 && (
						<section className="space-y-3 rounded-lg border p-4">
							<h3 className="text-sm font-semibold">Test Results Over Time</h3>
							<ResponsiveContainer width="100%" height={200}>
								<LineChart data={chartData}>
									<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
									<XAxis dataKey="timestamp" />
									<YAxis />
									<Tooltip />
									<Line type="monotone" dataKey="value" stroke="#8884d8" />
								</LineChart>
							</ResponsiveContainer>
						</section>
					)}

					{/* Test Results Table */}
					<section className="space-y-3">
						<h3 className="text-sm font-semibold">Recent Test Results</h3>
						<div className="rounded-lg border overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="bg-muted/50 text-xs uppercase tracking-wide">
											Timestamp
										</TableHead>
										<TableHead className="bg-muted/50 text-xs uppercase tracking-wide">
											Test
										</TableHead>
										<TableHead className="bg-muted/50 text-xs uppercase tracking-wide">
											Value
										</TableHead>
										<TableHead className="bg-muted/50 text-xs uppercase tracking-wide">
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isFetchingTests && (
										<TableRow>
											<TableCell className="text-center" colSpan={4}>
												<div className="flex items-center justify-center gap-2 py-4">
													<LoaderCircle className="h-4 w-4 animate-spin" />
													<span>Loading test data...</span>
												</div>
											</TableCell>
										</TableRow>
									)}
									{!isFetchingTests && testsError && (
										<TableRow>
											<TableCell
												className="text-center text-destructive py-4"
												colSpan={4}
											>
												{testsError}
											</TableCell>
										</TableRow>
									)}
									{!isFetchingTests &&
										!testsError &&
										testResults.length === 0 && (
											<TableRow>
												<TableCell
													className="text-center text-muted-foreground py-4"
													colSpan={4}
												>
													No test data available
												</TableCell>
											</TableRow>
										)}
									{testResults.map((result) => (
										<TableRow key={result.id}>
											<TableCell className="text-xs">
												{formatDistanceToNow(new Date(result.timestamp), {
													addSuffix: true,
												})}
											</TableCell>
											<TableCell className="font-medium">
												{result.testType}
											</TableCell>
											<TableCell>
												{result.value} {result.unit}
											</TableCell>
											<TableCell>
												<span
													className={cn(
														'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
														result.status === 'normal'
															? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
															: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
													)}
												>
													{result.status}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</section>
				</div>
			</SheetContent>
		</Sheet>
	);
}
