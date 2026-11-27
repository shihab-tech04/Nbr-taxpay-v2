import React from 'react';
import {
  PreferencesProvider,
  usePreferences,
  type PreferencesContextValue,
} from './PreferencesContext';
import { SessionProvider, useSession, type SessionContextValue } from './SessionContext';
import {
  DomainStateProvider,
  useDomainState,
  type DomainStateContextValue,
} from './DomainStateContext';

export type AppContextType = PreferencesContextValue & SessionContextValue & DomainStateContextValue;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PreferencesProvider>
    <SessionProvider>
      <DomainStateProvider>{children}</DomainStateProvider>
    </SessionProvider>
  </PreferencesProvider>
);

// Compatibility facade allowing incremental adoption of focused context hooks.
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = (): AppContextType => {
  const preferences = usePreferences();
  const session = useSession();
  const domain = useDomainState();

  return {
    ...preferences,
    ...session,
    ...domain,
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export { usePreferences, useSession, useDomainState };
