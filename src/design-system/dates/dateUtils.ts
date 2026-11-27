import dayjs, { type Dayjs } from 'dayjs';

export const DHAKA_TIME_ZONE = 'Asia/Dhaka';
export const INVALID_YMD_VALUE = '__INVALID_DATE__';

const YMD_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface DateRangeFilterValue {
  from: string;
  to: string;
}

export type DateValidationReason = 'required' | 'invalid' | 'min' | 'max' | 'past' | 'future';

export function isValidYmd(value: string): boolean {
  const match = YMD_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day
  );
}

export function parseYmdToDayjs(value: string | null | undefined): Dayjs | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!isValidYmd(trimmed)) return null;
  const [year, month, day] = trimmed.split('-').map(Number);
  return dayjs().year(year).month(month - 1).date(day).startOf('day');
}

export function formatDayjsToYmd(value: Dayjs | null | undefined): string {
  if (!value || !value.isValid()) return '';
  const year = String(value.year()).padStart(4, '0');
  const month = String(value.month() + 1).padStart(2, '0');
  const day = String(value.date()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;
  return isValidYmd(formatted) ? formatted : '';
}

function formatDatePartsToYmd(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  const ymd = `${year}-${month}-${day}`;
  return isValidYmd(ymd) ? ymd : '';
}

export function getLocalTodayYmd(now: Date = new Date()): string {
  const year = String(now.getFullYear()).padStart(4, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const ymd = `${year}-${month}-${day}`;
  return isValidYmd(ymd) ? ymd : '';
}

export function getDhakaTodayYmd(now: Date = new Date()): string {
  return formatDatePartsToYmd(now, DHAKA_TIME_ZONE);
}

export function formatIsoToDhakaYmd(
  isoOrYmd: string,
  timeZone: string = DHAKA_TIME_ZONE
): string {
  const trimmed = isoOrYmd.trim();
  if (!trimmed) return '';
  if (isValidYmd(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDatePartsToYmd(parsed, timeZone);
}

export function validateYmdDate(
  value: string,
  options: {
    required?: boolean;
    minDate?: string;
    maxDate?: string;
    disablePast?: boolean;
    disableFuture?: boolean;
    todayYmd?: string;
  } = {}
): { valid: boolean; reason?: DateValidationReason } {
  const trimmed = value.trim();
  if (!trimmed) {
    return options.required ? { valid: false, reason: 'required' } : { valid: true };
  }
  if (!isValidYmd(trimmed)) {
    return { valid: false, reason: 'invalid' };
  }
  const today =
    options.todayYmd && isValidYmd(options.todayYmd) ? options.todayYmd : getLocalTodayYmd();

  if (options.minDate && isValidYmd(options.minDate) && trimmed < options.minDate) {
    return { valid: false, reason: 'min' };
  }
  if (options.disablePast && today && trimmed < today) {
    return { valid: false, reason: 'past' };
  }
  if (options.maxDate && isValidYmd(options.maxDate) && trimmed > options.maxDate) {
    return { valid: false, reason: 'max' };
  }
  if (options.disableFuture && today && trimmed > today) {
    return { valid: false, reason: 'future' };
  }
  return { valid: true };
}

export function validateGiftDate(
  value: string,
  todayYmd: string = getDhakaTodayYmd()
): { valid: boolean; reason?: 'required' | 'invalid' | 'future' } {
  const res = validateYmdDate(value, { required: true, maxDate: todayYmd });
  if (res.valid) return { valid: true };
  if (res.reason === 'max' || res.reason === 'future') return { valid: false, reason: 'future' };
  return { valid: false, reason: res.reason === 'required' ? 'required' : 'invalid' };
}

export function validateDateRangeFilter(range: DateRangeFilterValue): {
  valid: boolean;
  reason?: 'invalid_from' | 'invalid_to' | 'inverted';
} {
  const from = range.from.trim();
  const to = range.to.trim();
  if (from && !isValidYmd(from)) {
    return { valid: false, reason: 'invalid_from' };
  }
  if (to && !isValidYmd(to)) {
    return { valid: false, reason: 'invalid_to' };
  }
  if (from && to && from > to) {
    return { valid: false, reason: 'inverted' };
  }
  return { valid: true };
}

function parseYmdToLocalDayBounds(ymd: string): { startMs: number; endMs: number } | null {
  if (!isValidYmd(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  return {
    startMs: new Date(y, m - 1, d, 0, 0, 0, 0).getTime(),
    endMs: new Date(y, m - 1, d, 23, 59, 59, 999).getTime(),
  };
}

function parseRecordTimestampMs(isoOrYmd: string): number | null {
  const trimmed = isoOrYmd.trim();
  if (!trimmed) return null;
  if (isValidYmd(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function isDateWithinInclusiveRange(isoOrYmd: string, range: DateRangeFilterValue): boolean {
  if (!validateDateRangeFilter(range).valid) return false;
  const from = range.from.trim();
  const to = range.to.trim();
  const recordMs = parseRecordTimestampMs(isoOrYmd);
  if (recordMs === null) return false;
  if (!from && !to) return true;
  const fromBounds = from ? parseYmdToLocalDayBounds(from) : null;
  if (from && (!fromBounds || recordMs < fromBounds.startMs)) return false;
  const toBounds = to ? parseYmdToLocalDayBounds(to) : null;
  if (to && (!toBounds || recordMs > toBounds.endMs)) return false;
  return true;
}

export function formatYmdDisplay(ymd: string, lang: 'en' | 'bn' = 'en'): string {
  if (!isValidYmd(ymd)) return ymd;
  const [year, month, day] = ymd.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(utcDate);
}
