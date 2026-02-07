export type HealthStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'SEARCHING' | 'LINKED' | 'ACTIVE';

export interface SystemHealth {
    database: HealthStatus;
    satellite: HealthStatus;
    blockchain: HealthStatus;
    latency: number;
    lastChecked: string;
}

export const checkSystemHealth = async (): Promise<SystemHealth> => {
    // Simulated Health Check
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                database: 'ONLINE',
                satellite: 'LINKED',
                blockchain: 'ACTIVE',
                latency: Math.floor(Math.random() * 40) + 12, // 12-52ms
                lastChecked: new Date().toISOString()
            });
        }, 500);
    });
};
