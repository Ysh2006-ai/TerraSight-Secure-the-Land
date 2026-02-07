
import { describe, it, expect } from 'vitest';
import { analyzeTerrainVulnerability, analyzeDeforestation, detectIllegalMining } from './fusion';
import type { FusedScene, SatelliteSource } from './fusion';

// Mock Helper
const createMockScene = (sarBackscatter: number, ndvi: number): FusedScene => {
    const s1: SatelliteSource = {
        id: 'mock-s1',
        provider: 'ESA_SENTINEL',
        sensor: 'SAR',
        resolution_m: 10,
        timestamp: new Date().toISOString(),
        url: 'mock-url',
        metadata: { backscatter_db: sarBackscatter, polarization: 'VV+VH', orbit: 'Descending', source_type: 'GRD' }
    };
    const s2: SatelliteSource = {
        id: 'mock-s2',
        provider: 'ESA_SENTINEL',
        sensor: 'OPTICAL',
        resolution_m: 10,
        timestamp: new Date().toISOString(),
        url: 'mock-url',
        metadata: { ndvi: ndvi, cloud_cover: 0.1, source_type: 'L2A' }
    };

    return {
        id: 'mock-scene',
        centroid: [28.6, 77.2],
        timestamp: new Date().toISOString(),
        layers: {
            sentinel1_sar: s1,
            sentinel2_optical: s2
        },
        co_registration_error: 0.5
    };
};

describe('Fusion Engine', () => {

    describe('analyzeTerrainVulnerability', () => {
        it('should detect metal/concrete for high backscatter (> -6 dB)', () => {
            const scene = createMockScene(-5, 0.1);
            const result = analyzeTerrainVulnerability(scene);
            expect(result.isManMade).toBe(true);
            expect(result.material).toContain('METAL_CONCRETE');
        });

        it('should detect dense urban for moderate backscatter (> -10 dB)', () => {
            const scene = createMockScene(-8, 0.1);
            const result = analyzeTerrainVulnerability(scene);
            expect(result.isManMade).toBe(true);
            expect(result.material).toBe('DENSE_URBAN');
        });

        it('should detect vegetation/soil for low backscatter', () => {
            const scene = createMockScene(-15, 0.6);
            const result = analyzeTerrainVulnerability(scene);
            expect(result.isManMade).toBe(false);
            expect(result.material).toBe('VEGETATION_OR_SOIL');
        });
    });

    describe('analyzeDeforestation', () => {
        it('should detect CRITICAL land clearing when vegetation loss is >= 50%', async () => {
            const scene = createMockScene(-15, 0.2); // Current NDVI 0.2
            // Historical NDVI 0.8 => Drop 0.6 => 75% loss
            const result = await analyzeDeforestation(scene, 0.8);
            expect(result.isDeforestation).toBe(true);
            expect(result.severity).toBe('CRITICAL');
            expect(result.detectionType).toBe('LAND_CLEARING');
        });

        it('should detect WARNING deforestation when vegetation loss is >= 25%', async () => {
            const scene = createMockScene(-15, 0.45); // Current NDVI 0.45
            // Historical NDVI 0.65 => Drop 0.2 => ~30% loss
            const result = await analyzeDeforestation(scene, 0.65);
            expect(result.isDeforestation).toBe(true);
            expect(result.severity).toBe('WARNING');
        });

        it('should NOT detect deforestation for small changes', async () => {
            const scene = createMockScene(-15, 0.6); // Current NDVI 0.6
            // Historical NDVI 0.65 => Drop 0.05 => ~7.6% loss
            const result = await analyzeDeforestation(scene, 0.65);
            expect(result.isDeforestation).toBe(false);
        });
    });

    describe('detectIllegalMining', () => {
        it('should detect OPEN_PIT mining (Very High Backscatter + Very Low NDVI)', async () => {
            const scene = createMockScene(-4, 0.05); // -4dB (High), 0.05 NDVI (Barren)
            const result = await detectIllegalMining(scene);
            expect(result.isMining).toBe(true);
            expect(result.miningType).toBe('OPEN_PIT');
            expect(result.severity).toBe('CRITICAL');
        });

        it('should detect WATER_FILLED_PIT (Very Low Backscatter + Low NDVI)', async () => {
            const scene = createMockScene(-20, 0.15); // -20dB (Water), 0.15 NDVI (Low Veg)
            const result = await detectIllegalMining(scene);
            expect(result.isMining).toBe(true);
            expect(result.miningType).toBe('SAND_MINING'); // Logic: Water Pit + Low Veg
        });

        it('should NOT detect mining on healthy vegetation', async () => {
            const scene = createMockScene(-12, 0.6); // Normal backscatter, high NDVI
            const result = await detectIllegalMining(scene);
            expect(result.isMining).toBe(false);
        });
    });

});
