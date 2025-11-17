import { NextResponse } from 'next/server';
import { getDeviceTestResults } from '@/lib/device-store';
import { checkApiAuth } from '@/lib/api-auth';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ uuid: string }> }
) {
	// Check authentication
	const auth = checkApiAuth(request);
	if (!auth.authorized) {
		return auth.error!;
	}

	const { uuid } = await params;
	const results = getDeviceTestResults(uuid);

	if (!results) {
		return NextResponse.json({ message: 'Device not found' }, { status: 404 });
	}

	return NextResponse.json(results);
}
