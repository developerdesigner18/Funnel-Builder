import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bG1ubnZiZndueWtkY3N2amp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2NzU0MywiZXhwIjoyMDg1ODQzNTQzfQ.wZgz-rHj6fme4PzffQ9bq9kjuIatlqM9157HXqLvDr4";

    if (!url || !key) {
      throw new Error('Supabase environment variables are not configured');
    }

    supabaseClient = createClient(url, key);
  }

  return supabaseClient;
}
