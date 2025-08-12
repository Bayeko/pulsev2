'use client';

import { useEffect, useState } from 'react';
import PulseComposer from '../components/PulseComposer';
import { supabase } from '../lib/supabaseClient';

type Pulse = {
  id: number;
  icon: string;
  intensity: number;
  note: string;
  timeWindow: string;
  status: string;
  direction?: 'incoming' | 'outgoing';
  created_at?: string;
};

export default function Home() {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('pulses').select('*').order('created_at', { ascending: false });
      if (data) setPulses(data);
    };
    load();
  }, []);

  const handleCreate = (pulse: Pulse) => {
    setPulses((prev) => [pulse, ...prev]);
  };

  const outgoing = pulses.filter((p) => p.direction === 'outgoing' || !p.direction);
  const incoming = pulses.filter((p) => p.direction === 'incoming');

  return (
    <div>
      <h1>Pulse Feed</h1>
      <PulseComposer onCreate={handleCreate} />

      <section>
        <h2>Outgoing</h2>
        <ul>
          {outgoing.map((p) => (
            <li key={p.id}>
              <span>{p.icon}</span> Intensity {p.intensity} {p.note && `- ${p.note}`}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Incoming</h2>
        <ul>
          {incoming.map((p) => (
            <li key={p.id}>
              <span>{p.icon}</span> Intensity {p.intensity} {p.note && `- ${p.note}`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
