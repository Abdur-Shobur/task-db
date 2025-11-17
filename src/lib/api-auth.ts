import { NextResponse } from 'next/server';

// Hardcoded API key for basic authentication
// In production, this should be stored in environment variables
const VALID_API_KEY = process.env.DEVICE_API_KEY || 'device-api-key-2024';

export interface AuthResult {
	authorized: boolean;
	error?: NextResponse;
}

/**
 * Simple authentication check using API key
 * Checks for 'X-API-Key' header or 'Authorization: Bearer <key>' header
 */
export function checkApiAuth(request: Request): AuthResult {
	const apiKey = 
		request.headers.get('X-API-Key') ||
		request.headers.get('authorization')?.replace('Bearer ', '');

	if (!apiKey) {
		return {
			authorized: false,
			error: NextResponse.json(
				{ message: 'Unauthorized: API key required. Please provide X-API-Key header or Authorization: Bearer <key>' },
				{ status: 401 }
			),
		};
	}

	if (apiKey !== VALID_API_KEY) {
		return {
			authorized: false,
			error: NextResponse.json(
				{ message: 'Unauthorized: Invalid API key' },
				{ status: 401 }
			),
		};
	}

	return { authorized: true };
}

/**
 * Alternative: Simple username/password check for basic auth
 */
export async function checkBasicAuth(request: Request): Promise<AuthResult> {
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Basic ')) {
		return {
			authorized: false,
			error: NextResponse.json(
				{ message: 'Unauthorized: Basic authentication required' },
				{ status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Device API"' } }
			),
		};
	}

	// Decode base64 credentials
	const base64Credentials = authHeader.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
	const [username, password] = credentials.split(':');

	// Hardcoded credentials (in production, check against database)
	const VALID_USERNAME = process.env.DEVICE_API_USERNAME || 'admin';
	const VALID_PASSWORD = process.env.DEVICE_API_PASSWORD || 'admin123';

	if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
		return {
			authorized: false,
			error: NextResponse.json(
				{ message: 'Unauthorized: Invalid credentials' },
				{ status: 401 }
			),
		};
	}

	return { authorized: true };
}

