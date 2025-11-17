import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AppRoot() {
	const router = useRouter();
	const handleRootNavigate = (role: string) => {
		switch (role) {
			case '/dashboard':
				router.push(role);
				break;

			default:
				break;
		}
	};
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Root</SidebarGroupLabel>
			<SidebarMenu>
				<Collapsible asChild defaultOpen={true} className="group/collapsible">
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton
								onClick={() => handleRootNavigate('/dashboard')}
								tooltip={'Dashboard'}
								className="cursor-pointer"
							>
								<LayoutDashboard />
								<span>Dashboard</span>
							</SidebarMenuButton>
						</CollapsibleTrigger>
					</SidebarMenuItem>
				</Collapsible>
			</SidebarMenu>
		</SidebarGroup>
	);
}
