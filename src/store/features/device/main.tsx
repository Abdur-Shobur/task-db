'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { textCount } from '@/lib';

import { Button } from '@/components/ui/button';

import { formatDistanceToNow } from 'date-fns';
import { Ellipsis, LoaderCircle } from 'lucide-react';
import { ApiDeleteDropdownHandler } from '../api/api-delete-dropdown-handler';
import { ApiStatusDropdownHandler } from '../api/api-status-dropdown-handler';
import { useDeviceDeleteMutation, useDeviceStatusMutation } from './api-slice';
import { DeviceDetailsSheet } from './details-sheet';
import { StatisticsToolbar } from './statistics-toolbar';
import Toolbar from './toolbar';
import { Device } from './type';
import { UpdateModal } from './update-modal';

export const DevicePage = ({
	data,
	params,
	setParams,
}: {
	data?: Device[];
	params: Record<string, any>;
	setParams: (params: Record<string, any>) => void;
}) => {
	// Filter data by search if provided
	const filteredData = data?.filter((device) => {
		if (!params?.search) return true;
		const search = params.search.toLowerCase();
		return (
			device.deviceName.toLowerCase().includes(search) ||
			device.deviceId.toLowerCase().includes(search) ||
			device.deviceType.toLowerCase().includes(search)
		);
	});

	return (
		<>
			<StatisticsToolbar devices={data} />
			<Toolbar params={params} setParams={setParams} />
			<div className="border rounded-lg relative mb-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Device ID
							</TableHead>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Device Name
							</TableHead>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Type
							</TableHead>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Status
							</TableHead>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Last Updated
							</TableHead>
							<TableHead className="bg-stone-100 dark:bg-transparent">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!filteredData || filteredData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									No devices found matching your criteria
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((item) => (
								<TableRow key={item.uuid}>
									<TableCell className="py-2 pl-4 font-medium">
										<code className="text-sm">{item.deviceId}</code>
									</TableCell>
									<TableCell className="py-2 font-medium">
										{textCount(item.deviceName)}
									</TableCell>
									<TableCell className="py-2">
										{textCount(item.deviceType)}
									</TableCell>
									<TableCell className="py-2">
										<Badge
											className="capitalize"
											variant={
												item.status === 'online' ? 'default' : 'secondary'
											}
										>
											{item.status}
										</Badge>
									</TableCell>
									<TableCell className="py-2 text-sm text-muted-foreground">
										{formatDistanceToNow(new Date(item.lastUpdated), {
											addSuffix: true,
										})}
									</TableCell>
									<TableCell className="py-2">
										<DropDownAction item={item} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

const DropDownAction = ({ item }: { item: Device }) => {
	const [mutationStatus, { isLoading: isLoadingStatus }] =
		useDeviceStatusMutation();
	const [mutationDelete, { isLoading: isLoadingDelete }] =
		useDeviceDeleteMutation();

	const loading = isLoadingStatus || isLoadingDelete;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
					size="icon"
					disabled={loading}
				>
					{loading ? (
						<LoaderCircle className="size-4 animate-spin" />
					) : (
						<Ellipsis />
					)}
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				{/* Details */}
				<DeviceDetailsSheet device={item} />

				{/* Update */}
				<UpdateModal data={item} />

				<DropdownMenuSeparator />

				{/* STATUS ACTIVE (ONLINE) */}
				{item.status !== 'online' && (
					<ApiStatusDropdownHandler
						data={{ uuid: item.uuid, status: 'online' }}
						mutation={mutationStatus}
						isLoading={isLoadingStatus}
						text="Set Online"
						icon="Power"
					/>
				)}

				{/* STATUS OFFLINE (OFFLINE) */}
				{item.status !== 'offline' && (
					<ApiStatusDropdownHandler
						data={{ uuid: item.uuid, status: 'offline' }}
						mutation={mutationStatus}
						isLoading={isLoadingStatus}
						text="Set Offline"
						icon="Power"
					/>
				)}

				<DropdownMenuSeparator />

				{/* DELETE */}
				<ApiDeleteDropdownHandler
					data={{ uuid: item.uuid }}
					mutation={mutationDelete}
					isLoading={isLoadingDelete}
					text="Delete Device"
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
