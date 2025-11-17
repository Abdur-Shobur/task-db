'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { LoaderCircle, Plus } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { handleValidationError, toaster } from '@/lib';
import { useDeviceStoreMutation } from './api-slice';
import { DeviceStatus, RegisterDevicePayload } from './type';

// --- Zod Schema ---
const schema = z.object({
	deviceId: z
		.string({ message: 'Device ID is required' })
		.trim()
		.min(2, 'Device ID must be at least 2 characters'),
	deviceName: z
		.string({ message: 'Device name is required' })
		.trim()
		.min(2, 'Device name must be at least 2 characters'),
	deviceType: z
		.string({ message: 'Device type is required' })
		.trim()
		.min(2, 'Device type must be at least 2 characters'),
	status: z.enum(['online', 'offline']),
});

type ZodType = z.infer<typeof schema>;

export function DeviceStore() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="lg" variant="default">
					<Plus className="h-4 w-4" />
					<span className="hidden md:inline">Add Device</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px] overflow-y-scroll max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Register Device</DialogTitle>
					<DialogDescription>
						Register a new device to start monitoring.
					</DialogDescription>
				</DialogHeader>

				{open && <FORM setOpen={setOpen} />}
			</DialogContent>
		</Dialog>
	);
}

const FORM = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
	const [store, { isLoading }] = useDeviceStoreMutation();

	const form = useForm<ZodType>({
		resolver: zodResolver(schema),
		defaultValues: {
			deviceId: '',
			deviceName: '',
			deviceType: '',
			status: 'online',
		},
	});

	const onSubmit = async (data: ZodType) => {
		try {
			const response = await store(
				data satisfies RegisterDevicePayload
			).unwrap();
			toaster({
				message: 'Device registered successfully',
				description: `${response.deviceName} is now being monitored`,
				type: 'success',
			});
			form.reset({
				deviceId: '',
				deviceName: '',
				deviceType: '',
				status: 'online',
			});
			setOpen(false);
		} catch (error: any) {
			if (error?.status === 400 || error?.data) {
				handleValidationError(error.data || error, form.setError);
			} else {
				toaster({
					message: 'Failed to register device',
					description: error?.data?.message || 'Something went wrong',
					type: 'error',
				});
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Device ID */}
				<FormField
					control={form.control}
					name="deviceId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device ID</FormLabel>
							<FormControl>
								<Input {...field} placeholder="e.g., DX-1000" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Device Name */}
				<FormField
					control={form.control}
					name="deviceName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device Name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="e.g., DeltaX Analyzer" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Device Type */}
				<FormField
					control={form.control}
					name="deviceType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device Type</FormLabel>
							<FormControl>
								<Input {...field} placeholder="e.g., Chemistry, Microscope" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Status */}
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="online">Online</SelectItem>
									<SelectItem value="offline">Offline</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogFooter>
					<Button type="submit" disabled={isLoading}>
						{isLoading && (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						)}
						{isLoading ? 'Registering...' : 'Register Device'}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
