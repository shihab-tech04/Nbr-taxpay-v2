import { getDhakaTodayYmd, isValidYmd, validateYmdDate } from '../../design-system/dates/dateUtils';
import { sanitizePassport, validatePassport } from '../../design-system/forms';
import { normalizeBdMobile } from '../../shared/accountSession';
import { getTravelTaxMsg, type TravelLang } from './travelTaxMessages';
import {
  BD_SAMPLE_PASSPORTS,
  LAND_PORTS,
  type ConfirmedPassenger,
  type DraftPassengerInput,
  type SamplePassportEntry,
  type TravelDetailsErrors,
  type TravelDetailsInput,
  type TravelPassengerErrors,
} from './travelTaxTypes';

export const ILLUSTRATIVE_ADULT_RATE = 1000;

export function isMaskedPassportValue(rawPassport: string): boolean {
  return /[•*]/.test(rawPassport);
}

export function lookupBdPassport(rawPassport: string): SamplePassportEntry | null {
  if (isMaskedPassportValue(rawPassport)) return null;
  const clean = sanitizePassport(rawPassport, 12);
  if (!clean) return null;
  return BD_SAMPLE_PASSPORTS.find((entry) => entry.passportNumber === clean) ?? null;
}

export function getBdPassportSuggestions(query: string): readonly SamplePassportEntry[] {
  const clean = sanitizePassport(query, 12);
  if (!clean) return BD_SAMPLE_PASSPORTS;
  return BD_SAMPLE_PASSPORTS.filter(
    (entry) =>
      entry.passportNumber.includes(clean) ||
      entry.passengerName.toUpperCase().includes(clean)
  );
}

export function maskPassport(rawPassport: string): string {
  const clean = sanitizePassport(rawPassport, 12);
  if (!clean || clean.length <= 4) return '••••';
  return `••••${clean.slice(-4)}`;
}

export function calcAgeOnDate(dobYmd: string, travelYmd: string): number | null {
  if (!isValidYmd(dobYmd) || !isValidYmd(travelYmd) || dobYmd > travelYmd) return null;
  const [by, bm, bd] = dobYmd.split('-').map(Number);
  const [ty, tm, td] = travelYmd.split('-').map(Number);
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) age -= 1;
  return age >= 0 ? age : null;
}

export function calculatePassengerTaxForAge(age: number): number {
  if (age <= 5) return 0;
  if (age <= 12) return Math.round(ILLUSTRATIVE_ADULT_RATE * 0.5);
  return ILLUSTRATIVE_ADULT_RATE;
}

export function calculateTravelBreakdown(
  passengers: readonly ConfirmedPassenger[],
  travelDate: string
): { items: Array<ConfirmedPassenger & { ageOnTravelDate: number; amount: number }>; totalAmount: number; valid: boolean } {
  if (passengers.length === 0 || !isValidYmd(travelDate)) {
    return { items: [], totalAmount: 0, valid: false };
  }
  const items: Array<ConfirmedPassenger & { ageOnTravelDate: number; amount: number }> = [];
  for (const p of passengers) {
    const cleanNum = sanitizePassport(p.passportNumber, 12);
    const age = calcAgeOnDate(p.dob, travelDate);
    if (age === null || p.needsRevalidation || isMaskedPassportValue(p.passportNumber) || !validatePassport(cleanNum)) {
      return { items: [], totalAmount: 0, valid: false };
    }
    items.push({ ...p, ageOnTravelDate: age, amount: calculatePassengerTaxForAge(age) });
  }
  return { items, totalAmount: items.reduce((sum, item) => sum + item.amount, 0), valid: true };
}

export function validatePassengerDraft(
  draft: DraftPassengerInput,
  confirmedPassengers: readonly ConfirmedPassenger[],
  editingId: string | null,
  todayYmd: string = getDhakaTodayYmd(),
  lang: TravelLang = 'en'
): TravelPassengerErrors {
  const msg = getTravelTaxMsg(lang);
  const errors: TravelPassengerErrors = {};
  if (draft.medicalAssessment) {
    errors.medical = msg.medicalBlock;
    return errors;
  }
  if (isMaskedPassportValue(draft.passportNumber)) {
    errors.passport = msg.maskedPassportRejected;
    return errors;
  }
  const cleanPassport = sanitizePassport(draft.passportNumber, 12);
  if (!validatePassport(cleanPassport)) {
    errors.passport = msg.invalidPassport;
  } else if (confirmedPassengers.some((p) => p.id !== editingId && sanitizePassport(p.passportNumber, 12) === cleanPassport)) {
    errors.passport = msg.duplicatePassport;
  }
  if (draft.passportType === 'BD') {
    const sample = lookupBdPassport(cleanPassport);
    if (!draft.bdChecked || !sample) {
      errors.lookupUnavailable = Boolean(cleanPassport) && !sample;
      if (!errors.passport) errors.passport = sample ? msg.checkPassportRequired : msg.lookupUnavailable;
    }
  } else {
    if (!draft.passengerName.trim()) errors.passengerName = msg.foreignNameRequired;
    const dobCheck = validateYmdDate(draft.dob, { required: true, maxDate: todayYmd });
    if (!dobCheck.valid) errors.dob = dobCheck.reason === 'required' ? msg.dobRequired : msg.dobInvalid;
    if (!draft.nationality.trim()) errors.nationality = msg.nationalityRequired;
  }
  return errors;
}

