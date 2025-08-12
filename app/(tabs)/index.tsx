import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchPosts, Post } from '@/supabase/posts';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Posts</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        {loading && <ThemedText>Loading...</ThemedText>}
        {error && <ThemedText>Error: {error}</ThemedText>}
        {!loading && !error && posts.length === 0 && (
          <ThemedText>No posts found.</ThemedText>
        )}
        {!loading && !error &&
          posts.map((post) => (
            <ThemedText key={post.id}>{post.title ?? post.content}</ThemedText>
          ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
