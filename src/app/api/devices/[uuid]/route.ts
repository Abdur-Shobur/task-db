import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDevice, updateDevice, deleteDevice } from '@/lib/device-store';
import { checkApiAuth } from '@/lib/api-auth';

const updateSchema = z.object({
	deviceName: z.string().min(2).max(120).optional(),
	deviceType: z.string().min(2).max(80).optional(),
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

	const parsed = updateSchema.safeParse(body);

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

	const updated = updateDevice(uuid, parsed.data);
	if (!updated) {
		return NextResponse.json(
			{ message: 'Failed to update device' },
			{ status: 500 }
		);
	}

	return NextResponse.json(updated);
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	// Check authentication
	const auth = checkApiAuth(request);
	if (!auth.authorized) {
		return auth.error!;
	}

	const { uuid } = await params;
	const deleted = deleteDevice(uuid);

	if (!deleted) {
		return NextResponse.json({ message: 'Device not found' }, { status: 404 });
	}

	return NextResponse.json({ message: 'Device deleted successfully' });
}
