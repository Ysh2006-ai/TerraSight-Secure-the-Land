import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

// Local Alert interface matching MapSection and AlertsView expectations
export interface Alert {
    id: string | number;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    lat: number;
    lng: number;
    timestamp: string;
    status: string;
    location?: string;
    confidence?: number;
    img_url?: string;
    txHash?: string;
}

/** Supabase detection row schema */
interface DetectionRow {
    id: string | number;
    violation_type?: string;
    severity?: string;
    coords?: { lat?: number; lng?: number; active_zone?: string };
    created_at: string;
    status?: string;
    img_url?: string;
    blockchain_hash?: string;
}

/** Maps a database detection row to local Alert interface */
const mapDetectionToAlert = (d: DetectionRow): Alert => ({
    id: d.id,
    type: d.violation_type || 'Unknown',
    severity: (d.severity?.toLowerCase() as 'critical' | 'high' | 'medium' | 'low') || 'medium',
    lat: d.coords?.lat || 0,
    lng: d.coords?.lng || 0,
    timestamp: d.created_at,
    status: d.status || 'new',
    location: `Zone ${d.coords?.active_zone || 'Unknown'}`,
    confidence: 99,
    img_url: d.img_url,
    txHash: d.blockchain_hash
});

export const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = async () => {
        try {
            // Fetch verified detections from Supabase
            const { data, error } = await supabase
                .from('detections')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (data) {
                const mappedAlerts: Alert[] = (data as DetectionRow[]).map(mapDetectionToAlert);
                setAlerts(mappedAlerts);
            }
            setError(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error fetching alerts:', message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Subscribe to realtime changes
        const channel = supabase
            .channel('public:detections')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detections' }, (payload: { new: DetectionRow }) => {
                const newAlert = mapDetectionToAlert(payload.new);
                setAlerts(prev => [newAlert, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { alerts, loading, error, refetch: fetchAlerts };
};
