import { SUPABASE_CONFIG } from "./config.js";


let client = null;


export function getSupabaseClient() {

    if (client) {
        return client;
    }

    const cfg = SUPABASE_CONFIG;

    if (
        !cfg.USE_SUPABASE ||
        !cfg.URL ||
        !cfg.ANON_KEY ||
        cfg.URL.includes("YOUR-PROJECT") ||
        cfg.ANON_KEY.includes("YOUR-ANON-KEY") ||
        typeof window.supabase === "undefined"
    ) {
        return null;
    }

    client = window.supabase.createClient(
        cfg.URL,
        cfg.ANON_KEY
    );

    return client;
}
