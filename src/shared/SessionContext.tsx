import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types/tax';
import {
  getNoticesForTin,
  WALKIN_GUEST_USER,
  type FirstLoginNotice,
} from './accountSession';
import { isRestrictedOperationAllowed } from './previewPolicy';
import { readAppStorage, readJsonStorage, writeAppStorage } from './storageAdapter';

export interface SessionContextValue {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  unseenNotices: FirstLoginNotice[];
  acknowledgeNotice: (noticeId: string) => void;
  completeOtpSignIn: (profile: UserProfile) => void;
  signOutClean: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    if (!isRestrictedOperationAllowed('sign_in')) return false;
    return readAppStorage('sohojkor_auth') === 'true';
  });

  const [user, setUserState] = useState<UserProfile>(() => {
    if (!isRestrictedOperationAllowed('sign_in')) return WALKIN_GUEST_USER;
    if (readAppStorage('sohojkor_auth') !== 'true') return WALKIN_GUEST_USER;
    return readJsonStorage('sohojkor_user', WALKIN_GUEST_USER);
  });

  const [acknowledgedByTin, setAcknowledgedByTin] = useState<Record<string, string[]>>(() =>
    readJsonStorage<Record<string, string[]>>('sohojkor_ack_notices', {})
  );

  useEffect(() => {
    writeAppStorage('sohojkor_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    writeAppStorage('sohojkor_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    writeAppStorage('sohojkor_ack_notices', JSON.stringify(acknowledgedByTin));
  }, [acknowledgedByTin]);

  const setUser: React.Dispatch<React.SetStateAction<UserProfile>> = useCallback((next) => {
    if (!isRestrictedOperationAllowed('sign_in')) return;
    setUserState(next);
  }, []);

  const setIsAuthenticated = useCallback((val: boolean) => {
    if (val && !isRestrictedOperationAllowed('sign_in')) return;
    setIsAuthenticatedState(val);
    if (!val) setUserState(WALKIN_GUEST_USER);
  }, []);

  const completeOtpSignIn = useCallback((profile: UserProfile) => {
    if (!isRestrictedOperationAllowed('sign_in')) return;
    setUserState(profile);
    setIsAuthenticatedState(true);
  }, []);

  const acknowledgeNotice = useCallback(
    (noticeId: string) => {
      if (!isRestrictedOperationAllowed('sign_in') || !isAuthenticated || !user.tin) return;
      setAcknowledgedByTin((prev) => {
        const existing = prev[user.tin] ?? [];
        if (existing.includes(noticeId)) return prev;
        return { ...prev, [user.tin]: [...existing, noticeId] };
      });
    },
    [isAuthenticated, user.tin]
  );

  const signOutClean = useCallback(() => {
    setIsAuthenticatedState(false);
    setUserState(WALKIN_GUEST_USER);
    // Keep per-account acknowledged notices persisted across logout and re-login.
  }, []);

  const unseenNotices = useMemo(() => {
    if (!isAuthenticated || !isRestrictedOperationAllowed('sign_in') || !user.tin) return [];
    const acked = acknowledgedByTin[user.tin] ?? [];
    return getNoticesForTin(user.tin).filter((notice) => !acked.includes(notice.id));
  }, [acknowledgedByTin, isAuthenticated, user.tin]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      unseenNotices,
      acknowledgeNotice,
      completeOtpSignIn,
      signOutClean,
    }),
    [user, setUser, isAuthenticated, setIsAuthenticated, unseenNotices, acknowledgeNotice, completeOtpSignIn, signOutClean]
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
