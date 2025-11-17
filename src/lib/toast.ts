import { toast } from 'sonner';

export const toaster = ({
	message,
	description,
	type = 'success',
}: {
	message: string;
	description?: string;
	type?: 'success' | 'error' | 'info' | 'warning';
}) => {
	switch (type) {
		case 'success':
			toast.success(message, {
				description,
			});
			break;
		case 'error':
			toast.error(message, {
				description,
			});
			break;
		case 'info':
			toast.info(message, {
				description,
			});
			break;
		case 'warning':
			toast.warning(message, {
				description,
			});
			break;
	}
};
