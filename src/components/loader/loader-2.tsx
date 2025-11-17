import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function Loader2() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-6 w-1/3" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<Skeleton className="h-4 w-2/3" />
		</div>
	);
}
