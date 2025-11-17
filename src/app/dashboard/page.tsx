import { Crumb } from '@/components/common/dynamic-breadcrumb';
import { Header } from '@/components/common/header';
import { PageWrap } from '@/components/common/page-wrap';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import PageClient from './page.client';

// breadcrumb items
const breadcrumbItems: Crumb[] = [
	{
		name: 'Dashboard',
	},
];

// page
export default function Page() {
	return (
		<>
			{/* header of the page */}
			<Header breadcrumbItems={breadcrumbItems}></Header>

			{/* page wrap */}
			<PageWrap
				header={
					<CardHeader className="p-3 flex-1 flex items-center justify-between">
						<CardTitle className="text-primary font-semibold text-xl">
							Dashboard
						</CardTitle>
					</CardHeader>
				}
			>
				{/* page content */}
				<PageClient />
			</PageWrap>
		</>
	);
}

// metadata
export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard',
};
