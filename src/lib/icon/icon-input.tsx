'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { IconModal } from './icon-modal';

export function IconInput({
	methods,
	label,
	name,
}: {
	methods: any;
	label?: string;
	name: string;
}) {
	return (
		<FormField
			control={methods.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <Label className="capitalize block mt-2">{label}</Label>}
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
/* use
<IconInput methods={form}  />
*/
