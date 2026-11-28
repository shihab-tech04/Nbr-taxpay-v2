import type {
  Beneficiary,
  BeneficiaryList,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
} from '../types/tax';
import {
  INITIAL_BENEFICIARIES,
  INITIAL_BENEFICIARY_LISTS,
  INITIAL_CORRECTIONS,
  INITIAL_DRAFTS,
  INITIAL_SUPPORT,
  INITIAL_TRANSACTIONS,
} from './mockData';
import { readJsonStorage, writeAppStorage } from './storageAdapter';
import { getActiveWalkInSessionId, lookupTinIdentity } from './accountSession';

export interface ScopedDomainData {
  beneficiaryLists: BeneficiaryList[];
  beneficiaries: Beneficiary[];
  transactions: PaymentTransaction[];
  drafts: PaymentDraft[];
  corrections: CorrectionRequest[];
  supportTickets: SupportTicket[];
}

const SECONDARY_SEED: ScopedDomainData = {
  beneficiaryLists: [
    { id: 'list-sec-family', name: 'Family', createdAt: '2025-04-01' },
  ],
  beneficiaries: [
    {
      id: 'b-sec-1',
      name: 'Karim Chowdhury',
      tin: '445566778899',
      relationship: 'Father',
      listId: 'list-sec-family',
      phone: '+8801911002233',
      createdAt: '2025-04-02',
    },
  ],
  transactions: [
    {
      id: 'tx-sec-201',
      transactionRef: 'SOHO-2026-44109',
      taxpayerTin: '112233445566',
      taxpayerName: 'Tasnim Chowdhury',
      ownerScope: 'acct_112233445566',
      originMode: 'signed_in',
      category: 'advance_tax',
      items: [
        {
          headId: 'h2',
          headCode: '0112',
          headNameEn: 'Advance Income Tax (AIT)',
          headNameBn: 'অগ্রিম আয়কর (এআইটি)',
          assessmentYear: '2026-2027',
          amount: 18500,
          taxpayerTin: '112233445566',
          taxpayerName: 'Tasnim Chowdhury',
          category: 'advance_tax',
          remarks: 'Chattogram advance installment',
        },
      ],
      totalAmount: 18500,
      paymentChannel: 'Nagad',
      status: 'Completed',
      createdAt: '2026-06-14T09:20:00Z',
      challanNumber: 'NBR-CHL-2026-339104',
      bankRef: 'NG-TRX-8841209',
    },
  ],
  drafts: [
    {
      id: 'dr-sec-1',
      title: 'Advance Tax - Chattogram Q3',
      category: 'advance_tax',
      items: [
        {
          headId: 'h2',
          headCode: '0112',
          headNameEn: 'Advance Income Tax (AIT)',
          headNameBn: 'অগ্রিম আয়কর (এআইটি)',
          assessmentYear: '2026-2027',
          amount: 9500,
          taxpayerTin: '112233445566',
          taxpayerName: 'Tasnim Chowdhury',
          category: 'advance_tax',
          remarks: 'Q3 installment draft',
        },
      ],
      updatedAt: '2026-11-22',
    },
  ],
  corrections: [],
  supportTickets: [],
};

const EMPTY_WALKIN_DATA: ScopedDomainData = {
  beneficiaryLists: [],
  beneficiaries: [],
  transactions: [],
  drafts: [],
  corrections: [],
  supportTickets: [],
};

export function getSeedForScope(scope: string): ScopedDomainData {
  if (scope === 'acct_882349102384') {
    return {
      beneficiaryLists: [...INITIAL_BENEFICIARY_LISTS],
      beneficiaries: [...INITIAL_BENEFICIARIES],
      transactions: [...INITIAL_TRANSACTIONS],
      drafts: [...INITIAL_DRAFTS],
      corrections: [...INITIAL_CORRECTIONS],
      supportTickets: [...INITIAL_SUPPORT],
    };
  }
  if (scope === 'acct_112233445566') {
    return {
      beneficiaryLists: [...SECONDARY_SEED.beneficiaryLists],
      beneficiaries: [...SECONDARY_SEED.beneficiaries],
      transactions: [...SECONDARY_SEED.transactions],
      drafts: [...SECONDARY_SEED.drafts],
      corrections: [...SECONDARY_SEED.corrections],
      supportTickets: [...SECONDARY_SEED.supportTickets],
    };
  }
  return { ...EMPTY_WALKIN_DATA };
}

export function getScopedDomainStorageKey(scope: string): string {
  return `sohojkor_domain_${scope}`;
}

export function readScopedDomainData(
  scope: string,
  options: { includeAllSessions?: boolean } = {}
): ScopedDomainData {
  const seed = getSeedForScope(scope);
  const raw = readJsonStorage<ScopedDomainData>(getScopedDomainStorageKey(scope), seed);
  const lists = Array.isArray(raw.beneficiaryLists) ? raw.beneficiaryLists : seed.beneficiaryLists;
  if (scope !== 'walkin' || options.includeAllSessions) {
    return { ...seed, ...raw, beneficiaryLists: lists };
  }
  const activeGuestSession = getActiveWalkInSessionId();
  return {
    ...EMPTY_WALKIN_DATA,
    ...raw,
    beneficiaryLists: [],
    drafts: [],
    beneficiaries: [],
    transactions: (raw.transactions ?? []).filter(
      (tx) => !tx.walkInSessionId || tx.walkInSessionId === activeGuestSession
    ),
  };
}

export function writeScopedDomainData(scope: string, data: ScopedDomainData): void {
  writeAppStorage(getScopedDomainStorageKey(scope), JSON.stringify(data));
}

export function claimWalkInTransactionInStorage(
  tx: PaymentTransaction,
  targetTin: string,
  _targetName: string
): PaymentTransaction | null {
  if (!/^\d{12,13}$/.test(targetTin) || !lookupTinIdentity(targetTin)) return null;
  if (tx.originMode !== 'walk_in' && tx.ownerScope !== 'walkin') return null;
  if (tx.taxpayerTin.trim() && tx.taxpayerTin.trim() !== targetTin) return null;
  const targetScope = `acct_${targetTin}`;
  const targetData = readScopedDomainData(targetScope);
  if (targetData.transactions.some((item) => item.transactionRef === tx.transactionRef)) return null;
  const walkinData = readScopedDomainData('walkin');
  const stored = walkinData.transactions.find((item) => item.transactionRef === tx.transactionRef);
  if (!stored) return null;
  const claimed: PaymentTransaction = {
    ...stored,
    ownerScope: targetScope,
    claimedByTin: targetTin,
    claimedAt: new Date().toISOString(),
  };
  writeScopedDomainData(targetScope, { ...targetData, transactions: [claimed, ...targetData.transactions] });
  writeScopedDomainData('walkin', {
    ...walkinData,
    transactions: walkinData.transactions.filter((item) => item.transactionRef !== tx.transactionRef),
  });
  return claimed;
}

