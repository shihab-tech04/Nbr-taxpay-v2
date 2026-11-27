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

export function isValidNumericSuggestion(
  option: string,
  maxLength = DEFAULT_TIN_LENGTH
): boolean {
  if (maxLength <= 0) return false;
  return new RegExp(`^\\d{${maxLength}}$`).test(option);
}

export function filterMatchingTinSuggestions(
  suggestions: readonly string[] | undefined,
  query: string,
  maxLength = DEFAULT_TIN_LENGTH
): string[] {
  const cleanedQuery = sanitizeIdentifierDigits(query, maxLength);
  if (!suggestions?.length || !cleanedQuery) return [];
  const valid = suggestions.filter((option) => isValidNumericSuggestion(option, maxLength));
  return valid.filter((option) => option.includes(cleanedQuery));
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

export function replaceDigitAtFullLength(
  current: string,
  index: number,
  digit: string,
  maxLength = DEFAULT_TIN_LENGTH
): { nextValue: string; nextCaretIndex: number } | null {
  const cleaned = sanitizeIdentifierDigits(digit, 1);
  if (!cleaned || index < 0 || index >= maxLength || index >= current.length) {
    return null;
  }
  const nextValue = sanitizeIdentifierDigits(
    `${current.slice(0, index)}${cleaned}${current.slice(index + 1)}`,
    maxLength
  );
  return {
    nextValue,
    nextCaretIndex: Math.min(index + 1, maxLength),
  };
}

export function findDigitCellIndexAtPoint(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  maxLength: number,
  valueLength: number
): number {
  const cells = Array.from(container.querySelectorAll(':scope > span'));
  const hit = cells.findIndex((cell) => {
    const rect = cell.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  });
  return Math.min(hit < 0 ? maxLength - 1 : hit, valueLength);
}

export function resolveTinPasteUpdate(
  currentValue: string,
  clipboardText: string,
  selectionStart: number | null,
  selectionEnd: number | null,
  maxLength: number
): { nextValue: string; nextCaretIndex: number; activeDigit: number } | null {
  const pasted = parsePastedIdentifierDigits(clipboardText, maxLength);
  if (!pasted) return null;
  if (pasted.length === maxLength) {
    return { nextValue: pasted, nextCaretIndex: maxLength, activeDigit: maxLength - 1 };
  }
  const start = selectionStart ?? currentValue.length;
  const end = selectionEnd ?? start;
  const { nextValue, nextCaretIndex } = insertDigitsAtRange(currentValue, start, end, pasted, maxLength);
  return { nextValue, nextCaretIndex, activeDigit: Math.min(nextCaretIndex, maxLength - 1) };
}

export function resolveTinDigitKeyAction(params: {
  key: string;
  hasModifier: boolean;
  locked: boolean;
  directDigitEdit: boolean;
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  maxLength: number;
}): { preventDefault: boolean; replacement?: { nextValue: string; nextCaretIndex: number } } {
  const { key, hasModifier, locked, directDigitEdit, value, selectionStart, selectionEnd, maxLength } = params;
  if (locked || hasModifier || key.length !== 1) return { preventDefault: false };
  if (!/^[0-9]$/.test(key)) return { preventDefault: true };
  const start = selectionStart ?? value.length;
  const end = selectionEnd ?? start;
  if (directDigitEdit && start === end && value.length >= maxLength && start < maxLength) {
    const replacement = replaceDigitAtFullLength(value, start, key, maxLength);
    if (replacement) return { preventDefault: true, replacement };
  }
  return { preventDefault: false };
}
