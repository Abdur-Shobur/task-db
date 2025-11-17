'use client';

import { MonitorCog } from 'lucide-react';

import { sidebarItem } from './layout-type';

const Devices: sidebarItem[] = [
	{
		title: 'Manage Devices',
		url: '/dashboard/devices',
		icon: MonitorCog,
		isActive: false,
	},
];

export const adminSidebarData = {
	Devices,
};
