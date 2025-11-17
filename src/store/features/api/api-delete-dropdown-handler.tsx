'use client';

import { LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';

import {
	DropdownMenuItem,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { alertConfirm, toaster } from '@/lib';
import { ResponseType } from './response-type';

export function ApiDeleteDropdownHandler({
	data,
	mutation,
	isLoading,
	text = 'Delete',
}: {
	data: any;
	mutation: any;
	isLoading: any;
	text?: string;
}) {
	const [clicked, setClicked] = useState(false);

	const handleClick = async () => {
		if (clicked || isLoading) return;

		setClicked(true);

		alertConfirm({
			onOk: async () => {
				try {
					const res: ResponseType<null> = await mutation(data).unwrap();
					if (res.status) {
						toaster({ message: res.message || 'Deleted successfully' });
					} else {
						toaster({ message: res.message || 'Failed to delete' });
					}
				} catch (err) {
					toaster({ message: 'Failed to delete' });
				} finally {
					setClicked(false);
				}
			},
			onCancel: () => {
				setClicked(false);
			},
		});
	};

	return (
		<DropdownMenuItem
			onSelect={(e) => {
				e.preventDefault();
				handleClick();
			}}
			disabled={isLoading || clicked}
			className="flex items-center gap-2 cursor-pointer"
			variant="destructive"
		>
			<DropdownMenuShortcut className="ml-0">
				{isLoading ? (
					<LoaderCircle className="size-4 animate-spin text-destructive" />
				) : (
					<X className="size-4 text-destructive" />
				)}
			</DropdownMenuShortcut>
			{text}
		</DropdownMenuItem>
	);
}
