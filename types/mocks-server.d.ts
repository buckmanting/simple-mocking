import * as http from 'http';

export interface MocksServerOptions<T> {
	port: number;
	mocksPath: string;
	mockData: T;
}

export function startMockingServer<T>(options: MocksServerOptions<T>): Promise<http.Server>;
export function stopMockingServer(server: http.Server): Promise<void>;
