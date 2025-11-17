import { Toaster } from 'sonner';
import { ReduxProviders } from './redux-provider';
import { ThemeProvider } from './theme-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme="system">
			<ReduxProviders>
				{children}
				<Toaster position="top-right" richColors />
			</ReduxProviders>
		</ThemeProvider>
	);
}
