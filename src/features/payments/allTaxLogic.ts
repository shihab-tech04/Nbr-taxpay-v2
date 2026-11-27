import { validateCurrencyAmount } from '../../design-system/forms';
import { TAX_HEADS } from '../../shared/mockData';
import type { PaymentLineItem } from '../../types/tax';

export const INITIAL_ALL_TAX_ITEMS: PaymentLineItem[] = [
  {
    headId: TAX_HEADS[0].id,
    headCode: TAX_HEADS[0].code,
    headNameEn: TAX_HEADS[0].nameEn,
    headNameBn: TAX_HEADS[0].nameBn,
    assessmentYear: '2025-2026',
    amount: 15000,
    remarks: 'Annual return submission',
  },
];

export type AddItemResult =
  | { ok: true; item: PaymentLineItem }
  | { ok: false; reason: 'min' | 'invalid' | 'missing_head' };

export function validateAndBuildTaxItem(input: {
  selectedHeadId: string;
  amountInput: string;
  assessmentYear: string;
  remarks: string;
}): AddItemResult {
  const head = TAX_HEADS.find((h) => h.id === input.selectedHeadId);
  const amountCheck = validateCurrencyAmount(input.amountInput, {
    minAmount: 100,
    decimalScale: 2,
    required: true,
  });

  if (!amountCheck.valid || amountCheck.numericValue === null) {
    return {
      ok: false,
      reason: amountCheck.reason === 'min' || amountCheck.reason === 'required' ? 'min' : 'invalid',
    };
  }

  if (!head) {
    return { ok: false, reason: 'missing_head' };
  }

  return {
    ok: true,
    item: {
      headId: head.id,
      headCode: head.code,
      headNameEn: head.nameEn,
      headNameBn: head.nameBn,
      assessmentYear: input.assessmentYear,
      amount: amountCheck.numericValue,
      remarks: input.remarks,
    },
  };
}

export function calculateItemsTotal(items: readonly PaymentLineItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}
