import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Login } from '@/store/features/auth/login';

export const metadata: Metadata = {
	title: 'Login - Device Status Dashboard',
	description: 'Login to access the device monitoring dashboard',
};

export default async function Home() {
	const session = await getServerSession(authOptions);

	// Redirect authenticated users to dashboard
	if (session) {
		redirect('/dashboard');
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				<Login />
			</div>
		</div>
	);
}
