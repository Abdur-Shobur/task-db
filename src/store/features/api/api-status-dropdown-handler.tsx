'use client';

import { useState } from 'react';

import {
	DropdownMenuItem,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { alertConfirm, cn, toaster } from '@/lib';
import { DynamicIcon } from '@/lib/icon/dynamic-icon';
import { ResponseType } from './response-type';

export function ApiStatusDropdownHandler({
	data,
	mutation,
	isLoading,
	text = 'Status',
	variant = 'default',
	icon = 'X',
}: {
	data: any;
	mutation: any;
	isLoading: any;
	text?: string;
	variant?: 'default' | 'destructive';
	icon?: string;
}) {
	const [clicked, setClicked] = useState(false);

	const handleClick = async () => {
		if (clicked || isLoading) return;

		setClicked(true);

		alertConfirm({
			onOk: async () => {
				try {
					const res: ResponseType<null> = await mutation(data).unwrap();
					console.log(res);
					if (res.status) {
						toaster({ message: res.message || 'Status updated successfully' });
					} else {
						toaster({ message: res.message || 'Failed to update status' });
					}
				} catch (err) {
					toaster({ message: 'Failed to update status' });
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
			variant={variant}
		>
			<DropdownMenuShortcut className="ml-0">
				<DynamicIcon
					icon={icon}
					className={cn(
						'size-4',
						variant === 'destructive' ? 'text-destructive' : 'text-primary'
					)}
				/>
			</DropdownMenuShortcut>
			{text}
		</DropdownMenuItem>
	);
}
