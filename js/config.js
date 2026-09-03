// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
//
// To enable syncing your log across all devices (phone, laptop),
// this app can store data in a free Supabase PostgreSQL database.
//
// SETUP (one time, ~5 minutes):
//   1. Create a free project at https://supabase.com
//   2. In your project, go to SQL Editor and run the "Create the
//      table" SQL shown in the deployment guide / README.
//   3. Go to Project Settings > API. Copy the "Project URL" and
//      the "anon" (public) key and paste them below.
//   4. In the Supabase dashboard, Database > Realtime, enable
//      the `logs` table.
//
// Set USE_SUPABASE = true to turn on cloud sync. While it is
// false, the app uses local browser storage only.

export const SUPABASE_CONFIG = {
    USE_SUPABASE: true,

    URL: "https://dqfyddrtoptvgnwneedt.supabase.co",
    ANON_KEY: "sb_publishable_z_b4zyZ8DHqpd6dUw9Zo7A_AeIBZr7P",

    TABLE: "logs",

    // Each row stores the user that owns it. Multi-user apps
    // rely on Supabase Auth + Row Level Security so a user can
    // only read/write their own rows. The USER_ID_COLUMN is that
    // owner column on every row.
    USER_ID_COLUMN: "user_id"
};
