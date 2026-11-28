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
  relationshipNote?: string;
  phone?: string;
}

export function validateBeneficiaryInput(
  input: BeneficiaryInputPayload,
  existing: readonly Beneficiary[],
  editingId?: string
): BeneficiaryFormErrors {
  const errors: BeneficiaryFormErrors = {};
  const cleanName = input.name.trim();
  const cleanTin = input.tin.trim();
  const cleanPhone = (input.phone ?? '').trim();
  const cleanNote = (input.relationshipNote ?? '').trim();

  if (!cleanName) errors.name = 'Beneficiary full name is required.';
  if (!validateTin(cleanTin).valid) {
    errors.tin = 'Please enter a valid 12-digit numeric TIN.';
  } else if (existing.some((b) => b.id !== editingId && b.tin === cleanTin)) {
    errors.tin = 'A beneficiary with this 12-digit TIN already exists.';
  }
  if (input.relationship === 'Others') {
    if (cleanNote.length < 1 || cleanNote.length > 80) {
      errors.relationshipNote = 'Custom relationship label must be between 1 and 80 characters.';
    } else if (APPROVED_RELATIONSHIPS.some((rel) => rel.toLowerCase() === cleanNote.toLowerCase())) {
      errors.relationshipNote = 'Use the matching dropdown option instead of duplicating a standard label.';
    }
  }
  if (cleanPhone && !validateBangladeshPhone(cleanPhone)) {
    errors.phone = 'Enter a valid Bangladesh mobile number (01XXXXXXXXX).';
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
