import { validatePassport } from '../../design-system/forms';

export type TravelClass = 'Economy' | 'Business';
export type TravelMode = 'Air' | 'Land' | 'Water';
export type DestinationZone = 'India' | 'SAARC' | 'Other';
export type PassportType = 'BD' | 'Foreign';
export type PassengerCategory = 'Adult' | 'Child' | 'Medical Exempt' | 'Diplomat';

export interface TravelPassenger {
  id: string;
  passengerName: string;
  passportNumber: string;
  passportType: PassportType;
  travelMode: TravelMode;
  destinationZone: DestinationZone;
  travelClass: TravelClass;
  passengerCategory: PassengerCategory;
  medicalExempt: boolean;
}

export interface TravelFormErrors {
  passengers?: Record<string, { passport?: string; passengerName?: string }>;
  general?: string;
}

export function resolveDestinationBaseTax(mode: TravelMode, zone: DestinationZone): number {
  if (mode === 'Air') {
    if (zone === 'India') return 2000;
    if (zone === 'SAARC') return 3000;
    return 5000;
  }
  if (mode === 'Land') {
    if (zone === 'India') return 1000;
    if (zone === 'SAARC') return 1500;
    return 2500;
  }
  // Water
  if (zone === 'India') return 1200;
  if (zone === 'SAARC') return 1800;
  return 3000;
}

export function calculatePassengerTax(p: TravelPassenger): number {
  if (p.passengerCategory === 'Diplomat' || (p.passengerCategory === 'Medical Exempt' && p.medicalExempt)) {
    return 0;
  }
  const base = resolveDestinationBaseTax(p.travelMode, p.destinationZone);
  const classSurcharge = p.travelClass === 'Business' ? 1000 : 0;
  const childMultiplier = p.passengerCategory === 'Child' ? 0.5 : 1.0;
  return Math.round((base + classSurcharge) * childMultiplier);
}

export function calculateTotalTravelTax(passengers: readonly TravelPassenger[]): number {
  return passengers.reduce((sum, p) => sum + calculatePassengerTax(p), 0);
}

export function validateTravelFormStep(
  passengers: readonly TravelPassenger[],
  messages: { invalidPassport: string; requiredPassengerName: string }
): TravelFormErrors {
  const errors: TravelFormErrors = { passengers: {} };
  let hasError = false;

  passengers.forEach((p, idx) => {
    const pErrors: { passport?: string; passengerName?: string } = {};
    if (!validatePassport(p.passportNumber)) {
      pErrors.passport = messages.invalidPassport;
      hasError = true;
    }
    if (!p.passengerName.trim()) {
      pErrors.passengerName = messages.requiredPassengerName;
      hasError = true;
    }
    if (Object.keys(pErrors).length > 0 && errors.passengers) {
      errors.passengers[p.id || String(idx)] = pErrors;
    }
  });

  return hasError ? errors : {};
}
