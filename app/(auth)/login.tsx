'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { signInWithOAuth, OAuthProvider } from '../../lib/authSession'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) router.push('/')
  }

  const handleOAuth = async (provider: OAuthProvider) => {
    try {
      await signInWithOAuth(provider)
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => handleOAuth('google')}>Login with Google</button>
      <button onClick={() => handleOAuth('apple')}>Login with Apple</button>
      <button onClick={() => handleOAuth('azure')}>Login with Outlook</button>
    </div>
  )
}
