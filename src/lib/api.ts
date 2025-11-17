// lib/api.ts

import { env } from './env';

export interface ApiError extends Error {
	status?: number;
	statusText?: string;
	url?: string;
}

export async function getApiData<T = any>(url: string): Promise<T | null> {
	try {
		const res = await fetch(env.baseAPI + '/api' + url, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			const error: ApiError = new Error(
				`API Error ${res.status}: ${res.statusText}`
			);
			error.status = res.status;
			error.statusText = res.statusText;
			error.url = url;

			// Try to get error details from response
			try {
				const errorData = await res.json();
				if (errorData.message) {
					error.message = errorData.message;
				}
			} catch {
				// If we can't parse the error response, use the default message
			}

			throw error;
		}

		const data = await res.json();
		return data;
	} catch (error) {
		// Re-throw the error so it can be caught by error boundaries
		if (error instanceof Error) {
			const apiError: ApiError = error;
			apiError.url = url;
			throw apiError;
		}

		// Handle non-Error objects
		const unknownError: ApiError = new Error('Unknown API error occurred');
		unknownError.url = url;
		throw unknownError;
	}
}

/*
const [
	settings,
	services,
	orgOne,
	orgTwo,
	itService,
	partners,
	subscriptions,
] = await Promise.all([
	getApiData<iSettingsType>('/settings'),
	getApiData<iServicesType>('/services'),
	getApiData<iOrgOneType>('/org-one'),
	getApiData<iOrgTwoType>('/org-two'),
	getApiData<iItServicesType>('/it-services'),
	getApiData<iPartnersType>('/partners'),
	getApiData<iSubscriptionsType>('/subscriptions'),
]);

if (settings?.status !== 200) {
	return notFound();
}
*/
