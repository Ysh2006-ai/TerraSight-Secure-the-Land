import { useState, useEffect } from 'react';
// import { api } from '../services/api';

export interface SatelliteDataPoint {
    date: string;
    ndvi: number;
    sar: number;
    cloudCover: number;
}

export const useSatelliteData = () => {
    const [data, setData] = useState<SatelliteDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            // Mock data for chart
            const mockData: SatelliteDataPoint[] = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                return {
                    date: date.toISOString().split('T')[0],
                    ndvi: 0.6 + Math.sin(i * 0.2) * 0.1,
                    sar: -12 + Math.cos(i * 0.3) * 2,
                    cloudCover: Math.random() * 100
                };
            });
            setData(mockData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch satellite data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error };
};
