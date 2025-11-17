import { randomUUID } from 'node:crypto';
import {
	Device,
	DeviceStatus,
	DeviceTestResult,
	RegisterDevicePayload,
} from '@/types/devices';

const devices: Device[] = [];

const mockDeviceSeeds: Omit<Device, 'lastUpdated'>[] = [
	{
		uuid: randomUUID(),
		deviceId: 'DX-1000',
		deviceName: 'DeltaX Analyzer',
		deviceType: 'Chemistry',
		status: 'online',
	},
	{
		uuid: randomUUID(),
		deviceId: 'MX-22',
		deviceName: 'MicroScan 22',
		deviceType: 'Microscope',
		status: 'offline',
	},
	{
		uuid: randomUUID(),
		deviceId: 'IM-8',
		deviceName: 'InstaMed 8',
		deviceType: 'Immunoassay',
		status: 'online',
	},
];

const testCatalog = [
	{ testType: 'CBC', unit: 'g/dL', min: 11.5, max: 15.5 },
	{ testType: 'Glucose', unit: 'mg/dL', min: 70, max: 140 },
	{ testType: 'Creatinine', unit: 'mg/dL', min: 0.6, max: 1.3 },
	{ testType: 'Calcium', unit: 'mg/dL', min: 8.5, max: 10.5 },
	{ testType: 'Potassium', unit: 'mmol/L', min: 3.5, max: 5.2 },
	{ testType: 'Sodium', unit: 'mmol/L', min: 135, max: 145 },
	{ testType: 'CRP', unit: 'mg/L', min: 0, max: 5 },
];

function initSeeds() {
	if (devices.length) return;

	const now = new Date().toISOString();
	mockDeviceSeeds.forEach((seed, index) => {
		devices.push({
			...seed,
			lastUpdated: new Date(
				Date.now() - (index + 1) * 60 * 60 * 1000
			).toISOString(),
		});
	});
}

initSeeds();

export function listDevices(status?: DeviceStatus): Device[] {
	if (!status) return [...devices];
	return devices.filter((device) => device.status === status);
}

export function registerDevice(payload: RegisterDevicePayload): Device {
	const now = new Date().toISOString();
	const device: Device = {
		uuid: randomUUID(),
		lastUpdated: now,
		...payload,
	};

	devices.unshift(device);
	return device;
}

export function updateDeviceStatus(
	uuid: string,
	status: DeviceStatus
): Device | null {
	const idx = devices.findIndex((device) => device.uuid === uuid);
	if (idx === -1) return null;

	devices[idx] = {
		...devices[idx],
		status,
		lastUpdated: new Date().toISOString(),
	};

	return devices[idx];
}

export function updateDevice(
	uuid: string,
	updates: Partial<Pick<Device, 'deviceName' | 'deviceType'>>
): Device | null {
	const idx = devices.findIndex((device) => device.uuid === uuid);
	if (idx === -1) return null;

	devices[idx] = {
		...devices[idx],
		...updates,
		lastUpdated: new Date().toISOString(),
	};

	return devices[idx];
}

export function getDevice(uuid: string): Device | null {
	return devices.find((device) => device.uuid === uuid) ?? null;
}

export function deleteDevice(uuid: string): boolean {
	const idx = devices.findIndex((device) => device.uuid === uuid);
	if (idx === -1) return false;

	devices.splice(idx, 1);
	return true;
}

export function getDeviceTestResults(uuid: string): DeviceTestResult[] | null {
	const deviceExists = getDevice(uuid);
	if (!deviceExists) return null;

	const resultsCount = Math.floor(Math.random() * 6) + 5; // 5-10 results

	const results: DeviceTestResult[] = Array.from({ length: resultsCount }).map(
		(_, idx) => {
			const catalogEntry =
				testCatalog[Math.floor(Math.random() * testCatalog.length)];
			const value =
				catalogEntry.min +
				Math.random() * (catalogEntry.max - catalogEntry.min) * 1.4;

			const status: 'normal' | 'abnormal' =
				value >= catalogEntry.min && value <= catalogEntry.max
					? 'normal'
					: 'abnormal';

			return {
				id: `${uuid}-${idx}-${Date.now()}`,
				testType: catalogEntry.testType,
				unit: catalogEntry.unit,
				value: Math.round(value * 10) / 10,
				timestamp: new Date(Date.now() - idx * 15 * 60 * 1000).toISOString(),
				status,
			};
		}
	);

	return results;
}
