import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types/tax';
import { INITIAL_USER } from './mockData';
import { isRestrictedOperationAllowed } from './previewPolicy';
import { readAppStorage, readJsonStorage, writeAppStorage } from './storageAdapter';

export interface SessionContextValue {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile>(() =>
    readJsonStorage('sohojkor_user', INITIAL_USER)
  );

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    if (!isRestrictedOperationAllowed('sign_in')) return false;
    return readAppStorage('sohojkor_auth') === 'true';
  });

  useEffect(() => {
    writeAppStorage('sohojkor_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    writeAppStorage('sohojkor_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const setUser: React.Dispatch<React.SetStateAction<UserProfile>> = useCallback((next) => {
    if (!isRestrictedOperationAllowed('sign_in')) return;
    setUserState(next);
  }, []);

  const setIsAuthenticated = useCallback((val: boolean) => {
    if (val && !isRestrictedOperationAllowed('sign_in')) return;
    setIsAuthenticatedState(val);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [user, setUser, isAuthenticated, setIsAuthenticated]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
