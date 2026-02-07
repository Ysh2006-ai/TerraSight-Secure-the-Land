import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Policy {
    id: string;
    name: string;
    status: 'VIOLATION' | 'WARNING' | 'COMPLIANT';
    desc: string;
    penalty: string;
}

export const usePolicies = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Policy[]>('/policies/check')
            .then(res => setPolicies(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { policies, loading };
};
