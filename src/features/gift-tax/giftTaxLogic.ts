import { parseCurrencyAmount, validateCurrencyAmount, validateGiftDate, validateTin } from '../../design-system/forms';
import { lookupTinIdentity } from '../../shared/accountSession';
import type { Beneficiary, Language } from '../../types/tax';
import type { GiftFormErrors, GiftPartyRecord, GiftRelationship, GiftTaxBracketLine, GiftTaxCalculation } from './giftTaxTypes';
import { APPROVED_GIFT_RELATIONSHIPS } from './giftTaxTypes';

export { buildGiftTransactionPayload, resolveGiftTaxRouteSeed } from './giftTaxFlowUtils';

export const GIFT_EXEMPT_ALLOWANCE = 20000;
export const GIFT_SUGGESTED_TINS: readonly string[] = ['882349102384', '992384102938', '773492019283', '112938475601', '112233445566', '445566778899'];

const SAMPLE_TAXPAYERS: readonly GiftPartyRecord[] = [
  { tin: '992384102938', name: 'Mrs. Fatema Begum', classification: 'Individual' },
  { tin: '773492019283', name: 'Tanvir Islam', classification: 'Individual' },
  { tin: '112938475601', name: 'GreenCorp Ltd.', classification: 'Company' },
  { tin: '445566778899', name: 'Karim Chowdhury', classification: 'Individual' },
  { tin: '556677889900', name: 'Farhana Rahman', classification: 'Individual' },
];

const BRACKET_SCHEDULE = [
  { id: 'b1', cap: 500000, rate: 0.05, labelEn: 'First ৳500,000 @ 5%', labelBn: 'প্রথম ৫,০০,০০০ টাকা @ ৫%' },
  { id: 'b2', cap: 1000000, rate: 0.1, labelEn: 'Next ৳1,000,000 @ 10%', labelBn: 'পরবর্তী ১০,০০,০০০ টাকা @ ১০%' },
  { id: 'b3', cap: 2000000, rate: 0.15, labelEn: 'Next ৳2,000,000 @ 15%', labelBn: 'পরবর্তী ২০,০০,০০০ টাকা @ ১৫%' },
  { id: 'b4', cap: Number.POSITIVE_INFINITY, rate: 0.2, labelEn: 'Remainder @ 20%', labelBn: 'অবশিষ্ট অংশ @ ২০%' },
] as const;

export function lookupGiftTaxpayer(rawTin: string, beneficiaries: readonly Beneficiary[] = []): GiftPartyRecord | null {
  const cleanTin = rawTin.trim();
  if (!/^\d{12}$/.test(cleanTin)) return null;
  const acct = lookupTinIdentity(cleanTin);
  if (acct) return { tin: acct.tin, name: acct.profile.name, classification: acct.profile.taxpayerType };
  const ben = beneficiaries.find((b) => b.tin.trim() === cleanTin);
  if (ben) return { tin: cleanTin, name: ben.name.trim() || 'Saved Beneficiary', classification: 'Saved Beneficiary' };
  const sample = SAMPLE_TAXPAYERS.find((p) => p.tin === cleanTin);
  return sample ? { ...sample } : null;
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
    errors.relationship = isBn ? 'গ্রহীতার সম্পর্ক নির্বাচন করুন।' : 'Select the Donee relationship.';
  }
  const tagLen = input.relationshipTag.trim().length;
  if (tagLen < 1 || tagLen > 80) {
    errors.relationshipTag = isBn ? 'সম্পর্ক / ট্যাগ ১ থেকে ৮০ অক্ষরের মধ্যে হতে হবে।' : 'Relationship tag is required (1–80 characters).';
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
  const parsed = parseCurrencyAmount(input.giftAmountInput) ?? 0;
  if (!amountCheck.valid) {
    errors.giftAmount = isBn ? 'বৈধ দানের মূল্য (টাকা) লিখুন।' : 'Enter a valid Gift Value amount.';
  } else if (parsed <= GIFT_EXEMPT_ALLOWANCE) {
    errors.giftAmount = isBn ? 'দানের মূল্য ২০,০০০ টাকার অব্যাহতি সীমার চেয়ে বেশি হতে হবে।' : 'Gift Value must exceed the ৳20,000 exempt allowance to calculate a payable estimate.';
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
