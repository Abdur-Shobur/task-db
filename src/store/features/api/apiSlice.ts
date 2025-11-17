import { env } from '@/lib';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
	baseUrl: typeof window !== 'undefined' ? '/api' : `${env.baseAPI}/api`,
	prepareHeaders: (headers) => {
		// Add API key for device endpoints
		// In production, this should come from environment variables or user session
		const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
		headers.set('X-API-Key', apiKey);
		return headers;
	},
});

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery,
	endpoints: () => ({}),
	refetchOnReconnect: true,
	refetchOnFocus: true,
	tagTypes: ['DEVICES'],
	keepUnusedDataFor: 50000,
});
