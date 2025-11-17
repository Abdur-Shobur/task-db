export type DeviceStatus = 'online' | 'offline';

export interface Device {
	uuid: string;
	deviceId: string;
	deviceName: string;
	deviceType: string;
	status: DeviceStatus;
	lastUpdated: string;
}

export interface RegisterDevicePayload {
	deviceId: string;
	deviceName: string;
	deviceType: string;
	status: DeviceStatus;
}

export interface DeviceTestResult {
	id: string;
	timestamp: string;
	testType: string;
	value: number;
	unit: string;
	status: 'normal' | 'abnormal';
}

