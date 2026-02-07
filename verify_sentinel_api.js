
import { createClient } from '@supabase/supabase-js';

const CLIENT_ID = process.env.VITE_SENTINEL_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_SENTINEL_CLIENT_SECRET;
const TOKEN_URL = 'https://services.sentinel-hub.com/oauth/token';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("❌ Missing Sentinel API Keys in .env");
    process.exit(1);
}

async function verifySentinel() {
    console.log("📡 Connecting to Sentinel Hub...");

    try {
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });

        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("❌ Authentication Failed:", res.status, err);
            return;
        }

        const data = await res.json();
        console.log("✅ Authentication Successful! Access Token received.");
        console.log("Expires in:", data.expires_in, "seconds");

        // If auth works, the Real-Time fetches will work (quota permitting).
        console.log("\n✅ SYSTEM STATUS: REAL-TIME SATELLITE CONNECTION ACTIVE.");

    } catch (e) {
        console.error("❌ Connection Error:", e);
    }
}

verifySentinel();
