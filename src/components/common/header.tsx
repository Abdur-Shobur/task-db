'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { DynamicBreadcrumb, type Crumb } from './dynamic-breadcrumb';
export type HeaderProps = {
	breadcrumbItems?: Crumb[];
};

export function Header({ breadcrumbItems }: HeaderProps) {
	const { data: session } = useSession();
	console.log(session);
	return (
		<header>
			<div className="flex shrink-0 pt-3 pb-2 lg:pb-5 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto justify-between px-5">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="-ml-1.5" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					{breadcrumbItems && <DynamicBreadcrumb items={breadcrumbItems} />}
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-8 w-8 rounded-full cursor-pointer"
							>
								<Avatar className="h-10 w-10 bg-sky-200">
									<AvatarImage alt="User" />
									<AvatarFallback className="bg-sky-200 dark:bg-sky-900">
										{session?.user?.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{session?.user?.name}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{session?.user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link className="flex gap-2 items-center" href="/profile">
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Billing</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => signOut({ callbackUrl: '/', redirect: true })}
								className="cursor-pointer"
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
