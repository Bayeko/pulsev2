'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Reset() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/login`,
    })
    setMessage(error ? error.message : 'Check your email for a reset link')
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send reset link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
