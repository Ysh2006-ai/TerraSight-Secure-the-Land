import { useState, useEffect } from 'react';
// import { api } from '../services/api';

export interface RiskZone {
    id: number;
    riskLevel: number; // 0 to 1
    coordinates: [number, number][]; // Array of [lat, lng]
    type: 'high-risk' | 'medium-risk' | 'low-risk';
}

export const useRiskZones = () => {
    const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRiskZones = async () => {
        try {
            // Mock data for visualization
            const mockZones: RiskZone[] = [
                { id: 101, riskLevel: 0.9, coordinates: [[-2.5, -55.5], [-2.6, -55.5], [-2.6, -55.4], [-2.5, -55.4]], type: 'high-risk' },
                { id: 102, riskLevel: 0.6, coordinates: [[-3.1, -60.1], [-3.2, -60.1], [-3.2, -60.0], [-3.1, -60.0]], type: 'medium-risk' }
            ];
            setRiskZones(mockZones);
            setError(null);
        } catch (err) {
            setError('Failed to fetch risk zones');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiskZones();
    }, []);

    return { riskZones, loading, error };
};
