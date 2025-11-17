import { Crumb } from '@/components/common/dynamic-breadcrumb';
import { Header } from '@/components/common/header';
import { Metadata } from 'next';
import DevicesPageRTKClient from './page-rtk.client';

const breadcrumbItems: Crumb[] = [
	{ name: 'Dashboard', path: '/dashboard' },
	{ name: 'Devices' },
];

export const metadata: Metadata = {
	title: 'Device Status Dashboard',
	description: 'Monitor laboratory devices, statuses, and test data.',
};

export default function DevicesPage() {
	return (
		<>
			<Header breadcrumbItems={breadcrumbItems} />
			<DevicesPageRTKClient />
		</>
	);
}
