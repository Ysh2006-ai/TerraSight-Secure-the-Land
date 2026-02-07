import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface ExplanationFeature {
    name: string;
    score: number;
    desc: string;
}

export interface Explanation {
    id: string;
    model: string;
    verifiable: boolean;
    features: ExplanationFeature[];
}

export const useExplanation = () => {
    const [explanation, setExplanation] = useState<Explanation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Explanation>('/explain/analysis')
            .then(res => setExplanation(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { explanation, loading };
};
