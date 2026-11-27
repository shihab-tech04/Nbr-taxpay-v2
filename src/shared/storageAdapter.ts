import { PUBLIC_PREVIEW } from './previewMode';

const PREFERENCE_KEYS = new Set(['sohojkor_lang', 'sohojkor_theme']);

export function readAppStorage(key: string): string | null {
  if (PUBLIC_PREVIEW && !PREFERENCE_KEYS.has(key)) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeAppStorage(key: string, value: string): void {
  if (PUBLIC_PREVIEW && !PREFERENCE_KEYS.has(key)) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable; continue in memory.
  }
}

export function readJsonStorage<T>(key: string, fallback: T): T {
  const saved = readAppStorage(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}
