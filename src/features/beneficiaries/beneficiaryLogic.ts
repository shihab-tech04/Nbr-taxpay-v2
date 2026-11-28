import { validateBangladeshPhone, validateTin } from '../../design-system/forms';
import type { Beneficiary, PaymentTransaction } from '../../types/tax';

export const APPROVED_RELATIONSHIPS: readonly Beneficiary['relationship'][] = [
  'Father', 'Mother', 'Siblings', 'Son', 'Daughter', 'Spouse', 'Friends', 'Clients', 'Others',
] as const;

export const RELATIONSHIP_I18N: Record<Beneficiary['relationship'], string> = {
  Father: 'father', Mother: 'mother', Siblings: 'siblings', Son: 'son', Daughter: 'daughter',
  Spouse: 'spouse', Friends: 'friends', Clients: 'clients', Others: 'others',
};

export function formatBeneficiaryDisplayTag(
  b: Pick<Beneficiary, 'relationship' | 'relationshipNote'>,
  t: (key: string) => string
): string {
  if (b.relationship === 'Others' && b.relationshipNote?.trim()) {
    return b.relationshipNote.trim();
  }
  return t(RELATIONSHIP_I18N[b.relationship] ?? 'others');
}

export function formatBeneficiaryDisplayName(
  b: Pick<Beneficiary, 'name' | 'tin' | 'relationship' | 'relationshipNote'>,
  t: (key: string) => string
): string {
  const cleanName = b.name.trim();
  if (cleanName) return cleanName;
  return `${formatBeneficiaryDisplayTag(b, t)} (${b.tin})`;
}

export interface BeneficiaryInputPayload {
  name: string;
  tin: string;
  relationship: Beneficiary['relationship'];
  relationshipNote?: string;
  listId?: string;
  phone?: string;
}

export interface BeneficiaryFormErrors {
  name?: string;
  tin?: string;
  relationship?: string;
  relationshipNote?: string;
  phone?: string;
}

export function validateBeneficiaryInput(
  input: BeneficiaryInputPayload,
  existing: readonly Beneficiary[],
  editingId?: string,
  lang: 'en' | 'bn' = 'en'
): BeneficiaryFormErrors {
  const isBn = lang === 'bn';
  const errors: BeneficiaryFormErrors = {};
  const cleanTin = input.tin.trim();
  const cleanPhone = (input.phone ?? '').trim();
  const cleanNote = (input.relationshipNote ?? '').trim();

  if (!validateTin(cleanTin).valid) {
    errors.tin = isBn ? 'অনুগ্রহ করে ১২ ডিজিটের সঠিক টিআইএন লিখুন।' : 'Please enter a valid 12-digit numeric TIN.';
  } else if (existing.some((b) => b.id !== editingId && b.tin === cleanTin)) {
    errors.tin = isBn ? 'এই ১২ ডিজিটের টিআইএনসহ একজন প্রাপক ইতিমধ্যে সংরক্ষিত আছে।' : 'A beneficiary with this 12-digit TIN already exists.';
  }
  if (!APPROVED_RELATIONSHIPS.includes(input.relationship)) {
    errors.relationship = isBn ? 'সম্পর্ক নির্বাচন আবশ্যক।' : 'Relationship selection is required.';
  }
  if (input.relationship === 'Others') {
    if (cleanNote.length < 1 || cleanNote.length > 80) {
      errors.relationshipNote = isBn ? 'কাস্টম সম্পর্কের বিবরণ ১–৮০ অক্ষরের মধ্যে হতে হবে।' : 'Custom relationship label must be between 1 and 80 characters.';
    } else if (APPROVED_RELATIONSHIPS.some((rel) => rel.toLowerCase() === cleanNote.toLowerCase())) {
      errors.relationshipNote = isBn ? 'মানক সম্পর্কগুলোর পুনরাবৃত্তি না করে ড্রপডাউন থেকে নির্বাচন করুন।' : 'Use the matching dropdown option instead of duplicating a standard label.';
    }
  }
  if (cleanPhone && !validateBangladeshPhone(cleanPhone)) {
    errors.phone = isBn ? 'সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন (01XXXXXXXXX)।' : 'Enter a valid Bangladesh mobile number (01XXXXXXXXX).';
  }
  return errors;
}

export interface BeneficiaryTimelineEntry {
  transaction: PaymentTransaction;
  allocatedAmount: number;
  headSummary: string;
  assessmentYears: string[];
}

export function getBeneficiaryTimelineEntries(
  transactions: readonly PaymentTransaction[],
  ownerScope: string,
  beneficiaryTin: string
): BeneficiaryTimelineEntry[] {
  const entries: BeneficiaryTimelineEntry[] = [];
  for (const tx of transactions) {
    if (tx.ownerScope && tx.ownerScope !== ownerScope) continue;
    const matchingItems = tx.items.filter((item) => item.taxpayerTin === beneficiaryTin);
    const isDirectBeneficiary = tx.beneficiaryTin === beneficiaryTin;
    if (matchingItems.length === 0 && !isDirectBeneficiary) continue;
    const relevantItems = matchingItems.length > 0 ? matchingItems : tx.items;
    const allocatedAmount = matchingItems.length > 0
      ? matchingItems.reduce((sum, item) => sum + item.amount, 0)
      : tx.totalAmount;
    const headSummary = relevantItems.map((item) => `[${item.headCode}] ${item.headNameEn}`).join(', ');
    const assessmentYears = [...new Set(relevantItems.map((item) => item.assessmentYear))];
    entries.push({ transaction: tx, allocatedAmount, headSummary, assessmentYears });
  }
  return entries.sort((a, b) => Date.parse(b.transaction.createdAt) - Date.parse(a.transaction.createdAt));
}
