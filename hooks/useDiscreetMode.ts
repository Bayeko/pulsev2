'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { supabase } from '@/supabase/client';
import { configureNotificationHandling } from '@/app/notifications';

interface DiscreetContextValue {
  discreetMode: boolean;
  setDiscreetMode: (value: boolean) => void;
}

const DiscreetModeContext = createContext<DiscreetContextValue>({
  discreetMode: false,
  setDiscreetMode: () => {},
});

export function DiscreetModeProvider({ children }: { children: React.ReactNode }) {
  const [discreetMode, setDiscreetMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('discreet_mode')
          .eq('id', user.id)
          .single();
        setDiscreetMode(!!data?.discreet_mode);
      }
    };
    load();
  }, []);

  useEffect(() => {
    configureNotificationHandling(discreetMode);
    if (!discreetMode) return;

    const authenticate = async () => {
      await LocalAuthentication.authenticateAsync();
    };
    authenticate();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        authenticate();
      }
    });
    return () => {
      sub.remove();
    };
  }, [discreetMode]);

  return (
    <DiscreetModeContext.Provider value={{ discreetMode, setDiscreetMode }}>
      {children}
    </DiscreetModeContext.Provider>
  );
}

export const useDiscreetMode = () => useContext(DiscreetModeContext);
