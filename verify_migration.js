
import { createClient } from '@supabase/supabase-js';

// Read env directly since we are in node script
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Env Vars. Please run with env vars.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    console.log("Verifying schema...");

    // Try to select the specific column. If it doesn't exist, this might error or return null.
    const { data, error } = await supabase
        .from('detections')
        .select('img_url')
        .limit(1);

    if (error) {
        console.error("Verification Failed:", error.message);
        console.log("It seems the 'img_url' column might NOT exist or permissions are blocked.");
    } else {
        console.log("Verification Successful! 'img_url' column is accessible.");
        console.log("Sample Data:", data);
    }
}

verify();
