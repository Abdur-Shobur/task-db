'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
export function ErrorAlert({
	title = 'Unable to process the Page',
	children = (
		<>
			<p>Please verify your internet connection and try again.</p>
			<ul className="list-inside list-disc text-sm">
				<li>Check your internet connection</li>
				<li>Try refreshing the page</li>
				<li>Please try again later!</li>
			</ul>
		</>
	),
}: {
	title?: string;
	children?: React.ReactNode;
}) {
	return (
		<Alert variant="destructive">
			<AlertCircleIcon />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{children}</AlertDescription>
		</Alert>
	);
}
