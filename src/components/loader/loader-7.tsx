import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function Loader7() {
	return (
		<div className="w-full max-w-sm p-4 border rounded-lg shadow space-y-4">
			<div className="flex items-center space-x-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-3/5" />
					<Skeleton className="h-3 w-2/5" />
				</div>
			</div>
			<Skeleton className="h-32 w-full rounded-md" />
		</div>
	);
}
