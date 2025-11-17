import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerDevice } from '@/lib/device-store';
import { checkApiAuth } from '@/lib/api-auth';

const payloadSchema = z.object({
	deviceId: z.string().min(2).max(100),
	deviceName: z.string().min(2).max(120),
	deviceType: z.string().min(2).max(80),
	status: z.enum(['online', 'offline']),
});

export async function POST(request: Request) {
	// Check authentication
	const auth = checkApiAuth(request);
	if (!auth.authorized) {
		return auth.error!;
	}

	const body = await request.json().catch(() => null);

	const result = payloadSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json(
			{
				message: 'Invalid payload',
				errors: result.error.flatten().fieldErrors,
			},
			{ status: 400 }
		);
	}

	const device = registerDevice(result.data);

	return NextResponse.json(device, { status: 201 });
}
