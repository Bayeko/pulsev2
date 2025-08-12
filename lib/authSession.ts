import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import { supabase, redirectTo } from './supabase'

WebBrowser.maybeCompleteAuthSession()

export type OAuthProvider = 'google' | 'apple' | 'azure'

// Initiates an OAuth flow using expo-auth-session and exchanges the
// resulting code for a Supabase session.
export async function signInWithOAuth(provider: OAuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo }
  })

  if (error) throw error

  const authUrl = data?.url
  if (!authUrl) throw new Error('No auth URL returned')

  const result = await AuthSession.startAsync({ authUrl, returnUrl: redirectTo })

  if (result.type !== 'success') throw new Error('OAuth flow canceled')

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    result.params
  )
  if (exchangeError) throw exchangeError
}

