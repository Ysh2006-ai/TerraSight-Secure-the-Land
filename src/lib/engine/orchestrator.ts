
import { supabase } from '../supabase/client';
import { checkGeoCompliance, checkStateCompliance } from '../governance/moat';
import { anchorEvidence } from '../blockchain/anchor';
import { detectChange } from '../ai/sentinelHub'; // The new Real Sentinel Engine
import type { FusedScene } from './fusion';
import { analyzeDeforestation, detectIllegalMining } from './fusion';

interface OrchestrationResult {
    id?: string; // Added DB ID
    status: 'VERIFIED' | 'IGNORED' | 'PENDING';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verdict?: any;
    confidence: number;
    message: string;
    txHash?: string;
    encroachment_area?: number;
    legal_notice?: string | null;
}

type Logger = (msg: string) => void;

/**
 * The Brain: Core Orchestration Engine (Production Mode)
 * Coordinates: Sentinel (Change) -> Legal (Zone) -> Blockchain (Anchor) -> Database (Realtime)
 */
export const processFusedScene = async (
    scene: FusedScene,
    log?: Logger
): Promise<OrchestrationResult> => {
    const [lat, lng] = scene.centroid;
    log?.(`[Orchestrator] Processing Location: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    console.log(`[Orchestrator] Processing Location: ${lat}, ${lng}`);

    // 1. RUN ALL LOGIC GATES IN PARALLEL (Fusion Engine)
    log?.(`[Fusion] Analyzing spectral & structural signatures...`);

    const [changeResult, deforestationResult, miningResult] = await Promise.all([
        detectChange(lat, lng),
        analyzeDeforestation(scene),
        detectIllegalMining(scene)
    ]);

    // ----------------------------------------------------
    // PRIORITY 1: DEFORESTATION (Highest Impact)
    // ----------------------------------------------------
    if (deforestationResult.isDeforestation) {
        log?.(`[ALERT] DEFORESTATION DETECTED! Type: ${deforestationResult.detectionType}`);
        log?.(`[ALERT] Vegetation Loss: ${deforestationResult.vegetationLossPercent.toFixed(1)}% | Severity: ${deforestationResult.severity}`);
        console.log(`[Orchestrator] DEFORESTATION DETECTED: ${deforestationResult.detectionType}`);

        const deforestationAnchor = await anchorEvidence(
            lat, lng, "SENTINEL-2 NDVI",
            `DEFORESTATION - ${deforestationResult.detectionType}`,
            deforestationResult.confidence
        );

        const { data: deforestData } = await supabase.from('detections').insert({
            coords: { lat, lng, active_zone: 'FOREST_ZONE' },
            location: `POINT(${lng} ${lat})`,
            violation_type: `DEFORESTATION_${deforestationResult.detectionType}`,
            severity: deforestationResult.severity,
            status: 'VERIFIED',
            blockchain_hash: deforestationAnchor.hash,
            img_url: deforestationResult.capturedImageUrl,
        }).select().single();

        return {
            id: deforestData?.id,
            status: 'VERIFIED',
            verdict: {
                law: 'Forest Conservation Act',
                section: 'Section 2',
                penalty: 'Restoration Order',
                severity: deforestationResult.severity,
                zone: 'Protected Forest',
                isViolation: true
            },
            confidence: deforestationResult.confidence,
            message: `Deforestation Detected: ${deforestationResult.vegetationLossPercent.toFixed(1)}% loss`,
            txHash: deforestationAnchor.hash
        };
    }

    // ----------------------------------------------------
    // PRIORITY 2: ILLEGAL MINING (High Impact)
    // ----------------------------------------------------
    if (miningResult.isMining) {
        log?.(`[ALERT] ILLEGAL MINING DETECTED! Type: ${miningResult.miningType}`);
        console.log(`[Orchestrator] MINING DETECTED: ${miningResult.miningType}`);

        const miningAnchor = await anchorEvidence(
            lat, lng, "SENTINEL-1 SAR",
            `ILLEGAL_MINING - ${miningResult.miningType}`,
            miningResult.confidence
        );

        const { data: miningData } = await supabase.from('detections').insert({
            coords: { lat, lng, active_zone: 'MINING_ZONE' },
            location: `POINT(${lng} ${lat})`,
            violation_type: `ILLEGAL_MINING_${miningResult.miningType}`,
            severity: miningResult.severity,
            status: 'VERIFIED',
            blockchain_hash: miningAnchor.hash,
            img_url: miningResult.capturedImageUrl,
        }).select().single();

        return {
            id: miningData?.id,
            status: 'VERIFIED',
            verdict: {
                law: 'Mines and Minerals Act',
                section: 'Section 4',
                penalty: 'Seizure + Prosecution',
                severity: miningResult.severity,
                zone: 'Mining Zone',
                isViolation: true
            },
            confidence: miningResult.confidence,
            message: `Illegal Mining Detected: ${miningResult.miningType}`,
            txHash: miningAnchor.hash
        };
    }

    // ----------------------------------------------------
    // PRIORITY 3: GENERAL CHANGE (Encroachment)
    // ----------------------------------------------------
    if (changeResult.isViolation) {
        log?.(`[Orchestrator] VARIANCE DETECTED! Delta: ${(changeResult.deviation * 100).toFixed(1)}%`);
        console.log(`[Orchestrator] CHANGE DETECTED. Checking Laws...`);

        // Check Legal Compliance
        let legalVerdict;
        if (scene.stateCode) {
            legalVerdict = checkStateCompliance(lat, lng, scene.stateCode);
        } else {
            legalVerdict = checkGeoCompliance(lat, lng);
        }

        if (legalVerdict.isViolation) {
            const anchor = await anchorEvidence(lat, lng, "SENTINEL-1/2 FUSION", `${legalVerdict.law}`, 0.99);

            const { data: insertedData } = await supabase.from('detections').insert({
                coords: { lat, lng, active_zone: legalVerdict.zone },
                location: `POINT(${lng} ${lat})`,
                violation_type: legalVerdict.law,
                severity: legalVerdict.severity,
                status: 'VERIFIED',
                blockchain_hash: anchor.hash,
                img_url: scene.layers.sentinel2_optical.url,
            }).select().single();

            return {
                id: insertedData?.id,
                status: 'VERIFIED',
                verdict: legalVerdict,
                confidence: 0.99,
                message: 'Encroachment Detected',
                txHash: anchor.hash
            };
        }
    }

    // ----------------------------------------------------
    // NO VIOLATION
    // ----------------------------------------------------
    log?.(`[Swin-TR] Analysis Complete. No Violations.`);
    console.log(`[Orchestrator] No significant structure deviation detected.`);
    return {
        status: 'IGNORED',
        confidence: 0,
        message: 'No Change Detected'
    };
};
