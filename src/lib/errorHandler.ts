import { FieldValues, UseFormSetError } from 'react-hook-form';
import { toaster } from './toast';

type ServerErrorResponse = {
	message?: string;
	errors?: Record<string, string[]>;
};

export function handleValidationError<T extends FieldValues>(
	response: ServerErrorResponse,
	setError: UseFormSetError<T>
) {
	if (typeof response.errors === 'object') {
		Object.entries(response.errors).forEach(([field, messages]) => {
			setError(field as any, {
				type: 'server',
				message: (messages as string[])[0],
			});
		});
	} else {
		toaster({
			message: response?.message || 'Something went wrong',
			type: 'error',
		});
	}
}
