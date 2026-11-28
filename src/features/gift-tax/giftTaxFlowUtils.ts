import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import { isValidYmd } from '../../design-system/forms';
import type { PaymentDraft, PaymentTransaction } from '../../types/tax';
import type { GiftDetails, GiftPartyRecord, GiftRelationship } from './giftTaxTypes';

export function buildGiftTransactionPayload(params: {
  donor: GiftPartyRecord;
  donee: GiftPartyRecord;
  relationship: GiftRelationship;
  relationshipTag: string;
  giftValue: number;
  giftDate: string;
  description: string;
  remarks?: string;
  calculatedTax: number;
  assessmentYear?: string;
  channel: ActivePaymentChannel;
  isAuthenticated: boolean;
  activeScope: string;
}): Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'> {
  if (!isValidYmd(params.giftDate)) {
    throw new Error(`Invalid giftDate "${params.giftDate}"; expected YYYY-MM-DD.`);
  }
  const cleanDesc = params.description.trim();
  const cleanRemarks = params.remarks?.trim() || undefined;
  const cleanTag = params.relationshipTag.trim() || params.relationship;
  const ay = params.assessmentYear?.trim() || '2025-2026';
  const giftDetails: GiftDetails = {
    donorTin: params.donor.tin,
    donorName: params.donor.name,
    doneeTin: params.donee.tin,
    doneeName: params.donee.name,
    relationship: params.relationship,
    relationshipTag: cleanTag,
    giftValue: params.giftValue,
    giftDate: params.giftDate,
    description: cleanDesc,
    remarks: cleanRemarks,
    estimatedTax: params.calculatedTax,
    creditAttributionRole: 'donor',
    throughName: params.donee.name,
    throughTin: params.donee.tin,
    onBehalfOfName: params.donor.name,
    onBehalfOfTin: params.donor.tin,
  };
  return {
    taxpayerTin: params.donor.tin,
    taxpayerName: params.donor.name,
    ownerScope: params.activeScope,
    originMode: params.isAuthenticated ? 'signed_in' : 'walk_in',
    beneficiaryTin: params.donee.tin,
    beneficiaryName: params.donee.name,
    category: 'gift_tax',
    giftDate: params.giftDate,
    giftDetails,
    items: [{
      headId: 'h6', headCode: '0130', headNameEn: 'Gift Tax (দানকর)', headNameBn: 'দানকর (Gift Tax)',
      assessmentYear: ay, amount: params.calculatedTax, taxpayerTin: params.donor.tin, taxpayerName: params.donor.name,
      category: 'gift_tax', remarks: cleanRemarks ? `${cleanDesc} · ${cleanRemarks}` : cleanDesc,
    }],
    totalAmount: params.calculatedTax,
    paymentChannel: params.channel,
    status: 'Completed',
  };
}

export function resolveGiftTaxRouteSeed(params: {
  routeState: { draftId?: string; reuseTxRef?: string; reuseTx?: unknown } | null;
  draftIdParam?: string | null;
  reuseRefParam?: string | null;
  drafts: readonly PaymentDraft[];
  transactions: readonly PaymentTransaction[];
  activeScope: string;
  isAuthenticated: boolean;
}) {
  const emptySeed = (rejected: boolean) => ({
    rejected, donor: null, donee: null, relationship: '' as const, relationshipTag: '',
    giftAmountInput: '', giftDate: '', description: '', remarks: '', assessmentYear: '2025-2026', stage: 1 as const,
  });
  const { routeState, draftIdParam, reuseRefParam, drafts, transactions, activeScope, isAuthenticated } = params;
  if (routeState?.reuseTx !== undefined) return emptySeed(true);

  const draftId = (routeState?.draftId || draftIdParam || '').trim();
  if (draftId) {
    const foundDraft = isAuthenticated ? drafts.find((d) => d.id === draftId && d.category === 'gift_tax') ?? null : null;
    if (!foundDraft?.giftDraft) return emptySeed(true);
    const gd = foundDraft.giftDraft;
    return {
      rejected: false, donor: gd.donor, donee: gd.donee, relationship: (gd.donee?.relationship ?? '') as GiftRelationship | '',
      relationshipTag: gd.donee?.relationshipTag ?? '', giftAmountInput: gd.giftAmountInput, giftDate: gd.giftDate,
      description: gd.description, remarks: gd.remarks ?? '', assessmentYear: foundDraft.items[0]?.assessmentYear || '2025-2026', stage: (gd.stage ?? 1) as 1 | 2 | 3,
    };
  }

  const ref = (routeState?.reuseTxRef || reuseRefParam || '').trim();
  if (!ref) return emptySeed(false);
  const tx = transactions.find((t) => (t.transactionRef === ref || t.id === ref) && t.category === 'gift_tax' && (!t.ownerScope || t.ownerScope === activeScope)) ?? null;
  if (!tx) return emptySeed(true);
  const gd = tx.giftDetails;
  const rel = gd?.relationship ?? 'Others';
  return {
    rejected: false,
    donor: { tin: gd?.donorTin ?? tx.taxpayerTin, name: gd?.donorName ?? tx.taxpayerName },
    donee: tx.beneficiaryTin ? { tin: gd?.doneeTin ?? tx.beneficiaryTin, name: gd?.doneeName ?? (tx.beneficiaryName || 'Donee'), relationship: rel, relationshipTag: gd?.relationshipTag ?? rel } : null,
    relationship: rel as GiftRelationship,
    relationshipTag: gd?.relationshipTag ?? rel,
    giftAmountInput: gd ? String(gd.giftValue) : '',
    giftDate: gd?.giftDate ?? tx.giftDate ?? '',
    description: gd?.description ?? tx.items[0]?.remarks ?? '',
    remarks: gd?.remarks ?? '',
    assessmentYear: tx.items[0]?.assessmentYear || '2025-2026',
    stage: 1 as const,
  };
}
