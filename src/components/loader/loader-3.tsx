import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function Loader3() {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-4 w-full" />
			))}
		</div>
	);
}
