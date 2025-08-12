import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchPosts() {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw error;
  return data;
}

export async function addPost(post: Record<string, any>) {
  const { data, error } = await supabase.from('posts').insert(post);
  if (error) throw error;
  return data;
}
