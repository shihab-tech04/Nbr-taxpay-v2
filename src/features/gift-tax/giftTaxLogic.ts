import { parseCurrencyAmount, validateCurrencyAmount, validateGiftDate, validateTin } from '../../design-system/forms';
import { DIRECTORY_SUGGESTED_TINS, lookupTaxpayerDirectoryRecord } from '../../shared/taxpayerDirectory';
import type { Beneficiary, Language } from '../../types/tax';
import type {
  GiftFormErrors, GiftPartyRecord, GiftRelationship, GiftTaxBracketLine, GiftTaxCalculation, RemovedPartyUndoState,
} from './giftTaxTypes';
import { APPROVED_GIFT_RELATIONSHIPS } from './giftTaxTypes';

export { buildGiftTransactionPayload, resolveGiftTaxRouteSeed } from './giftTaxFlowUtils';

export const GIFT_EXEMPT_ALLOWANCE = 20000;
export const GIFT_SUGGESTED_TINS: readonly string[] = DIRECTORY_SUGGESTED_TINS;

const BRACKET_SCHEDULE = [
  { id: 'b1', cap: 500000, rate: 0.05, labelEn: 'First ৳500,000 @ 5%', labelBn: 'প্রথম ৫,০০,০০০ টাকা @ ৫%' },
  { id: 'b2', cap: 1000000, rate: 0.1, labelEn: 'Next ৳1,000,000 @ 10%', labelBn: 'পরবর্তী ১০,০০,০০০ টাকা @ ১০%' },
  { id: 'b3', cap: 2000000, rate: 0.15, labelEn: 'Next ৳2,000,000 @ 15%', labelBn: 'পরবর্তী ২০,০০,০০০ টাকা @ ১৫%' },
  { id: 'b4', cap: Number.POSITIVE_INFINITY, rate: 0.2, labelEn: 'Remainder @ 20%', labelBn: 'অবশিষ্ট অংশ @ ২০%' },
] as const;

export function lookupGiftTaxpayer(rawTin: string, beneficiaries: readonly Beneficiary[] = []): GiftPartyRecord | null {
  return lookupTaxpayerDirectoryRecord(rawTin, beneficiaries);
}

export function isGiftRelationshipValid(relationship: GiftRelationship | '', relationshipTag: string): boolean {
  if (!relationship || !APPROVED_GIFT_RELATIONSHIPS.includes(relationship)) return false;
  if (relationship === 'Others') {
    const len = relationshipTag.trim().length;
    return len >= 1 && len <= 80;
  }
  return true;
}

export function canUndoGiftPartyRemoval(
  undoParty: RemovedPartyUndoState | null,
  donor: GiftPartyRecord | null,
  donee: GiftPartyRecord | null
): { ok: true } | { ok: false; reason: 'empty' | 'duplicate_tin' } {
  if (!undoParty) return { ok: false, reason: 'empty' };
  if (undoParty.role === 'donor' && donee && donee.tin === undoParty.party.tin) {
    return { ok: false, reason: 'duplicate_tin' };
  }
  if (undoParty.role === 'donee' && donor && donor.tin === undoParty.party.tin) {
    return { ok: false, reason: 'duplicate_tin' };
  }
  return { ok: true };
}

export function calculateGiftTaxAmount(giftAmountInput: string): GiftTaxCalculation {
  const giftAmount = parseCurrencyAmount(giftAmountInput) ?? 0;
  const allowance = giftAmount > 0 ? Math.min(giftAmount, GIFT_EXEMPT_ALLOWANCE) : 0;
  const taxableAmount = Math.max(0, giftAmount - GIFT_EXEMPT_ALLOWANCE);
  let remaining = taxableAmount;
  const brackets: GiftTaxBracketLine[] = [];
  let total = 0;

  for (const tier of BRACKET_SCHEDULE) {
    if (remaining <= 0) break;
    const slice = Number.isFinite(tier.cap) ? Math.min(remaining, tier.cap) : remaining;
    const taxAmount = Math.round(slice * tier.rate);
    brackets.push({ id: tier.id, labelEn: tier.labelEn, labelBn: tier.labelBn, rate: tier.rate, taxableSlice: slice, taxAmount });
    total += taxAmount;
    remaining -= slice;
  }

  return { giftAmount, allowance, taxableAmount, calculatedTax: Math.round(total), brackets };
}

