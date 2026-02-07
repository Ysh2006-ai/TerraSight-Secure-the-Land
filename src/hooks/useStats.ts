import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export interface DashboardStats {
    alertsToday: number;
    activeRisks: number;
    patrolsActive: number;
    protectedArea: string;
}

export const useStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get count of alerts created today
            const { count: alertsCount, error: alertsError } = await supabase
                .from('detections')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            if (alertsError) throw alertsError;

            // Get active risks (all not resolved)
            const { count: activeCount, error: activeError } = await supabase
                .from('detections')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'resolved');

            if (activeError) throw activeError;

            setStats({
                alertsToday: alertsCount || 0,
                activeRisks: activeCount || 0,
                patrolsActive: 8, // Mock: No patrols table yet
                protectedArea: '1.2M ha' // Static
            });
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching stats:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Subscribe to changes to update stats live
        const channel = supabase
            .channel('public:stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'detections' }, () => {
                fetchStats();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return { stats, loading, error };
};
