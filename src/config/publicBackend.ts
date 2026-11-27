/**
 * Public browser configuration matching the original approved backend contract.
 * No hosted endpoint or key is embedded by default.
 * NEVER place Supabase secret/service-role keys in this module or Vite output.
 */

export interface PublicBackendEnvInput {
  VITE_SUPABASE_URL?: unknown;
  VITE_SUPABASE_PUBLISHABLE_KEY?: unknown;
  VITE_SUPABASE_ANON_KEY?: unknown;
  VITE_SUPABASE_DISABLED?: unknown;
  BASE_URL?: unknown;
  DEV?: unknown;
}

export interface PublicBackendConfig {
  readonly url: string;
  readonly publishableKey: string;
  readonly disabled: boolean;
  readonly isDev: boolean;
  readonly baseUrl: string;
  readonly configured: boolean;
  readonly keySource: 'publishable' | 'anon_fallback' | 'none';
  readonly databasePurpose: string;
}

const SECRET_KEY_PREFIXES = ['sb_secret_', 'service_role'];

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRejectedSecretKey(key: string): boolean {
  if (!key) return false;
  if (SECRET_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    return true;
  }
  // Reject JWTs explicitly carrying service_role claim if pasted into client env
  if (key.split('.').length === 3) {
    try {
      const payloadSegment = key.split('.')[1];
      const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
      const decoded =
        typeof atob === 'function'
          ? atob(base64)
          : Buffer.from(base64, 'base64').toString('utf8');
      if (/"role"\s*:\s*"service_role"/i.test(decoded)) {
        return true;
      }
    } catch {
      // Malformed JWT payload; keep standard publishable key check
    }
  }
  return false;
}

export function readPublicBackendConfig(
  overrideEnv?: PublicBackendEnvInput
): PublicBackendConfig {
  const viteEnv: PublicBackendEnvInput =
    overrideEnv ??
    (typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as PublicBackendEnvInput)
      : {});
  const processEnv: PublicBackendEnvInput =
    !overrideEnv && typeof process !== 'undefined' && process.env
      ? (process.env as PublicBackendEnvInput)
      : {};

  const rawUrl = cleanString(viteEnv.VITE_SUPABASE_URL) || cleanString(processEnv.VITE_SUPABASE_URL);
  const rawPublishable =
    cleanString(viteEnv.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    cleanString(processEnv.VITE_SUPABASE_PUBLISHABLE_KEY);
  const rawAnon =
    cleanString(viteEnv.VITE_SUPABASE_ANON_KEY) ||
    cleanString(processEnv.VITE_SUPABASE_ANON_KEY);

  const disabledRaw =
    cleanString(viteEnv.VITE_SUPABASE_DISABLED) ||
    cleanString(processEnv.VITE_SUPABASE_DISABLED);
  const disabled = disabledRaw.toLowerCase() === 'true';

  const safePublishable = isRejectedSecretKey(rawPublishable) ? '' : rawPublishable;
  const safeAnon = isRejectedSecretKey(rawAnon) ? '' : rawAnon;

  const chosenKey = safePublishable || safeAnon;
  const keySource: PublicBackendConfig['keySource'] = safePublishable
    ? 'publishable'
    : safeAnon
      ? 'anon_fallback'
      : 'none';

  const url = disabled ? '' : rawUrl;
  const publishableKey = disabled ? '' : chosenKey;
  const baseUrl = cleanString(viteEnv.BASE_URL) || '/';
  const isDev = viteEnv.DEV === true;

  return Object.freeze({
    url,
    publishableKey,
    disabled,
    isDev,
    baseUrl,
    configured: !disabled && Boolean(url && publishableKey),
    keySource: disabled ? 'none' : keySource,
    databasePurpose: 'Private payment planning drafts; not ACS/eLedger/payment settlement',
  });
}

export const TAXPAY_PUBLIC_ENDPOINT = readPublicBackendConfig();
