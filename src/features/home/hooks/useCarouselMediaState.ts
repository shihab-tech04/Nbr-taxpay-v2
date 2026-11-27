import { useCallback, useSyncExternalStore } from 'react';

export function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return () => {};
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  }, []);

  const getSnapshot = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useDocumentVisibility(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof document === 'undefined') return () => {};
    document.addEventListener('visibilitychange', onStoreChange);
    return () => document.removeEventListener('visibilitychange', onStoreChange);
  }, []);

  const getSnapshot = () => {
    if (typeof document === 'undefined') return true;
    return document.visibilityState === 'visible';
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
