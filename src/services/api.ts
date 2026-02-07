import axios, { type AxiosInstance } from 'axios';

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'; // Default to LIVE (false) unless VITE_USE_MOCK=true

// Create Axios instance
export const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (401, etc.)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401: Unauthorized (Token Expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // TODO: Implement refresh token flow here if needed
            // For now, just logout
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// --- MOCK API LAYER ---
// This is a simple mock implementation to simulate backend responses
// It intercepts requests and returns fake data if USE_MOCK is true

if (USE_MOCK) {
    const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const mockData = {
        '/auth/login': {
            token: 'mock-jwt-token-12345',
            user: {
                id: '1',
                name: 'Commander Shepard',
                role: 'admin',
                avatar: 'https://ui-avatars.com/api/?name=Commander+Shepard&background=0D8ABC&color=fff'
            }
        },
        '/alerts': Array.from({ length: 35 }, (_, i) => {
            const types = ['deforestation', 'mining', 'fire', 'encroachment', 'poaching'];
            const severities = ['critical', 'high', 'medium', 'low'];
            // Distribute across continents roughly
            const regions = [
                { lat: -2.0, lng: -55.0, range: 10 }, // Amazon
                { lat: 0.0, lng: 20.0, range: 15 },   // Africa
                { lat: -5.0, lng: 110.0, range: 15 }, // SE Asia
                { lat: 20.0, lng: 78.0, range: 10 },  // India
                { lat: 55.0, lng: -120.0, range: 15 } // Canada/North America
            ];
            const region = regions[Math.floor(Math.random() * regions.length)];

            return {
                id: i + 1,
                type: types[Math.floor(Math.random() * types.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                lat: region.lat + (Math.random() * region.range * 2 - region.range),
                lng: region.lng + (Math.random() * region.range * 2 - region.range),
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
                status: ['new', 'investigating', 'resolved'][Math.floor(Math.random() * 3)],
                confidence: Math.floor(60 + Math.random() * 40)
            };
        }),
        '/stats': {
            alertsToday: 12,
            activeRisks: 5,
            patrolsActive: 8,
            protectedArea: '1.2M ha'
        },
        '/risk-zones': [
            { id: 101, riskLevel: 0.9, coordinates: [[-2.5, -55.5], [-2.6, -55.5], [-2.6, -55.4], [-2.5, -55.4]], type: 'high-risk' },
            { id: 102, riskLevel: 0.6, coordinates: [[-3.1, -60.1], [-3.2, -60.1], [-3.2, -60.0], [-3.1, -60.0]], type: 'medium-risk' }
        ],
        '/satellite/time-series': Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
                date: date.toISOString().split('T')[0],
                ndvi: 0.6 + Math.sin(i * 0.2) * 0.1 + (Math.random() * 0.05), // Sentinel-2 Vegetation
                sar: -12 + Math.cos(i * 0.3) * 2 + (Math.random() * 1),      // Sentinel-1 Backscatter (dB)
                cloudCover: Math.random() * 100
            };
        }),
        '/explain/analysis': {
            id: '8492',
            model: 'Forest_Guard_v4.2',
            verifiable: true,
            features: [
                { name: 'Spectral Signature', score: 98, desc: 'NIR band deviation suggests rapid vegetation loss.' },
                { name: 'Textural Analysis', score: 94, desc: 'Pattern matching confirms heavy machinery tracks.' },
                { name: 'Temporal Diff', score: 99, desc: 'Change validation against monthly baseline.' },
                { name: 'Thermal Anomaly', score: 87, desc: 'Heat signature indicative of slash-and-burn.' }
            ]
        },
        '/policies/check': [
            {
                id: 'EUDR-2023',
                name: 'EU Deforestation Regulation',
                status: 'VIOLATION',
                desc: 'Detected forest degradation post-2020 cutoff date.',
                penalty: 'Market Access Risk'
            },
            {
                id: 'FCA-1980',
                name: 'Forest Conservation Act',
                status: 'WARNING',
                desc: 'Potential encroachment in protected buffer zone.',
                penalty: 'Legal Action likely'
            },
            {
                id: 'COP28-PF',
                name: 'COP28 Pledge Framework',
                status: 'COMPLIANT',
                desc: 'Within agreed net-zero emissions targets per zone.',
                penalty: 'None'
            }
        ]
    };

    // Override the adapter to serve mocks
    // const originalAdapter = api.defaults.adapter;
    api.defaults.adapter = async (config) => {
        // Log the request for debugging
        console.log(`[API MOCK] ${config.method?.toUpperCase()} ${config.url}`, config.data ? JSON.parse(config.data as string) : '');

        await mockDelay(600); // Simulate network latency

        // Simple routing for mocks
        const url = config.url || '';

        // Auth Mock
        if (url === '/auth/login' && config.method === 'post') {
            const body = JSON.parse(config.data as string);

            if (body.username === 'admin' && body.password === 'admin') {
                return {
                    data: mockData['/auth/login'],
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
            } else {
                return Promise.reject({
                    response: {
                        status: 401,
                        data: { detail: "Invalid credentials" }
                    }
                });
            }
        }

        // GET Mocks
        if (config.method === 'get') {
            if (mockData[url as keyof typeof mockData]) {
                return {
                    data: mockData[url as keyof typeof mockData],
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
            }
        }

        // Pass through to real adapter if no mock found (or 404)
        // return originalAdapter!(config); // Uncomment to mix mock and real
        return Promise.reject({ response: { status: 404, data: { detail: "Mock endpoint not found" } } });
    };
}
