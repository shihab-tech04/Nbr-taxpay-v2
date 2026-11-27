/**
 * Shared public-branding circuit breaker. Only public banner metadata readers
 * use it; Taxpayer Auth, payments, Office, and SQL remain untouched.
 */
export const BRANDING_402_COOLDOWN_MS = 15 * 60_000;
export const BRANDING_ERROR_COOLDOWN_MS = 60_000;
const STATUS_402_STORAGE_KEY = 'sohojkor-public-branding-http-402-until-v2';

let pauseUntil = 0;

function persistedPause(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const saved = Number(window.sessionStorage.getItem(STATUS_402_STORAGE_KEY));
    return Number.isSafeInteger(saved) ? saved : 0;
  } catch {
    return 0;
  }
}

export function brandingReadsAllowed(now = Date.now()): boolean {
  return now >= Math.max(pauseUntil, persistedPause());
}

export function noteBrandingResponse(status: number | undefined, failed: boolean, now = Date.now()): void {
  if (!failed) {
    if (now >= pauseUntil) pauseUntil = 0;
    return;
  }
  if (status === 402) {
    pauseUntil = Math.max(pauseUntil, now + BRANDING_402_COOLDOWN_MS);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(STATUS_402_STORAGE_KEY, String(pauseUntil));
      } catch {
        // sessionStorage may be unavailable
      }
    }
    return;
  }
  pauseUntil = Math.max(pauseUntil, now + BRANDING_ERROR_COOLDOWN_MS);
}

export function resetBrandingHealthForTest(): void {
  pauseUntil = 0;
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.removeItem(STATUS_402_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
