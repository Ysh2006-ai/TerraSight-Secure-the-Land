
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createMockClient = () => {
    console.warn("⚠️ Supabase credentials not found. Using mock client. Realtime features will not work.");

    return {
        from: (table: string) => ({
            insert: async (data: Record<string, unknown>) => {
                console.log(`[Mock Supabase] Inserting into ${table}:`, data);
                return { data: null, error: null };
            },
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null }),
                    order: () => ({
                        limit: () => async () => ({ data: [], error: null })
                    })
                })
            })
        }),
        channel: (name: string) => ({
            on: () => ({
                subscribe: () => console.log(`[Mock Supabase] Subscribed to channel: ${name}`)
            }),
            subscribe: () => console.log(`[Mock Supabase] Subscribed to channel: ${name}`)
        })
    } as unknown as ReturnType<typeof createClient>;
};

export const supabase = (supabaseUrl && supabaseKey)
    ? (() => {
        console.log("[Supabase] Initializing with URL:", supabaseUrl?.slice(0, 20) + "...");
        return createClient(supabaseUrl, supabaseKey);
    })()
    : createMockClient();
