import { AppSidebarForAdmin } from '@/components/layout/admin-layout';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['vietnamese'] });

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider className={`${inter.className} antialiased`}>
			<AppSidebarForAdmin />
			<SidebarInset className="border m-1.5 rounded-2xl overflow-x-hidden">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
