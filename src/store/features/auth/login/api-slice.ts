import { toaster } from '@/lib';
import { signIn } from 'next-auth/react';
import { apiSlice } from '../../api/apiSlice';
import { ResponseType } from '../../api/response-type';
import { ILogin, ILoginResponse } from './type';

const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		/**
		 * Login
		 **/
		Login: builder.mutation<ResponseType<ILoginResponse>, ILogin>({
			query: (data) => {
				return {
					url: '/auth/login',
					method: 'POST',
					body: data,
				};
			},
			// async onQueryStarted(arg, { queryFulfilled }) {
			// 	try {
			// 		const { data } = await queryFulfilled;
			// 		// persist tokens into NextAuth session
			// 		if (data.statusCode === 200) {
			// 			const signInResult = await signIn('credentials', {
			// 				redirect: false,
			// 				token: JSON.stringify(data.data),
			// 			});

			// 			if (signInResult?.ok) {
			// 				toaster({ message: data.message || 'Login successful' });
			// 				// Redirect to dashboard immediately after successful login
			// 				if (typeof window !== 'undefined') {
			// 					window.location.replace('/dashboard');
			// 				}
			// 			} else {
			// 				toaster({
			// 					message: data.message || 'Login failed',
			// 					type: 'error',
			// 				});
			// 			}
			// 		} else {
			// 			toaster({ message: data.message || 'Login failed', type: 'error' });
			// 		}
			// 	} catch (e) {
			// 		// ignore, handled by the component
			// 	}
			// },
		}),
	}),
});

export const { useLoginMutation } = api;
