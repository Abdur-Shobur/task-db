'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { toaster } from '@/lib/toast';
import { cn } from '@/lib/utils';
import {
	Device,
	DeviceStatus,
	DeviceTestResult,
	RegisterDevicePayload,
} from '@/types/devices';

const formSchema = z.object({
	deviceId: z.string().min(2, 'Device ID is required'),
	deviceName: z.string().min(2, 'Device name is required'),
	deviceType: z.string().min(2, 'Device type is required'),
	status: z.enum(['online', 'offline']),
});

type FormValues = z.infer<typeof formSchema>;

const statusFilters: Array<{ label: string; value: 'all' | DeviceStatus }> = [
	{ label: 'All', value: 'all' },
	{ label: 'Online', value: 'online' },
	{ label: 'Offline', value: 'offline' },
];

export default function DevicesPageClient() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<'all' | DeviceStatus>('all');
	const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [testResults, setTestResults] = useState<DeviceTestResult[]>([]);
	const [testsError, setTestsError] = useState<string | null>(null);
	const [isFetchingTests, setIsFetchingTests] = useState(false);
	const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

	const fetchDevices = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
			const res = await fetch('/api/devices', {
				cache: 'no-store',
				headers: {
					'X-API-Key': apiKey,
				},
			});
			if (!res.ok) {
				throw new Error('Unable to load devices');
			}
			const data: Device[] = await res.json();
			setDevices(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDevices();
	}, [fetchDevices]);

	const filteredDevices = useMemo(() => {
		if (filter === 'all') return devices;
		return devices.filter((device) => device.status === filter);
	}, [devices, filter]);

	const onlineCount = useMemo(
		() => devices.filter((device) => device.status === 'online').length,
		[devices]
	);
	const offlineCount = devices.length - onlineCount;

	const handleStatusChange = async (uuid: string, status: DeviceStatus) => {
		setStatusUpdating(uuid);
		try {
			const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
			const res = await fetch(`/api/devices/${uuid}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': apiKey,
				},
				body: JSON.stringify({ status }),
			});

			if (!res.ok) {
				throw new Error('Unable to update status');
			}

			const updated: Device = await res.json();
			setDevices((current) =>
				current.map((device) => (device.uuid === uuid ? updated : device))
			);
			toaster({
				message: `${updated.deviceName} is now ${updated.status}`,
				type: 'success',
			});
		} catch (err) {
			toaster({
				message: 'Status update failed',
				description:
					err instanceof Error ? err.message : 'Unknown error occurred',
				type: 'error',
			});
		} finally {
			setStatusUpdating(null);
		}
	};

	const handleDeviceClick = (device: Device) => {
		setSelectedDevice(device);
		setIsDetailsOpen(true);
	};

	useEffect(() => {
		if (!isDetailsOpen || !selectedDevice) {
			return;
		}

		let abort = false;
		setIsFetchingTests(true);
		setTestsError(null);
		setTestResults([]);

		const load = async () => {
			try {
				const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
				const res = await fetch(`/api/devices/${selectedDevice.uuid}/data`, {
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
	}, [isDetailsOpen, selectedDevice]);

	const handleSheetChange = (open: boolean) => {
		setIsDetailsOpen(open);
		if (!open) {
			setSelectedDevice(null);
			setTestResults([]);
			setTestsError(null);
		}
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			deviceId: '',
			deviceName: '',
			deviceType: '',
			status: 'online',
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
			const res = await fetch('/api/devices/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': apiKey,
				},
				body: JSON.stringify(values satisfies RegisterDevicePayload),
			});

			if (!res.ok) {
				const details = await res.json().catch(() => null);
				throw new Error(details?.message ?? 'Unable to register device');
			}

			const device: Device = await res.json();
			setDevices((current) => [device, ...current]);
			form.reset({
				deviceId: '',
				deviceName: '',
				deviceType: '',
				status: 'online',
			});
			toaster({
				message: 'Device registered',
				description: `${device.deviceName} is now tracked`,
				type: 'success',
			});
		} catch (err) {
			toaster({
				message: 'Registration failed',
				description:
					err instanceof Error ? err.message : 'Unknown error occurred',
				type: 'error',
			});
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Total Devices</CardTitle>
						<CardDescription>All registered devices</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{devices.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Online</CardTitle>
						<CardDescription>Currently reporting</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold text-emerald-500">
							{onlineCount}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Offline</CardTitle>
						<CardDescription>Needs attention</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold text-amber-500">
							{offlineCount}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Devices</CardTitle>
							<CardDescription>Monitor device health and status</CardDescription>
						</div>
						<div className="flex flex-wrap gap-2">
							{statusFilters.map((item) => (
								<Button
									key={item.value}
									variant={filter === item.value ? 'default' : 'outline'}
									size="sm"
									onClick={() => setFilter(item.value)}
								>
									{item.label}
								</Button>
							))}
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
									<tr>
										<th className="px-4 py-3">Device</th>
										<th className="px-4 py-3">Type</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3">Last updated</th>
										<th className="px-4 py-3">Change status</th>
									</tr>
								</thead>
								<tbody>
									{isLoading && (
										<tr>
											<td className="px-4 py-6 text-center" colSpan={5}>
												Loading devices...
											</td>
										</tr>
									)}
									{!isLoading && error && (
										<tr>
											<td className="px-4 py-6 text-center text-rose-600" colSpan={5}>
												{error}
											</td>
										</tr>
									)}
									{!isLoading && !error && filteredDevices.length === 0 && (
										<tr>
											<td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
												No devices found
											</td>
										</tr>
									)}
									{filteredDevices.map((device) => (
										<tr
											key={device.uuid}
											className="cursor-pointer border-t text-sm transition hover:bg-muted/40"
											onClick={() => handleDeviceClick(device)}
										>
											<td className="px-4 py-3">
												<div className="font-medium">{device.deviceName}</div>
												<div className="text-muted-foreground text-xs">
													{device.deviceId}
												</div>
											</td>
											<td className="px-4 py-3">{device.deviceType}</td>
											<td className="px-4 py-3">
												<DeviceStatusBadge status={device.status} />
											</td>
											<td className="px-4 py-3">
												{formatDistanceToNow(new Date(device.lastUpdated), {
													addSuffix: true,
												})}
											</td>
											<td
												className="px-4 py-3"
												onClick={(event) => event.stopPropagation()}
											>
												<select
													className="w-full rounded-md border px-2 py-1 text-sm"
													value={device.status}
													disabled={statusUpdating === device.uuid}
													onChange={(event) =>
														handleStatusChange(
															device.uuid,
															event.target.value as DeviceStatus
														)
													}
												>
													<option value="online">Online</option>
													<option value="offline">Offline</option>
												</select>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Add Device</CardTitle>
						<CardDescription>Register a device to start monitoring</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-2">
								<Label htmlFor="deviceId">Device ID</Label>
								<Input id="deviceId" {...form.register('deviceId')} />
								<FormError message={form.formState.errors.deviceId?.message} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="deviceName">Device Name</Label>
								<Input id="deviceName" {...form.register('deviceName')} />
								<FormError message={form.formState.errors.deviceName?.message} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="deviceType">Device Type</Label>
								<Input id="deviceType" {...form.register('deviceType')} />
								<FormError message={form.formState.errors.deviceType?.message} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<select
									id="status"
									className="w-full rounded-md border px-3 py-2 text-sm"
									{...form.register('status')}
								>
									<option value="online">Online</option>
									<option value="offline">Offline</option>
								</select>
								<FormError message={form.formState.errors.status?.message} />
							</div>
							<Button
								className="w-full"
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? 'Registering...' : 'Register Device'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>

			<Sheet open={isDetailsOpen} onOpenChange={handleSheetChange}>
				<SheetContent side="right" className="w-full sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>
							{selectedDevice?.deviceName ?? 'Device details'}
						</SheetTitle>
						<SheetDescription>
							Review device information and the latest test results
						</SheetDescription>
					</SheetHeader>

					{selectedDevice && (
						<div className="space-y-6 p-4 pt-0">
							<section className="space-y-2 rounded-lg border p-4 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Device ID</span>
									<span className="font-medium">{selectedDevice.deviceId}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Type</span>
									<span className="font-medium">
										{selectedDevice.deviceType}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<DeviceStatusBadge status={selectedDevice.status} />
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Last updated</span>
									<span>
										{formatDistanceToNow(new Date(selectedDevice.lastUpdated), {
											addSuffix: true,
										})}
									</span>
								</div>
							</section>

							<section className="space-y-3">
								<h3 className="text-base font-semibold">Recent Test Results</h3>
								<div className="rounded-lg border">
									<table className="w-full text-sm">
										<thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
											<tr>
												<th className="px-3 py-2">Timestamp</th>
												<th className="px-3 py-2">Test</th>
												<th className="px-3 py-2">Value</th>
												<th className="px-3 py-2">Status</th>
											</tr>
										</thead>
										<tbody>
											{isFetchingTests && (
												<tr>
													<td className="px-3 py-4 text-center" colSpan={4}>
														Loading test data...
													</td>
												</tr>
											)}
											{!isFetchingTests && testsError && (
												<tr>
													<td
														className="px-3 py-4 text-center text-rose-600"
														colSpan={4}
													>
														{testsError}
													</td>
												</tr>
											)}
											{!isFetchingTests &&
												!testsError &&
												testResults.length === 0 && (
													<tr>
														<td
															className="px-3 py-4 text-center text-muted-foreground"
															colSpan={4}
														>
															No data available
														</td>
													</tr>
												)}
											{testResults.map((result) => (
												<tr key={result.id} className="border-t">
													<td className="px-3 py-2">
														{formatDistanceToNow(new Date(result.timestamp), {
															addSuffix: true,
														})}
													</td>
													<td className="px-3 py-2">{result.testType}</td>
													<td className="px-3 py-2">
														{result.value} {result.unit}
													</td>
													<td className="px-3 py-2">
														<span
															className={cn(
																'rounded-full px-2 py-0.5 text-xs font-medium',
																result.status === 'normal'
																	? 'bg-emerald-100 text-emerald-700'
																	: 'bg-rose-100 text-rose-700'
															)}
														>
															{result.status}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}

function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
				status === 'online'
					? 'bg-emerald-100 text-emerald-700'
					: 'bg-slate-200 text-slate-700'
			)}
		>
			<span
				className={cn(
					'h-2 w-2 rounded-full',
					status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'
				)}
			/>
			{status}
		</span>
	);
}

function FormError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-xs text-rose-600">{message}</p>;
}