export function validateTravelDetails(
  details: TravelDetailsInput,
  passengers: readonly ConfirmedPassenger[],
  todayYmd: string = getDhakaTodayYmd(),
  lang: TravelLang = 'en'
): TravelDetailsErrors {
  const msg = getTravelTaxMsg(lang);
  const errors: TravelDetailsErrors = {};
  if (details.travelMode === 'Land') {
    if (!LAND_PORTS.includes(details.departurePort.trim())) errors.departurePort = msg.landPortRequired;
  } else if (!details.departurePort.trim()) {
    errors.departurePort = msg.waterPortRequired;
  }
  if (!details.destination.trim()) errors.destination = msg.destinationRequired;
  const dateCheck = validateYmdDate(details.travelDate, { required: true, minDate: todayYmd });
  if (!dateCheck.valid) {
    errors.travelDate = dateCheck.reason === 'required' ? msg.travelDateRequired : msg.travelDatePast;
  } else if (passengers.some((p) => calcAgeOnDate(p.dob, details.travelDate) === null)) {
    errors.travelDate = msg.travelDateBeforeDob;
  }
  return errors;
}

export function validateReceiptMobile(
  rawMobile: string,
  totalAmount: number,
  lang: TravelLang = 'en'
): { valid: boolean; normalized: string; error?: string } {
  const trimmed = rawMobile.trim();
  if (totalAmount === 0 && !trimmed) return { valid: true, normalized: '' };
  const normalized = normalizeBdMobile(trimmed);
  if (!normalized || !/^01\d{9}$/.test(normalized)) {
    return { valid: false, normalized: '', error: getTravelTaxMsg(lang).mobileInvalid };
  }
  return { valid: true, normalized };
}

export function validateTravelSubmission(params: {
  passengers: readonly ConfirmedPassenger[];
  details: TravelDetailsInput;
  receiptMobile: string;
  todayYmd?: string;
  lang?: TravelLang;
}): { ok: boolean; error?: string; normalizedMobile: string; breakdown: ReturnType<typeof calculateTravelBreakdown> } {
  const today = params.todayYmd ?? getDhakaTodayYmd();
  const lang = params.lang ?? 'en';
  const msg = getTravelTaxMsg(lang);
  if (params.passengers.length === 0) {
    return { ok: false, error: msg.noConfirmedPassengers, normalizedMobile: '', breakdown: { items: [], totalAmount: 0, valid: false } };
  }
  const seen = new Set<string>();
  for (const p of params.passengers) {
    const clean = sanitizePassport(p.passportNumber, 12);
    if (p.needsRevalidation || isMaskedPassportValue(p.passportNumber) || !validatePassport(clean) || seen.has(clean)) {
      return { ok: false, error: msg.revalidateBeforeContinue, normalizedMobile: '', breakdown: { items: [], totalAmount: 0, valid: false } };
    }
    seen.add(clean);
  }
  const detailErrs = validateTravelDetails(params.details, params.passengers, today, lang);
  if (Object.keys(detailErrs).length > 0) {
    return { ok: false, error: Object.values(detailErrs)[0] ?? msg.preSubmitFailed, normalizedMobile: '', breakdown: { items: [], totalAmount: 0, valid: false } };
  }
  const breakdown = calculateTravelBreakdown(params.passengers, params.details.travelDate);
  if (!breakdown.valid || breakdown.items.reduce((s, i) => s + i.amount, 0) !== breakdown.totalAmount) {
    return { ok: false, error: msg.preSubmitFailed, normalizedMobile: '', breakdown };
  }
  const mob = validateReceiptMobile(params.receiptMobile, breakdown.totalAmount, lang);
  if (!mob.valid) return { ok: false, error: mob.error, normalizedMobile: '', breakdown };
  return { ok: true, normalizedMobile: mob.normalized, breakdown };
}
