
import { describe, it, expect } from 'vitest';
import { anchorEvidence } from './anchor';

describe('Blockchain Anchor Service', () => {

    it('should generate a valid hash and timestamp for evidence', async () => {
        const result = await anchorEvidence(28.6, 77.2, 'SENTINEL-1', 'TEST_VIOLATION', 0.95);

        expect(result).toHaveProperty('hash');
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('metadata');

        expect(typeof result.hash).toBe('string');
        expect(result.hash).toMatch(/^0x[a-fA-F0-9]{64}$/); // Standard KECCAK-256 / ETH Hash format

        const metadata = JSON.parse(result.metadata);
        expect(metadata.location.lat).toBe(28.6);
        expect(metadata.violation).toBe('TEST_VIOLATION');
    });

    it('should produce different hashes for different data (Avalanche Effect)', async () => {
        const result1 = await anchorEvidence(28.6, 77.2, 'SENTINEL-1', 'VIOLATION_A', 0.95);
        const result2 = await anchorEvidence(28.6, 77.2, 'SENTINEL-1', 'VIOLATION_B', 0.95);

        expect(result1.hash).not.toBe(result2.hash);
    });

});
