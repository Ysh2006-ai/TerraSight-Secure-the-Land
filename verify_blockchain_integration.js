import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

// Load .env manually since we are not in Vite
const envConfig = dotenv.parse(fs.readFileSync('.env'));
const RPC_URL = envConfig.VITE_RPC_URL;
const PRIVATE_KEY = envConfig.VITE_PRIVATE_KEY;

async function verify() {
    console.log("--- Blockchain Verification ---");
    console.log(`RPC: ${RPC_URL}`);

    if (!RPC_URL || !PRIVATE_KEY) {
        console.error("❌ Missing RPC or Private Key in .env");
        return;
    }

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        console.log(`Wallet Address: ${wallet.address}`);

        const balance = await provider.getBalance(wallet.address);
        // Threshold: 0.01 MATIC
        const MIN_BALANCE = 10000000000000000n;

        if (balance < MIN_BALANCE) {
            console.warn(`[WARNING] Low Fund Balance: ${ethers.formatEther(balance)} MATIC (Need ~0.01 MATIC)`);
            console.log("ℹ️  System is in REAL MODE. Attempting transaction anyway (Expect Failure)...");
        } else {
            console.log("✅ Wallet funded. Attempting anchor transaction...");
        }

        // Simulate Anchor (Real Mode always attempts this)
        const dataHash = ethers.keccak256(ethers.toUtf8Bytes("TEST_EVIDENCE_" + Date.now()));
        const tx = await wallet.sendTransaction({
            to: wallet.address,
            value: 0,
            data: dataHash
        });
        console.log(`✅ Transaction Sent! Hash: ${tx.hash}`);
        console.log(`Explorer: https://amoy.polygonscan.com/tx/${tx.hash}`);
    } catch (e) {
        console.error("❌ Verification Failed:", e);
    }
}

verify();
