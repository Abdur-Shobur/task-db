'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Pen } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	DropdownMenuItem,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { handleValidationError, toaster } from '@/lib';
import { useDeviceUpdateMutation } from './api-slice';
import { Device, RegisterDevicePayload } from './type';

// --- Zod Schema ---
const schema = z.object({
	deviceName: z
		.string({ error: 'Device name is required' })
		.trim()
		.min(2, 'Device name must be at least 2 characters'),
	deviceType: z
		.string({ error: 'Device type is required' })
		.trim()
		.min(2, 'Device type must be at least 2 characters'),
});

type ZodType = z.infer<typeof schema>;

//  Component
export function UpdateModal({ data }: { data: Device }) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
				<DialogTrigger className="flex items-center gap-2 w-full">
					<DropdownMenuShortcut className="ml-0">
						<Pen className="size-4" />
					</DropdownMenuShortcut>
					Edit Device
				</DialogTrigger>
			</DropdownMenuItem>

			<DialogContent
				className={cn('sm:max-w-[500px] w-full overflow-y-scroll max-h-[90vh]')}
			>
				<DialogHeader>
					<DialogTitle>Update Device</DialogTitle>
				</DialogHeader>

				{open && <FORM setOpen={setOpen} editData={data} />}
			</DialogContent>
		</Dialog>
	);
}

const FORM = ({
	setOpen,
	editData,
}: {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	editData: Device;
}) => {
	const [mutation, { isLoading }] = useDeviceUpdateMutation();

	const form = useForm<ZodType>({
		resolver: zodResolver(schema),
		defaultValues: {
			deviceName: editData.deviceName,
			deviceType: editData.deviceType,
		},
	});

	const onSubmit = async (formData: ZodType) => {
		try {
			await mutation({
				uuid: editData.uuid,
				data: formData satisfies Partial<RegisterDevicePayload>,
			}).unwrap();
			toaster({
				message: 'Device updated successfully',
				type: 'success',
			});
			setOpen(false);
		} catch (error: any) {
			if (error?.status === 400 || error?.data) {
				handleValidationError(error.data || error, form.setError);
			} else {
				toaster({
					message: 'Failed to update device',
					description: error?.data?.message || 'Something went wrong',
					type: 'error',
				});
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Device ID (read-only) */}
				<div className="space-y-2">
					<FormLabel>Device ID</FormLabel>
					<Input value={editData.deviceId} readOnly disabled />
					<p className="text-xs text-muted-foreground">
						Device ID cannot be changed
					</p>
				</div>

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

				<DialogFooter>
					<Button type="submit" disabled={isLoading}>
						{isLoading && (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						)}
						{isLoading ? 'Updating...' : 'Update Device'}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
