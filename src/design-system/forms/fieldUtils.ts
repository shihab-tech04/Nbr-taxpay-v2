import type { OutlinedTextFieldProps, TextFieldOwnerState } from '@mui/material/TextField';

export type AppSlotProps = NonNullable<OutlinedTextFieldProps['slotProps']>;
type SlotKey = keyof AppSlotProps;

export function mergeSlotEntry<K extends SlotKey>(
  _slotKey: K,
  base: AppSlotProps[K],
  override: AppSlotProps[K]
): AppSlotProps[K] {
  if (!base) return override;
  if (!override) return base;
  if (typeof base === 'function' || typeof override === 'function') {
    return ((ownerState: TextFieldOwnerState) => {
      const baseResolved = typeof base === 'function' ? base(ownerState) : base;
      const overrideResolved = typeof override === 'function' ? override(ownerState) : override;
      return { ...baseResolved, ...overrideResolved };
    }) as AppSlotProps[K];
  }
  return { ...base, ...override } as AppSlotProps[K];
}

export function sanitizeDigits(value: string, maxLength?: number): string {
  const digitsOnly = value.replace(/\D/g, '');
  return typeof maxLength === 'number' ? digitsOnly.slice(0, maxLength) : digitsOnly;
}

export function sanitizeCurrencyInput(value: string, decimalScale = 2): string {
  const stripped = value.replace(/[^0-9.]/g, '');
  if (!stripped) return '';

  const firstDotIndex = stripped.indexOf('.');
  if (firstDotIndex === -1) {
    return stripped;
  }

  const intPart = stripped.slice(0, firstDotIndex);
  const rawFracPart = stripped.slice(firstDotIndex + 1).replace(/\./g, '');
  if (decimalScale <= 0) {
    return intPart;
  }

  const normalizedInt = intPart === '' ? '0' : intPart;
  const fracPart = rawFracPart.slice(0, decimalScale);
  return `${normalizedInt}.${fracPart}`;
}

export function parseCurrencyAmount(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === '.') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export interface CurrencyValidationOptions {
  minAmount?: number;
  maxAmount?: number;
  decimalScale?: number;
  required?: boolean;
}

export interface CurrencyValidationResult {
  valid: boolean;
  numericValue: number | null;
  reason?: 'required' | 'invalid' | 'precision' | 'min' | 'max';
}

export function validateCurrencyAmount(
  value: string | number | null | undefined,
  options: CurrencyValidationOptions = {}
): CurrencyValidationResult {
  const { minAmount, maxAmount, decimalScale = 2, required = true } = options;

  if (value === null || value === undefined || String(value).trim() === '') {
    return required
      ? { valid: false, numericValue: null, reason: 'required' }
      : { valid: true, numericValue: null };
  }

  const rawStr = String(value).trim();
  const decimalPattern =
    decimalScale > 0
      ? new RegExp(`^\\d+(\\.\\d{1,${decimalScale}})?$`)
      : /^\d+$/;

  if (!/^\d+(\.\d+)?$/.test(rawStr)) {
    return { valid: false, numericValue: null, reason: 'invalid' };
  }

  if (!decimalPattern.test(rawStr)) {
    return { valid: false, numericValue: null, reason: 'precision' };
  }

  const numericValue = Number(rawStr);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return { valid: false, numericValue: null, reason: 'invalid' };
  }

  if (typeof minAmount === 'number' && numericValue < minAmount) {
    return { valid: false, numericValue, reason: 'min' };
  }

  if (typeof maxAmount === 'number' && numericValue > maxAmount) {
    return { valid: false, numericValue, reason: 'max' };
  }

  return { valid: true, numericValue };
}

export function validateTin(tin: string): { valid: boolean; reason?: 'required' | 'format' } {
  const trimmed = tin.trim();
  if (!trimmed) return { valid: false, reason: 'required' };
  if (!/^\d{12}$/.test(trimmed)) return { valid: false, reason: 'format' };
  return { valid: true };
}

export function validateOtp(otp: string): { valid: boolean; reason?: 'required' | 'format' } {
  const trimmed = otp.trim();
  if (!trimmed) return { valid: false, reason: 'required' };
  if (!/^\d{6}$/.test(trimmed)) return { valid: false, reason: 'format' };
  return { valid: true };
}

export function validateBangladeshPhone(phone: string): boolean {
  const normalized = phone.replace(/[\s-]/g, '').trim();
  return /^(\+?88)?01[3-9]\d{8}$/.test(normalized);
}

export function sanitizePassport(value: string, maxLength = 12): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, maxLength);
}

export function validatePassport(passport: string): boolean {
  return /^[A-Z0-9]{6,12}$/.test(passport.trim().toUpperCase());
}
