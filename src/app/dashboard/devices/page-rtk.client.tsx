'use client';

import { useState, useMemo } from 'react';
import { DevicePage, DeviceStore } from '@/store/features/device';
import { useDeviceQuery } from '@/store/features/device';
import { DeviceStatus } from '@/types/devices';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Container1 } from '@/components/container';
import { CardHeader } from '@/components/ui/card';

export default function DevicesPageRTKClient() {
	const [params, setParams] = useState<{
		status?: DeviceStatus | 'all';
		search?: string;
	}>({
		status: 'all',
		search: '',
	});

	const { data, isLoading, error, isError } = useDeviceQuery({
		status: params.status === 'all' ? undefined : params.status,
		search: params.search,
	});

	const filteredData = useMemo(() => {
		if (!data) return [];
		if (!params.search) return data;
		const search = params.search.toLowerCase();
		return data.filter(
			(device) =>
				device.deviceName.toLowerCase().includes(search) ||
				device.deviceId.toLowerCase().includes(search) ||
				device.deviceType.toLowerCase().includes(search)
		);
	}, [data, params.search]);

	return (
		<Container1
			isLoading={isLoading}
			isError={isError}
			error={error}
			header={
				<CardHeader className="pb-2 px-5 flex-1 flex items-center justify-between">
					<div>
						<CardTitle className="text-primary font-semibold text-xl">
							Devices
						</CardTitle>
						<CardDescription className="text-tertiary font-normal text-base hidden lg:block">
							Recently created Devices from this organization.
						</CardDescription>
					</div>
					<DeviceStore />
				</CardHeader>
			}
		>
			{/* page content */}

			{data && data.length > 0 && (
				<DevicePage data={data} params={params} setParams={setParams} />
			)}
		</Container1>
	);
}
