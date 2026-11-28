const WALKIN_SESSION_KEY = 'sohojkor_walkin_session_id';
let fallbackWalkInSessionId = 'guest-session-default';

export function getActiveWalkInSessionId(): string {
  if (typeof window === 'undefined' || !window.sessionStorage) return fallbackWalkInSessionId;
  try {
    let id = window.sessionStorage.getItem(WALKIN_SESSION_KEY);
    if (!id) {
      id = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      window.sessionStorage.setItem(WALKIN_SESSION_KEY, id);
    }
    return id;
  } catch {
    return fallbackWalkInSessionId;
  }
}

export function rotateWalkInSessionId(): string {
  const next = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  fallbackWalkInSessionId = next;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try { window.sessionStorage.setItem(WALKIN_SESSION_KEY, next); } catch { /* noop */ }
  }
  return next;
}

export function normalizeBdMobile(raw: string | undefined): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.startsWith('8801') && digits.length === 13) return digits.slice(2);
  if (digits.startsWith('01') && digits.length === 11) return digits;
  return '';
}
