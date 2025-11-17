import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function Loader4() {
	return (
		<div className="w-full max-w-sm p-4 border rounded-lg shadow space-y-4">
			<Skeleton className="h-40 w-full rounded-md" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}
