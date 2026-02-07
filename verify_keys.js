/**
 * API Key Verification Script
 * Tests: Supabase, Sentinel Hub, MapTiler
 */
import 'dotenv/config';

const KEYS = {
    MAPTILER: process.env.VITE_MAPTILER_KEY,
    SENTINEL_ID: process.env.VITE_SENTINEL_CLIENT_ID,
    SENTINEL_SECRET: process.env.VITE_SENTINEL_CLIENT_SECRET,
    SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_KEY: process.env.VITE_SUPABASE_ANON_KEY
};

console.log("=".repeat(50));
console.log("🔑 API KEY VERIFICATION");
console.log("=".repeat(50));

// 1. Check if keys exist
console.log("\n📋 KEY PRESENCE CHECK:");
Object.entries(KEYS).forEach(([name, value]) => {
    const status = value && value.length > 5 ? "✅" : "❌";
    const preview = value ? value.slice(0, 10) + "..." : "MISSING";
    console.log(`  ${status} ${name}: ${preview}`);
});

// 2. Test Supabase
async function testSupabase() {
    console.log("\n📊 SUPABASE TEST:");
    try {
        const res = await fetch(`${KEYS.SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': KEYS.SUPABASE_KEY,
                'Authorization': `Bearer ${KEYS.SUPABASE_KEY}`
            }
        });
        if (res.ok || res.status === 200) {
            console.log("  ✅ Supabase: Connected successfully");
            return true;
        } else {
            console.log(`  ⚠️ Supabase: Response ${res.status}`);
            return res.status < 500;
        }
    } catch (e) {
        console.log(`  ❌ Supabase: ${e.message}`);
        return false;
    }
}

// 3. Test Sentinel Hub
async function testSentinel() {
    console.log("\n🛰️ SENTINEL HUB TEST:");
    try {
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: KEYS.SENTINEL_ID,
            client_secret: KEYS.SENTINEL_SECRET
        });

        const res = await fetch('https://services.sentinel-hub.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`  ✅ Sentinel Hub: Authenticated (expires in ${data.expires_in}s)`);
            return true;
        } else {
            const err = await res.text();
            console.log(`  ❌ Sentinel Hub: ${res.status} - ${err.slice(0, 100)}`);
            return false;
        }
    } catch (e) {
        console.log(`  ❌ Sentinel Hub: ${e.message}`);
        return false;
    }
}

// 4. Test MapTiler
async function testMapTiler() {
    console.log("\n🗺️ MAPTILER TEST:");
    try {
        const res = await fetch(`https://api.maptiler.com/maps/satellite/tiles.json?key=${KEYS.MAPTILER}`);
        if (res.ok) {
            console.log("  ✅ MapTiler: Key valid");
            return true;
        } else {
            console.log(`  ❌ MapTiler: ${res.status}`);
            return false;
        }
    } catch (e) {
        console.log(`  ❌ MapTiler: ${e.message}`);
        return false;
    }
}

// Run all tests
async function runAll() {
    const results = await Promise.all([
        testSupabase(),
        testSentinel(),
        testMapTiler()
    ]);

    console.log("\n" + "=".repeat(50));
    const passed = results.filter(Boolean).length;
    console.log(`📊 RESULTS: ${passed}/3 services connected`);
    console.log("=".repeat(50));

    if (passed === 3) {
        console.log("✅ ALL SYSTEMS OPERATIONAL");
    } else {
        console.log("⚠️ SOME SERVICES UNAVAILABLE - Check keys above");
    }
}

runAll();
