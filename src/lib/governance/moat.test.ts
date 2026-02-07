
import { describe, it, expect } from 'vitest';
import { checkStateCompliance, checkGeoCompliance } from './moat';

describe('Governance Engine (Moat)', () => {

    describe('checkStateCompliance', () => {
        it('should return Delhi specific laws for DELHI state code', () => {
            const result = checkStateCompliance(28.6, 77.2, 'DELHI');
            expect(result.law).toContain('Delhi Land Reforms Act');
            expect(result.isViolation).toBe(true);
        });

        it('should identify critical Yamuna Floodplain violation', () => {
            // Yamuna box: lat > 28.5 & < 28.7, lng > 77.2 & < 77.35
            const result = checkStateCompliance(28.6, 77.25, 'DELHI');
            expect(result.zone).toContain('Yamuna Floodplain');
            expect(result.severity).toBe('CRITICAL');
        });

        it('should return UP specific laws for UP state code', () => {
            const result = checkStateCompliance(28.5, 77.5, 'UP');
            expect(result.law).toContain('UP Zamindari Abolition');
            expect(result.isViolation).toBe(true);
        });

        it('should return default environment protection act for unknown states', () => {
            const result = checkStateCompliance(20.0, 78.0, 'UNKNOWN_STATE');
            expect(result.law).toContain('Environment (Protection) Act');
            expect(result.severity).toBe('WARNING');
        });
    });

    describe('checkGeoCompliance', () => {
        it('should detect violation inside Yamuna Floodplains (ZONE_A_YAMUNA)', () => {
            // Point inside: Longitude 77.30, Latitude 28.63
            const result = checkGeoCompliance(28.63, 77.30);
            expect(result.isViolation).toBe(true);
            expect(result.zone).toContain('Yamuna Floodplains');
            expect(result.severity).toBe('CRITICAL');
        });

        it('should detect violation in Industrial Green Belt (ZONE_C_UP_GREENBELT)', () => {
            // Box: [77.38, 28.45] to [77.50, 28.55]
            // Midpoint: 77.44, 28.50
            const result = checkGeoCompliance(28.50, 77.44);
            expect(result.isViolation).toBe(true);
            expect(result.zone).toContain('Industrial Green Belt');
        });

        it('should return no violation for coordinates far outside any zone', () => {
            const result = checkGeoCompliance(10.0, 10.0);
            expect(result.isViolation).toBe(false);
            expect(result.law).toBe('N/A');
        });
    });
});
