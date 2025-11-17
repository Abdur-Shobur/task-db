'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { cn } from '../utils';
import { DynamicIcon } from './dynamic-icon';
import IconSelect from './icon-select';

export function IconModal({
	onSave,
	defaultValue,
}: {
	defaultValue: string;
	onSave: (value: string) => void;
}) {
	const [value, setValue] = React.useState(defaultValue || 'Annoyed');
	const [open, setOpen] = React.useState(false);

	const handleSave = () => {
		onSave(value);
		setOpen(false);
	};

	useEffect(() => {
		setValue(typeof defaultValue === 'string' ? defaultValue : 'Annoyed');
	}, [defaultValue]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className={cn('w-14 h-14 text-3xl')}
				>
					<DynamicIcon icon={value ? value : 'Annoyed'} className="!w-8 !h-8" />
				</Button>
			</DialogTrigger>
			<DialogContent
				onEscapeKeyDown={(e) => e.preventDefault()}
				onPointerDown={(e) => e.preventDefault()}
				onInteractOutside={(e) => e.preventDefault()}
				className="max-w-6xl min-h-96"
			>
				<DialogHeader>
					<DialogTitle>Icons</DialogTitle>
					<DialogDescription>
						Select Icon here. Click save when you&apos;re done.
					</DialogDescription>
					<Link
						className="text-sm underline text-blue-600"
						href="https://lucide.dev/icons/"
						target="_blank"
					>
						Icons Library
					</Link>
				</DialogHeader>
				{/* icon component here */}

				<IconSelect value={value} setValue={setValue} />

				<DialogFooter>
					<Button type="button" onClick={handleSave}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
