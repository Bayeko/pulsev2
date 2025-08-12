import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Purchases from '@revenuecat/purchases-js';
import { STORE_ITEMS, StoreItem } from '@/lib/storeItems';
import { supabase } from '@/lib/supabaseClient';

const RC_API_KEY = process.env.NEXT_PUBLIC_RC_API_KEY!;

export default function SurpriseScreen() {
  const [items, setItems] = useState<StoreItem[]>(Object.values(STORE_ITEMS));
  const [purchased, setPurchased] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Purchases.configure({ apiKey: RC_API_KEY });
  }, []);

  const rollDice = () => {
    const available = items.filter((i) => !purchased[i.id]);
    const random = available[Math.floor(Math.random() * available.length)];
    if (random) {
      purchaseItem(random);
    }
  };

  const purchaseItem = async (item: StoreItem) => {
    try {
      const result = await Purchases.purchaseProduct(item.sku);
      if (result) {
        await supabase.from('purchases').insert({ sku: item.sku, used_at: new Date().toISOString() });
        setPurchased((prev) => ({ ...prev, [item.id]: true }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: { item: StoreItem }) => (
    <TouchableOpacity onPress={() => purchaseItem(item)} disabled={!!purchased[item.id]}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
      {purchased[item.id] && <Text>Owned</Text>}
    </TouchableOpacity>
  );

  return (
    <View>
      <Button title="Roll the dice" onPress={rollDice} />
      <FlatList data={items} renderItem={renderItem} keyExtractor={(i) => i.id} />
    </View>
  );
}
