import { Skeleton } from '@/components/ui/skeleton';

export function Loader5() {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full table-auto space-y-2">
				<thead>
					<tr>
						{[...Array(4)].map((_, i) => (
							<th key={i} className="px-2 first:pl-0 last:pr-0 py-2 text-left">
								<Skeleton className="h-4 w-full lg:w-24" />
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{[...Array(5)].map((_, row) => (
						<tr key={row}>
							{[...Array(4)].map((_, col) => (
								<td key={col} className="px-2 first:pl-0 last:pr-0 py-2">
									<Skeleton className="h-3 w-full" />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
