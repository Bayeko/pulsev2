import { supabase } from './client';

export type Post = {
  id: number;
  title?: string;
  content?: string;
  created_at?: string;
};

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data as Post[]) ?? [];
}

export async function addPost(post: { title?: string; content?: string }): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Post;
}
