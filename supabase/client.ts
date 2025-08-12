import { createClient } from '@supabase/supabase-js';

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const SUPABASE_URL = requireEnv(process.env.EXPO_PUBLIC_SUPABASE_URL, 'SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
