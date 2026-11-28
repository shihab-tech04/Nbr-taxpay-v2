import { getDhakaTodayYmd, isValidYmd, validateYmdDate } from '../../design-system/dates/dateUtils';
import { sanitizePassport, validatePassport } from '../../design-system/forms';
import { normalizeBdMobile } from '../../shared/accountSession';
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

export function lookupBdPassport(rawPassport: string): SamplePassportEntry | null {
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
  if (!clean) return '****';
  if (clean.length <= 4) return '*'.repeat(clean.length);
  return `${clean.slice(0, 2)}${'*'.repeat(clean.length - 4)}${clean.slice(-2)}`;
}

export function calcAgeOnDate(dobYmd: string, travelYmd: string): number | null {
  if (!isValidYmd(dobYmd) || !isValidYmd(travelYmd) || dobYmd > travelYmd) {
    return null;
  }
  const [by, bm, bd] = dobYmd.split('-').map(Number);
  const [ty, tm, td] = travelYmd.split('-').map(Number);
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) {
    age -= 1;
  }
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
    const age = calcAgeOnDate(p.dob, travelDate);
    if (age === null || p.needsRevalidation) {
      return { items: [], totalAmount: 0, valid: false };
    }
    const amount = calculatePassengerTaxForAge(age);
    items.push({ ...p, ageOnTravelDate: age, amount });
  }
  return {
    items,
    totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
    valid: true,
  };
}

export function validatePassengerDraft(
  draft: DraftPassengerInput,
  confirmedPassengers: readonly ConfirmedPassenger[],
  editingId: string | null,
  todayYmd: string = getDhakaTodayYmd()
): TravelPassengerErrors {
  const errors: TravelPassengerErrors = {};
  if (draft.medicalAssessment) {
    errors.medical = 'Medical assessment requests require individual evaluation at the departure port and cannot continue online.';
    return errors;
  }
  const cleanPassport = sanitizePassport(draft.passportNumber, 12);
  if (!validatePassport(cleanPassport)) {
    errors.passport = 'Enter a valid passport number (6–12 alphanumeric characters).';
  } else if (
    confirmedPassengers.some(
      (p) => p.id !== editingId && sanitizePassport(p.passportNumber, 12) === cleanPassport
    )
  ) {
    errors.passport = 'Duplicate passport number: this passenger is already confirmed.';
  }
  if (draft.passportType === 'BD') {
    const sample = lookupBdPassport(cleanPassport);
    if (!draft.bdChecked || !sample) {
      errors.lookupUnavailable = Boolean(cleanPassport) && !sample;
      if (!errors.passport) {
        errors.passport = sample
          ? 'Click Check Passport to verify Bangladeshi passport details.'
          : 'Passport lookup unavailable for this number. Use a valid sample passport.';
      }
    }
  } else {
    if (!draft.passengerName.trim()) {
      errors.passengerName = 'Passport holder full name is required.';
    }
    const dobCheck = validateYmdDate(draft.dob, { required: true, maxDate: todayYmd });
    if (!dobCheck.valid) {
      errors.dob = dobCheck.reason === 'required' ? 'Date of birth is required.' : 'Enter a valid date of birth on or before today.';
    }
    if (!draft.nationality.trim()) {
      errors.nationality = 'Nationality is required for foreign passport holders.';
    }
  }
  return errors;
}

export function validateTravelDetails(
  details: TravelDetailsInput,
  passengers: readonly ConfirmedPassenger[],
  todayYmd: string = getDhakaTodayYmd()
): TravelDetailsErrors {
  const errors: TravelDetailsErrors = {};
  if (details.travelMode === 'Land') {
    if (!LAND_PORTS.includes(details.departurePort.trim())) {
      errors.departurePort = 'Select an approved land departure port.';
    }
  } else if (!details.departurePort.trim()) {
    errors.departurePort = 'Enter the water departure port name.';
  }
  if (!details.destination.trim()) {
    errors.destination = 'Destination country or city is required.';
  }
  const dateCheck = validateYmdDate(details.travelDate, { required: true, minDate: todayYmd });
  if (!dateCheck.valid) {
    errors.travelDate =
      dateCheck.reason === 'required'
        ? 'Planned travel date is required.'
        : 'Travel date cannot be in the past (Asia/Dhaka).';
  } else if (passengers.some((p) => calcAgeOnDate(p.dob, details.travelDate) === null)) {
    errors.travelDate = 'Travel date cannot be earlier than a passenger date of birth.';
  }
  return errors;
}

export function validateReceiptMobile(rawMobile: string, totalAmount: number): { valid: boolean; normalized: string; error?: string } {
  const trimmed = rawMobile.trim();
  if (totalAmount === 0 && !trimmed) {
    return { valid: true, normalized: '' };
  }
  const normalized = normalizeBdMobile(trimmed);
  if (!normalized || !/^01\d{9}$/.test(normalized)) {
    return { valid: false, normalized: '', error: 'Enter a valid 11-digit receipt mobile number (01XXXXXXXXX).' };
  }
  return { valid: true, normalized };
}
