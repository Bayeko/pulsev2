import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

/**
 * Screen used by the invited user to accept a pairing. The user can either
 * type the 6 digit code or scan a QR code. If the code exists the related
 * pair is activated and the user is navigated back to the Home screen.
 */
export default function AcceptScreen() {
  const [code, setCode] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    setCode(data);
  };

  async function accept() {
    const { data, error } = await supabase
      .from('pair_invites')
      .select('pair_id')
      .eq('code', code)
      .single();

    if (error || !data) {
      alert('Invalid code');
      return;
    }

    await supabase
      .from('pairs')
      .update({ active: true })
      .eq('id', data.pair_id);

    router.replace('/');
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {scanning ? (
        <BarCodeScanner
          style={{ flex: 1, width: '100%' }}
          onBarCodeScanned={handleBarCodeScanned}
        />
      ) : (
        <>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 8, width: 200, marginBottom: 16 }}
            placeholder="Enter code"
          />
          <Button title="Scan QR Code" onPress={() => setScanning(true)} />
          <Button title="Accept" onPress={accept} />
        </>
      )}
    </View>
  );
}
