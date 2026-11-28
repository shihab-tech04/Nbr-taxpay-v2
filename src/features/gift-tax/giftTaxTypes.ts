import type { GiftDetails, GiftPartyRecord } from '../../types/giftTax';
import type { Beneficiary } from '../../types/tax';

export type GiftRelationship = Beneficiary['relationship'];

export const APPROVED_GIFT_RELATIONSHIPS: readonly GiftRelationship[] = [
  'Father',
  'Mother',
  'Siblings',
  'Son',
  'Daughter',
  'Spouse',
  'Friends',
  'Clients',
  'Others',
] as const;

export interface GiftTaxBracketLine {
  id: string;
  labelEn: string;
  labelBn: string;
  rate: number;
  taxableSlice: number;
  taxAmount: number;
}

export interface GiftTaxCalculation {
  giftAmount: number;
  allowance: number;
  taxableAmount: number;
  calculatedTax: number;
  brackets: GiftTaxBracketLine[];
}

export interface GiftFormErrors {
  donor?: string;
  donee?: string;
  relationship?: string;
  relationshipTag?: string;
  giftAmount?: string;
  giftDate?: string;
  description?: string;
  remarks?: string;
}

export interface RemovedPartyUndoState {
  role: 'donor' | 'donee';
  party: GiftPartyRecord;
  relationship?: GiftRelationship | '';
  relationshipTag?: string;
}

export interface GiftRouteState {
  draftId?: string;
  reuseTxRef?: string;
  reuseTx?: unknown;
}

export type { GiftDetails, GiftPartyRecord };
