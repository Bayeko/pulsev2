import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Simple set of icons to pick from
const icons = ['💓', '🔥', '🌟', '⚡', '🎵'];

type PulseInput = {
  icon: string;
  intensity: number;
  note: string;
  timeWindow: string;
};

export default function PulseComposer({ onCreate }: { onCreate?: (pulse: any) => void }) {
  const [selectedIcon, setSelectedIcon] = useState<string>(icons[0]);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<string>('now');
  const [loading, setLoading] = useState(false);

  const sendPulse = async () => {
    const newPulse: PulseInput & { status: string } = {
      icon: selectedIcon,
      intensity,
      note,
      timeWindow,
      status: 'sent',
    };

    // Optimistic update
    onCreate?.({ ...newPulse, id: Date.now() });

    setLoading(true);
    // TODO: Write this Moment to external calendars per docs/moments-calendar-sync.md
    const { error } = await supabase.from('pulses').insert(newPulse);
    setLoading(false);

    if (error) {
      console.error(error);
    } else {
      // success handled by optimistic update
      setNote('');
      setIntensity(5);
      setSelectedIcon(icons[0]);
      setTimeWindow('now');
    }
  };

  return (
    <div className="pulse-composer">
      <div className="icon-picker">
        {icons.map((ic) => (
          <button
            key={ic}
            type="button"
            onClick={() => setSelectedIcon(ic)}
            style={{
              fontSize: 24,
              marginRight: 8,
              opacity: selectedIcon === ic ? 1 : 0.4,
            }}
          >
            {ic}
          </button>
        ))}
      </div>

      <div className="intensity-slider">
        <label>
          Intensity: {intensity}
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div className="note-input">
        <input
          type="text"
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="time-window">
        <label>
          Time window
          <select value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
            <option value="now">Now</option>
            <option value="1h">Within 1 hour</option>
            <option value="3h">Within 3 hours</option>
            <option value="today">Today</option>
          </select>
        </label>
      </div>

      <button type="button" onClick={sendPulse} disabled={loading}>
        {loading ? 'Sending...' : 'Send Pulse'}
      </button>
    </div>
  );
}
