import { LucideIcon } from 'lucide-react';

export type sidebarSubItem = {
	title: string;
	url: string;
};

export type sidebarItem = {
	title: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: sidebarSubItem[];
};
