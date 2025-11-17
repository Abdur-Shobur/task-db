import { NextRequest, NextResponse } from 'next/server';
import { listDevices } from '@/lib/device-store';
import { checkApiAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
	// Check authentication
	const auth = checkApiAuth(request);
	if (!auth.authorized) {
		return auth.error!;
	}

	const statusParam = request.nextUrl.searchParams.get('status');
	const status =
		statusParam === 'online' || statusParam === 'offline'
			? statusParam
			: undefined;

	const devices = listDevices(status);
	return NextResponse.json(devices);
}

