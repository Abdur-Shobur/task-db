import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function Loader6() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-6 w-1/2" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<Skeleton className="h-4 w-4/6" />
			<Skeleton className="h-4 w-3/4" />
		</div>
	);
}
