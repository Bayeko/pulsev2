import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { addMoment } from '@/supabase/moments';
import { ThemedText } from '@/components/ThemedText';

export default function NewMomentScreen() {
  const [pairId, setPairId] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createMoment() {
    setSaving(true);
    setError(null);
    try {
      await addMoment({
        pair_id: pairId,
        timestamp: new Date().toISOString(),
        description,
      });
      router.back();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>
        New Moment
      </ThemedText>
      <TextInput
        placeholder="Pair ID"
        value={pairId}
        onChangeText={setPairId}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      {error && <ThemedText style={{ marginBottom: 12 }}>Error: {error}</ThemedText>}
      <Button title={saving ? 'Saving...' : 'Save Moment'} onPress={createMoment} disabled={saving} />
    </View>
  );
}
