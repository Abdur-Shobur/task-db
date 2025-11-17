'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { IconModal } from './icon-modal';
export function LucideIconSelect({
	methods,
	label = true,
}: {
	methods: any;
	label?: boolean;
}) {
	return (
		<FormField
			control={methods.control}
			name="image"
			render={({ field }) => (
				<FormItem>
					{label && <Label className="capitalize block mt-2">Icon</Label>}
					<FormControl>
						<IconModal
							onSave={(value) => {
								field.onChange(value);
							}}
							defaultValue={field.value}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
