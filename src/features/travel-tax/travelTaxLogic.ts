import { validatePassport } from '../../design-system/forms';

export type TravelClass = 'Economy' | 'Business';

export interface TravelFormErrors {
  passport?: string;
  passengerName?: string;
}

export function resolveDestinationBaseTax(dest: string): number {
  if (dest.includes('India')) return 2000;
  if (dest.includes('SAARC')) return 3000;
  return 5000;
}

export function calculateTravelDisplayTotal(baseAmount: number, travelClass: TravelClass): number {
  return travelClass === 'Business' ? baseAmount + 1000 : baseAmount;
}

export function validateTravelFormStep(
  input: { passportNumber: string; passengerName: string },
  messages: { invalidPassport: string; requiredPassengerName: string }
): TravelFormErrors {
  const errors: TravelFormErrors = {};
  if (!validatePassport(input.passportNumber)) {
    errors.passport = messages.invalidPassport;
  }
  if (!input.passengerName.trim()) {
    errors.passengerName = messages.requiredPassengerName;
  }
  return errors;
}