export function getRelationshipLabel(rel: GiftRelationship, lang: Language): string {
  const bnMap: Record<GiftRelationship, string> = {
    Father: 'পিতা', Mother: 'মাতা', Siblings: 'ভাই/বোন', Son: 'পুত্র', Daughter: 'কন্যা', Spouse: 'স্বামী/স্ত্রী', Friends: 'বন্ধু', Clients: 'ক্লায়েন্ট', Others: 'অন্যান্য',
  };
  return lang === 'bn' ? bnMap[rel] : rel;
}

export function validateGiftPartiesStep(
  input: { donor: GiftPartyRecord | null; donee: GiftPartyRecord | null; relationship: GiftRelationship | ''; relationshipTag: string },
  lang: Language = 'en'
): GiftFormErrors {
  const isBn = lang === 'bn';
  const errors: GiftFormErrors = {};
  if (!input.donor || !validateTin(input.donor.tin).valid || !input.donor.name.trim()) {
    errors.donor = isBn ? 'অনুগ্রহ করে বৈধ ১২ ডিজিটের দাতার (Donor) টিআইএন অনুসন্ধান করে যোগ করুন।' : 'Search and add a confirmed Donor with a valid 12-digit TIN.';
  }
  if (!input.donee || !validateTin(input.donee.tin).valid || !input.donee.name.trim()) {
    errors.donee = isBn ? 'অনুগ্রহ করে বৈধ ১২ ডিজিটের গ্রহীতার (Donee) টিআইএন অনুসন্ধান করে যোগ করুন।' : 'Search and add a confirmed Donee with a valid 12-digit TIN.';
  } else if (input.donor && input.donor.tin === input.donee.tin) {
    errors.donee = isBn ? 'দাতা এবং গ্রহীতার টিআইএন অবশ্যই ভিন্ন হতে হবে।' : 'Donor and Donee must have distinct 12-digit TINs.';
  }
  if (!input.relationship || !APPROVED_GIFT_RELATIONSHIPS.includes(input.relationship)) {
    errors.relationship = isBn ? 'গ্রহীতার সম্পর্ক নির্বাচন করুন।' : 'Select a valid Donee relationship.';
  } else if (input.relationship === 'Others') {
    const tagLen = input.relationshipTag.trim().length;
    if (tagLen < 1 || tagLen > 80) {
      errors.relationshipTag = isBn ? 'অন্যান্য সম্পর্কের বিবরণ ১ থেকে ৮০ অক্ষরের মধ্যে হতে হবে।' : 'Custom relationship description is required for Others (1–80 characters).';
    }
  }
  return errors;
}

export function validateGiftValuationStep(
  input: { giftAmountInput: string; description: string; giftDate: string; remarks?: string },
  lang: Language = 'en',
  todayYmd?: string
): GiftFormErrors {
  const isBn = lang === 'bn';
  const errors: GiftFormErrors = {};
  const amountCheck = validateCurrencyAmount(input.giftAmountInput, { minAmount: 1, decimalScale: 2, required: true });
  if (!amountCheck.valid) {
    errors.giftAmount = isBn ? 'বৈধ দানের মূল্য (সর্বনিম্ন ১ টাকা) লিখুন।' : 'Enter a valid Gift Value amount (minimum ৳1).';
  }
  const dateCheck = validateGiftDate(input.giftDate, todayYmd);
  if (!dateCheck.valid) {
    errors.giftDate =
      dateCheck.reason === 'future'
        ? (isBn ? 'ভবিষ্যতের তারিখ গ্রহণযোগ্য নয়।' : 'Gift date cannot be in the future.')
        : dateCheck.reason === 'required'
          ? (isBn ? 'দানের তারিখ নির্বাচন করুন।' : 'Select the date of gift.')
          : (isBn ? 'বৈধ দানের তারিখ দিন।' : 'Enter a valid gift date.');
  }
  const desc = input.description.trim();
  if (!desc || desc.length > 300) {
    errors.description = isBn ? 'দানের বিবরণ লিখুন (সর্বোচ্চ ৩০০ অক্ষর)।' : 'Gift description is required (max 300 characters).';
  }
  if ((input.remarks ?? '').trim().length > 300) {
    errors.remarks = isBn ? 'মন্তব্য সর্বোচ্চ ৩০০ অক্ষরের মধ্যে হতে হবে।' : 'Remarks cannot exceed 300 characters.';
  }
  return errors;
}
