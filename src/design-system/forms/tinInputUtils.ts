export const DEFAULT_TIN_LENGTH = 12;

export function sanitizeIdentifierDigits(
  value: string,
  maxLength = DEFAULT_TIN_LENGTH
): string {
  const digits = value.replace(/\D/g, '');
  return maxLength > 0 ? digits.slice(0, maxLength) : '';
}

export function parsePastedIdentifierDigits(
  clipboardText: string,
  maxLength = DEFAULT_TIN_LENGTH
): string {
  return sanitizeIdentifierDigits(clipboardText, maxLength);
}

export function insertDigitsAtRange(
  current: string,
  selectionStart: number,
  selectionEnd: number,
  insertedDigits: string,
  maxLength = DEFAULT_TIN_LENGTH
): { nextValue: string; nextCaretIndex: number } {
  const cleanedInsert = sanitizeIdentifierDigits(insertedDigits, maxLength);
  if (!cleanedInsert) {
    return {
      nextValue: sanitizeIdentifierDigits(current, maxLength),
      nextCaretIndex: Math.min(selectionStart, current.length),
    };
  }
  const safeStart = Math.max(0, Math.min(selectionStart, current.length));
  const safeEnd = Math.max(safeStart, Math.min(selectionEnd, current.length));
  const combined = `${current.slice(0, safeStart)}${cleanedInsert}${current.slice(safeEnd)}`;
  const nextValue = sanitizeIdentifierDigits(combined, maxLength);
  const nextCaretIndex = Math.min(safeStart + cleanedInsert.length, nextValue.length);
  return { nextValue, nextCaretIndex };
}

export function filterMatchingTinSuggestions(
  suggestions: readonly string[] | undefined,
  query: string,
  maxLength = DEFAULT_TIN_LENGTH
): string[] {
  if (!suggestions?.length || !query) return [];
  const valid = suggestions.filter((option) => option.length === maxLength);
  return valid.filter((option) => option.includes(query));
}

export function maskTinForDisplay(tin: string | null | undefined): string {
  if (!tin) return '';
  const digits = String(tin);
  return digits.length <= 3
    ? '*'.repeat(digits.length)
    : `${digits.slice(0, 3)}${'*'.repeat(digits.length - 3)}`;
}

export function validateIdentifierLength(
  value: string,
  expectedLength = DEFAULT_TIN_LENGTH
): { valid: boolean; reason?: 'required' | 'format' } {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, reason: 'required' };
  const exactDigits = new RegExp(`^\\d{${expectedLength}}$`);
  if (!exactDigits.test(trimmed)) return { valid: false, reason: 'format' };
  return { valid: true };
}
