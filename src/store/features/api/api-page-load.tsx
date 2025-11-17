import { Loader2 } from '@/components/loader';
import { ResponseType } from './response-type';

export default function ApiPageLoad<T>({
	data,
	isLoading,
	isError,
	children,
	loader = 'loader-2',
}: {
	data?: ResponseType<T>;
	isLoading: boolean;
	isError: boolean;
	children: React.ReactNode;
	loader?: 'loader-1' | 'loader-2' | 'loader-3' | 'loader-4';
}) {
	if (isLoading && !isError && !data) {
		switch (loader) {
			case 'loader-1':
				return <Loader2 />;
			case 'loader-2':
				return <Loader2 />;
		}
	}
	if (isError && !data) return <div>Error</div>;
	return !isLoading && !isError && data ? children : null;
}
