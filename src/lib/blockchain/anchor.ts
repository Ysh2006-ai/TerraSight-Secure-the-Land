
import { ethers } from 'ethers';

/**
 * ANCHOR SERVICE (Blockchain Integrity)
 * Generates an immutable cryptographic hash of the evidence.
 * Simulates "Anchoring" by returning a hash that would be put on-chain.
 */

export interface AnchorRecord {
    hash: string;
    timestamp: number;
    metadata: string; // JSON string of the evidence
}

/**
 * Generates a Keccak-256 Hash of the critical evidence data.
 * This represents the "Fingerprint" of the crime scene that cannot be altered.
 * 
 * @param lat Latitude
 * @param lng Longitude
 * @param satelliteSource e.g. "SENTINEL-1"
 * @param violationType e.g. "FOREST_ACT_SECTION_2"
 * @param classificationConfidence e.g. 0.98
 */
export const anchorEvidence = async (
    lat: number,
    lng: number,
    satelliteSource: string,
    violationType: string,
    classificationConfidence: number
): Promise<AnchorRecord> => {

    // 1. Construct the Evidence Payload
    const evidence = {
        location: { lat, lng },
        source: satelliteSource,
        violation: violationType,
        confidence: classificationConfidence,
        timestamp: Date.now(),
        // Add a "salt" or random nonce if needed, but timestamp acts as uniqueifier usually
        nonce: Math.random().toString(36).substring(7)
    };

    const metadata = JSON.stringify(evidence);

    // 2. Cryptographic Hashing (The "Seal")
    // Using Ethers.js keccak256
    // We confirm the data integrity
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(metadata));
    console.log(`[Blockchain] Generated Data Hash: ${dataHash}`);

    let transactionHash = dataHash; // Fallback to local hash if blockchain fails

    try {
        // 3. Blockchain Anchoring (Polygon Amoy)
        const rpcUrl = import.meta.env.VITE_RPC_URL;
        const privateKey = import.meta.env.VITE_PRIVATE_KEY;

        if (rpcUrl && privateKey) {
            console.log("[Blockchain] Initiating On-Chain Anchoring...");
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(privateKey, provider);

            // REAL MODE: Attempt transaction directly
            // Note: This will fail if balance is insufficient, which is expected behavior for "Real Mode"

            const tx = await wallet.sendTransaction({
                to: wallet.address, // Send to self
                value: 0,
                data: dataHash // Embed hash in transaction data
            });

            console.log(`[Blockchain] Transaction Sent: ${tx.hash}`);
            transactionHash = tx.hash;

            // Optional: Wait for confirmation (can be skipped for speed if UI handles pending state)
            // await tx.wait(); 
        } else {
            console.warn("[Blockchain] Missing VITE_RPC_URL or VITE_PRIVATE_KEY. Skipping on-chain anchor.");
        }
    } catch (e) {
        console.error("[Blockchain] Anchoring Failed:", e);
        // We continue with the local hash so the app doesn't crash, but log the error
    }

    // 4. Return the Record (To be stored in Supabase 'detections' table)
    // We store the Transaction Hash as the 'hash' if successful, or the data hash if not.
    // Ideally, we'd store both, but fitting into existing schema for now.
    return {
        hash: transactionHash,
        timestamp: evidence.timestamp,
        metadata
    };
};
