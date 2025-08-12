import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

/**
 * Screen that requests a 6 digit invite code from the
 * `create_pair_invite` edge function and displays it to the user.
 */
export default function InviteScreen() {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/functions/v1/create_pair_invite');
        const json = await res.json();
        setCode(json.code);
      } catch (err) {
        console.error('Failed to create invite', err);
      }
    }
    load();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, letterSpacing: 8 }}>{code}</Text>
    </View>
  );
}
