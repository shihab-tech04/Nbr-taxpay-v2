import type {
  Beneficiary,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
} from '../types/tax';
import {
  INITIAL_BENEFICIARIES,
  INITIAL_CORRECTIONS,
  INITIAL_DRAFTS,
  INITIAL_SUPPORT,
  INITIAL_TRANSACTIONS,
} from './mockData';
import { readJsonStorage, writeAppStorage } from './storageAdapter';
import { lookupTinIdentity } from './accountSession';

export interface ScopedDomainData {
  beneficiaries: Beneficiary[];
  transactions: PaymentTransaction[];
  drafts: PaymentDraft[];
  corrections: CorrectionRequest[];
  supportTickets: SupportTicket[];
}

const SECONDARY_SEED: ScopedDomainData = {
  beneficiaries: [
    {
      id: 'b-sec-1',
      name: 'Karim Chowdhury',
      tin: '445566778899',
      relationship: 'Father',
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
  beneficiaries: [],
  transactions: [],
  drafts: [],
  corrections: [],
  supportTickets: [],
};

export function getSeedForScope(scope: string): ScopedDomainData {
  if (scope === 'acct_882349102384') {
    return {
      beneficiaries: [...INITIAL_BENEFICIARIES],
      transactions: [...INITIAL_TRANSACTIONS],
      drafts: [...INITIAL_DRAFTS],
      corrections: [...INITIAL_CORRECTIONS],
      supportTickets: [...INITIAL_SUPPORT],
    };
  }
  if (scope === 'acct_112233445566') {
    return {
      beneficiaries: [...SECONDARY_SEED.beneficiaries],
      transactions: [...SECONDARY_SEED.transactions],
      drafts: [...SECONDARY_SEED.drafts],
      corrections: [...SECONDARY_SEED.corrections],
      supportTickets: [...SECONDARY_SEED.supportTickets],
    };
  }
  return {
    beneficiaries: [...EMPTY_WALKIN_DATA.beneficiaries],
    transactions: [...EMPTY_WALKIN_DATA.transactions],
    drafts: [...EMPTY_WALKIN_DATA.drafts],
    corrections: [...EMPTY_WALKIN_DATA.corrections],
    supportTickets: [...EMPTY_WALKIN_DATA.supportTickets],
  };
}

export function getScopedDomainStorageKey(scope: string): string {
  return `sohojkor_domain_${scope}`;
}

export function readScopedDomainData(scope: string): ScopedDomainData {
  const seed = getSeedForScope(scope);
  return readJsonStorage<ScopedDomainData>(getScopedDomainStorageKey(scope), seed);
}

export function writeScopedDomainData(scope: string, data: ScopedDomainData): void {
  writeAppStorage(getScopedDomainStorageKey(scope), JSON.stringify(data));
}

export function claimWalkInTransactionInStorage(
  tx: PaymentTransaction,
  targetTin: string,
  targetName: string
): PaymentTransaction | null {
  if (!/^\d{12,13}$/.test(targetTin)) return null;
  const verified = lookupTinIdentity(targetTin);
  if (!verified) return null;
  if (tx.originMode !== 'walk_in' && tx.ownerScope !== 'walkin') return null;
  const targetScope = `acct_${targetTin}`;
  const targetData = readScopedDomainData(targetScope);
  const already = targetData.transactions.some((item) => item.transactionRef === tx.transactionRef);
  if (already) return null;

  const claimed: PaymentTransaction = {
    ...tx,
    ownerScope: targetScope,
    taxpayerTin: targetTin,
    taxpayerName: verified.profile.name || targetName,
  };
  writeScopedDomainData(targetScope, {
    ...targetData,
    transactions: [claimed, ...targetData.transactions],
  });
  const walkinData = readScopedDomainData('walkin');
  writeScopedDomainData('walkin', {
    ...walkinData,
    transactions: walkinData.transactions.filter((item) => item.transactionRef !== tx.transactionRef),
  });
  return claimed;
}

