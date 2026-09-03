import { SUPABASE_CONFIG } from "../config.js";
import { getSupabaseClient } from "../supabase.js";

export default class StorageService {
    constructor(key = "daily-tracker-data") {
        this.key = key;
        this.memory = null;
        this.available = this.storageAvailable();
        this.client = getSupabaseClient();
    }


    storageAvailable() {

        try {
            const testKey = "__tracker_test__";
            window.localStorage.setItem(testKey, "1");
            window.localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }


    cloudEnabled() {
        return this.client !== null;
    }


    // ========================================================
    // LOCAL (fallback) STORAGE
    // ========================================================

    save(data) {

        const serialized = JSON.stringify(data);

        if (this.available) {
            try {
                window.localStorage.setItem(this.key, serialized);
                return;
            } catch (error) {
                this.available = false;
            }
        }

        this.memory = serialized;
    }


    load() {

        let data = null;

        if (this.available) {
            try {
                data = window.localStorage.getItem(this.key);
            } catch (error) {
                this.available = false;
            }
        } else {
            data = this.memory;
        }

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error(
                "Failed to parse stored data:",
                error
            );
            return null;
        }
    }


    clear() {

        if (this.available) {
            try {
                window.localStorage.removeItem(this.key);
                this.saveAllToCloud([]);
                return;
            } catch (error) {
                this.available = false;
            }
        }

        this.memory = null;
    }


    // ========================================================
    // SUPABASE (cloud) SYNC
    // ========================================================

    // Fetch every row owned by the current user.
    // Returns an array of { date, payload } sorted by date.
    async fetchAllFromCloud() {

        if (!this.client) {
            return [];
        }

        const userId = await this.currentUserId();

        if (!userId) {
            return [];
        }

        const { data, error } =
            await this.client
                .from(SUPABASE_CONFIG.TABLE)
                .select("*")
                .eq(SUPABASE_CONFIG.USER_ID_COLUMN, userId)
                .order("date", { ascending: true });

        if (error) {
            console.error(
                "Supabase fetch failed:",
                error
            );
            return [];
        }

        return data || [];
    }


    // Upsert all logs owned by the current user.
    async pushAllToCloud(logs) {

        if (!this.client) {
            return false;
        }

        if (!Array.isArray(logs)) {
            return false;
        }

        const userId = await this.currentUserId();

        if (!userId) {
            return false;
        }

        const rows = logs.map(log => ({
            date: log.date,
            user_id: userId,
            payload: log
        }));

        if (rows.length === 0) {
            return true;
        }

        const { error } =
            await this.client
                .from(SUPABASE_CONFIG.TABLE)
                .upsert(rows, {
                    onConflict: [
                        "user_id",
                        "date"
                    ].join(",")
                });

        if (error) {
            console.error(
                "Supabase save failed:",
                error
            );
            return false;
        }

        return true;
    }


    async currentUserId() {

        try {
            const { data, error } =
                await this.client.auth.getUser();

            if (error || !data || !data.user) {
                return null;
            }

            return data.user.id;
        } catch (error) {
            return null;
        }
    }
}
