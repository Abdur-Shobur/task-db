import { Metadata } from 'next';
import { Login } from '@/store/features/auth/login';

export const metadata: Metadata = {
	title: 'Login - Device Status Dashboard',
	description: 'Login to access the device monitoring dashboard',
};

export default function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Login />
			</div>
		</div>
	);
}

