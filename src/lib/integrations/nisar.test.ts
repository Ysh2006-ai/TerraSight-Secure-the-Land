import { describe, it, expect } from 'vitest';

describe('NISAR API Integration', () => {
    it('should have the NISAR token configured in environment', () => {
        const token = import.meta.env.VITE_NISAR_TOKEN;
        expect(token).toBeDefined();
        expect(token).not.toBe('');
        // Check for JWT structure (3 parts separated by dots) or general length
        expect(token.split('.').length).toBeGreaterThan(1);
    });

    it('should parse NISAR deformation data structure correctly', () => {
        // Mock API Response from NISAR/Earthdata
        const mockResponse = {
            "d": {
                "results": [
                    {
                        "__metadata": { "uri": "https://nisar.jpl.nasa.gov/api/v1/Deformation('D123')" },
                        "DeformationID": "D123",
                        "Latitude": 28.6139,
                        "Longitude": 77.2090,
                        "Displacement_mm": -15.4,
                        "Confidence": 0.98,
                        "AcquisitionDate": "/Date(1770460491000)/"
                    }
                ]
            }
        };

        // Simulated Parsing Logic
        const parseNisarData = (data: any) => {
            return data.d.results.map((item: any) => ({
                id: item.DeformationID,
                lat: item.Latitude,
                lng: item.Longitude,
                subsidence: item.Displacement_mm,
                confidence: item.Confidence,
                date: new Date(parseInt(item.AcquisitionDate.slice(6, -2)))
            }));
        };

        const result = parseNisarData(mockResponse);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("D123");
        expect(result[0].subsidence).toBe(-15.4); // Negative indicates subsidence
        expect(result[0].lat).toBe(28.6139);
        expect(result[0].date).toBeInstanceOf(Date);
    });
});
