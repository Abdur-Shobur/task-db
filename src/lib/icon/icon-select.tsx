'use client';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import * as React from 'react';
import { DynamicIcon } from './dynamic-icon';
import { LucideIcons } from './icon.type';

function useDebounce(value: string, delay: number) {
	const [debounced, setDebounced] = React.useState(value);
	React.useEffect(() => {
		const handler = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debounced;
}

export default function IconSelect({
	value,
	setValue,
}: {
	value: string;
	setValue: any;
}) {
	const [load, setLoad] = React.useState(105);
	const [query, setQuery] = React.useState('');
	const debouncedQuery = useDebounce(query, 150);

	const filteredIcons = React.useMemo(() => {
		return LucideIcons.filter((icon) =>
			icon.toLowerCase().includes(debouncedQuery.toLowerCase())
		);
	}, [debouncedQuery]);

	const handleLoadMore = () => {
		if (filteredIcons.length > load) setLoad(load + 300);
	};

	return (
		<Command className="border max-h-[500px] overflow-auto">
			<CommandInput
				placeholder="Search Icon..."
				value={query}
				onValueChange={setQuery}
				autoFocus
			/>
			<CommandList>
				<CommandEmpty>No Icon found.</CommandEmpty>
				<CommandGroup className="IconsViewGrid">
					{filteredIcons.slice(0, load).map((framework) => (
						<CommandItem
							key={framework}
							value={framework}
							onSelect={(currentValue) =>
								setValue(currentValue === value ? '' : currentValue)
							}
							className={`cursor-pointer ${
								value === framework ? 'bg-accent ' : ''
							}`}
						>
							<DynamicIcon
								icon={framework}
								className={`w-full ${
									value === framework
										? 'text-sky-600'
										: 'dark:text-white text-stone-800'
								}`}
							/>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
			{filteredIcons.length > load && (
				<div className="flex justify-center">
					<Button
						onClick={handleLoadMore}
						className="w-fit"
						type="button"
						size="sm"
						variant="outline"
					>
						Load more
					</Button>
				</div>
			)}
		</Command>
	);
}
