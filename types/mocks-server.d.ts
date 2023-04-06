import * as http from 'http';

export enum LogLevel {
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	OFF = 'off'
}
export interface MocksServerOptions<T> {
	port: number;
	mocksPath: string;
	mockData: T;
	logLevel?: LogLevel;
}

export function startMockingServer<T>(options: MocksServerOptions<T>): Promise<http.Server>;
export function closeMockingServer(server: http.Server): Promise<void>;
