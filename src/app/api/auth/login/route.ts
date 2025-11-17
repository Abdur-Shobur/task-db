import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ILoginResponse } from '@/store/features/auth';

// Hardcoded credentials for development
// In production, these should be stored securely and hashed
const HARDCODED_USERS = [
	{
		email: 'admin@example.com',
		password: 'admin123',
		user: {
			id: 1,
			name: 'Admin User',
			email: 'admin@example.com',
		},
	},
	{
		email: 'user@example.com',
		password: 'user123',
		user: {
			id: 2,
			name: 'Test User',
			email: 'user@example.com',
		},
	},
];

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => null);

		if (!body) {
			return NextResponse.json(
				{ message: 'Invalid request body' },
				{ status: 400 }
			);
		}

		const parsed = loginSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: 'Validation failed',
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { email, password } = parsed.data;

		// Find user with matching credentials
		const user = HARDCODED_USERS.find(
			(u) => u.email === email && u.password === password
		);

		if (!user) {
			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Generate mock tokens (in production, use JWT or similar)
		const accessToken = `mock-access-token-${user.user.id}-${Date.now()}`;
		const refreshToken = `mock-refresh-token-${user.user.id}-${Date.now()}`;

		const response: ILoginResponse = {
			accessToken,
			refreshToken,
			user: user.user,
		};

		return NextResponse.json(
			{
				status: true,
				message: 'Login successful',
				data: response,
				statusCode: 200,
				meta: null,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

