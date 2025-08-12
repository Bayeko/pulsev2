'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useDiscreetMode } from '@/hooks/useDiscreetMode'

export default function Preferences() {
  const session = useAuth('/login')
  const [boundaries, setBoundaries] = useState('')
  const [quietHours, setQuietHours] = useState('')
  const [theme, setTheme] = useState('light')
  const { discreetMode, setDiscreetMode } = useDiscreetMode()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    await supabase.from('profiles').upsert({
      id: session.user.id,
      boundaries,
      quiet_hours: quietHours,
      theme,
      discreet_mode: discreetMode,
    })
    router.push('/')
  }

  return (
    <div>
      <h1>Quick Preferences</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Boundaries"
          value={boundaries}
          onChange={(e) => setBoundaries(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quiet Hours"
          value={quietHours}
          onChange={(e) => setQuietHours(e.target.value)}
        />
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={discreetMode}
            onChange={(e) => setDiscreetMode(e.target.checked)}
          />
          Discreet Mode
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
