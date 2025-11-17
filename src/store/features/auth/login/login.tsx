'use client';

import { toaster } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoginMutation } from './api-slice';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

// login schema
const loginSchema = z.object({
	email: z.email({ message: 'Enter a valid email address' }),
	password: z
		.string({ message: 'Password is required' })
		.trim()
		.min(6, { message: 'Password must be at least 6 characters' }),
	remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
	const router = useRouter();
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '', remember: false },
	});

	// login mutation
	const [login, { isLoading }] = useLoginMutation();

	// on submit
	const onSubmit = async (values: LoginFormValues): Promise<void> => {
		try {
			// login
			const response = await login({
				email: values.email,
				password: values.password,
			}).unwrap();

			if (response.statusCode === 200 && response.data) {
				// sign in with credentials
				const signInResult = await signIn('credentials', {
					token: JSON.stringify(response.data),
					redirect: false,
				});

				if (signInResult?.ok) {
					// if success
					toaster({
						message: response.message || 'Login successful!',
						type: 'success',
					});
					form.reset({ email: '', password: '', remember: false });
					router.push('/dashboard');
				} else {
					// if failed
					toaster({
						message: 'Authentication failed. Please try again.',
						type: 'error',
					});
				}
			} else {
				// if failed
				toaster({
					message:
						response.message || 'Login failed. Please check your credentials.',
					type: 'error',
				});
			}
		} catch (err: any) {
			// if failed with error
			const message =
				(typeof err === 'object' &&
					err !== null &&
					'data' in err &&
					err?.data?.message) ||
				'Login failed. Please check your credentials.';
			toaster({
				message: message || 'Login failed. Please check your credentials.',
				type: 'error',
			});
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">Login</CardTitle>
				<CardDescription>
					Enter your credentials to access the device dashboard
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="your.email@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center justify-between">
							<FormField
								control={form.control}
								name="remember"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-sm font-normal cursor-pointer">
												Remember me
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>
							<Link
								href="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
									Logging in...
								</>
							) : (
								'Login'
							)}
						</Button>
					</form>
				</Form>

				<div className="mt-4 text-center text-sm text-muted-foreground">
					<p>
						Don&apos;t have an account?{' '}
						<Link href="/register" className="text-primary hover:underline">
							Register
						</Link>
					</p>
					<p className="mt-2 text-xs">
						Demo credentials: admin@example.com / admin123
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
