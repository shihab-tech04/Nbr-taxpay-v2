import {
  parseCurrencyAmount,
  validateCurrencyAmount,
  validateGiftDate,
  validateTin,
} from '../../design-system/forms';

export const GIFT_TAX_RATE = 0.05;

export interface GiftFormErrors {
  donorTin?: string;
  donorName?: string;
  doneeTin?: string;
  doneeName?: string;
  giftAmount?: string;
  giftDate?: string;
  description?: string;
}

export function calculateGiftTaxAmount(giftAmountInput: string): {
  giftAmount: number;
  calculatedTax: number;
} {
  const giftAmount = parseCurrencyAmount(giftAmountInput) ?? 0;
  return {
    giftAmount,
    calculatedTax: Math.round(giftAmount * GIFT_TAX_RATE),
  };
}

export function validateGiftPartiesStep(
  input: { donorTin: string; donorName: string; doneeTin: string; doneeName: string },
  messages: { invalidTin: string; requiredDonorName: string; requiredDoneeName: string }
): GiftFormErrors {
  const errors: GiftFormErrors = {};
  if (!validateTin(input.donorTin).valid) errors.donorTin = messages.invalidTin;
  if (!input.donorName.trim()) errors.donorName = messages.requiredDonorName;
  if (!validateTin(input.doneeTin).valid) errors.doneeTin = messages.invalidTin;
  if (!input.doneeName.trim()) errors.doneeName = messages.requiredDoneeName;
  return errors;
}

export function validateGiftValuationStep(
  input: { giftAmountInput: string; description: string; giftDate?: string },
  messages: {
    amountMin: string;
    amountInvalid: string;
    requiredDescription: string;
    requiredGiftDate?: string;
    invalidGiftDate?: string;
    futureGiftDate?: string;
  }
): GiftFormErrors {
  const errors: GiftFormErrors = {};
  const amountCheck = validateCurrencyAmount(input.giftAmountInput, {
    minAmount: 1000,
    decimalScale: 2,
    required: true,
  });
  if (!amountCheck.valid) {
    errors.giftAmount =
      amountCheck.reason === 'min' || amountCheck.reason === 'required'
        ? messages.amountMin
        : messages.amountInvalid;
  }
  if (input.giftDate !== undefined) {
    const dateCheck = validateGiftDate(input.giftDate);
    if (!dateCheck.valid) {
      errors.giftDate =
        dateCheck.reason === 'future'
          ? messages.futureGiftDate ?? 'Gift date cannot exceed today.'
          : dateCheck.reason === 'required'
            ? messages.requiredGiftDate ?? messages.invalidGiftDate ?? 'Please select a date.'
            : messages.invalidGiftDate ?? 'Please enter a valid date.';
    }
  }
  if (!input.description.trim()) {
    errors.description = messages.requiredDescription;
  }
  return errors;
}
