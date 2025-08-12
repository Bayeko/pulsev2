import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { generateSuggestions, SuggestionSlot } from '@/supabase/suggestions';

export default function CalendarScreen() {
  const [slots, setSlots] = useState<SuggestionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await generateSuggestions();
        setSlots(data);
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

    load();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Loading suggestions...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  const topSlots = slots.slice(0, 5);

  return (
    <ThemedView style={styles.container}>
      {topSlots.map((slot, index) => (
        <View key={index} style={styles.card}>
          <ThemedText type="subtitle">
            {slot.start ?? ''}{slot.end ? ` - ${slot.end}` : ''}
          </ThemedText>
        </View>
      ))}
      {!topSlots.length && <ThemedText>No suggestions found.</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
