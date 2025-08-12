import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

/**
 * Fetches the current authenticated session from Supabase.
 * Throws any underlying error from the Supabase client.
 */
export async function getAuthSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
