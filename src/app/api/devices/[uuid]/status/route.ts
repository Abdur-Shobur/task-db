import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDevice, updateDeviceStatus } from '@/lib/device-store';
import { checkApiAuth } from '@/lib/api-auth';

const statusSchema = z.object({
	status: z.enum(['online', 'offline']),
});

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	// Check authentication
	const auth = checkApiAuth(request);
	if (!auth.authorized) {
		return auth.error!;
	}

	const { uuid } = await params;
	const body = await request.json().catch(() => null);

	const parsed = statusSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: 'Invalid payload',
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 }
		);
	}

	const existing = getDevice(uuid);
	if (!existing) {
		return NextResponse.json({ message: 'Device not found' }, { status: 404 });
	}

	const updated = updateDeviceStatus(uuid, parsed.data.status);
	return NextResponse.json(updated);
}
