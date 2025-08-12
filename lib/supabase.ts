import { createClient } from '@supabase/supabase-js'
import { makeRedirectUri } from 'expo-auth-session'

// Determine Supabase credentials from environment variables for both
// Expo and Next.js environments.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  ''

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''

// Shared Supabase client used across the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Redirect URI used for OAuth flows with expo-auth-session
export const redirectTo = makeRedirectUri({ scheme: 'tempapp' })

