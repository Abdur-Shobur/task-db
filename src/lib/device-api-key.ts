/**
 * Get the device API key for authentication
 * In production, this should be stored securely and retrieved from environment variables
 */
export function getDeviceApiKey(): string {
	return process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
}

