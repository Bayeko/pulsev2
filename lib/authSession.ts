import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';

export type OAuthProvider = 'google' | 'apple' | 'azure';

export async function signInWithOAuth(provider: OAuthProvider) {
  // Build redirect URL based on the app.json scheme
  const redirectTo = AuthSession.makeRedirectUri({
    useProxy: true,
    scheme: 'tempapp',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  const authUrl = data?.url;
  if (!authUrl) throw new Error('Failed to get auth URL');

  const result = await AuthSession.startAsync({ authUrl, returnUrl: redirectTo });

  if (result.type === 'success' && result.params?.code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession({
      provider,
      code: result.params.code,
    });
    if (exchangeError) throw exchangeError;
  } else {
    throw new Error('OAuth flow was cancelled');
  }
}
