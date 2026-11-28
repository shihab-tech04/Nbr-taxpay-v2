import type {
  AppNotification,
  Beneficiary,
  BeneficiaryList,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
  UnverifiedCorrectionInquiry,
} from '../types/tax';
import {
  INITIAL_BENEFICIARIES,
  INITIAL_BENEFICIARY_LISTS,
  INITIAL_CORRECTIONS,
  INITIAL_DRAFTS,
  INITIAL_SUPPORT,
  INITIAL_TRANSACTIONS,
} from './mockData';

export interface ScopedDomainData {
  beneficiaryLists: BeneficiaryList[];
  beneficiaries: Beneficiary[];
  transactions: PaymentTransaction[];
  drafts: PaymentDraft[];
  corrections: CorrectionRequest[];
  unverifiedInquiries: UnverifiedCorrectionInquiry[];
  supportTickets: SupportTicket[];
  notifications: AppNotification[];
}

const USER1_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-user1-tx101', ownerScope: 'acct_882349102384', kind: 'payment',
    titleEn: 'Sample Payment Recorded (SOHO-2026-98124)', titleBn: 'নমুনা পেমেন্ট সংরক্ষিত হয়েছে (SOHO-2026-98124)',
    bodyEn: 'Income Tax with Return (Individual) for AY 2025-2026 — ৳ 25,000 via bKash.',
    bodyBn: 'কর বর্ষ ২০২৫-২০২৬ এর জন্য রিটার্নসহ আয়কর (৳ ২৫,০০০, বিকাশ) নমুনা রেকর্ড হয়েছে।',
    createdAt: '2026-04-10T11:30:00Z', readAt: '2026-04-10T12:00:00Z',
    targetRoute: '/history?ref=SOHO-2026-98124', targetRef: 'SOHO-2026-98124',
    amount: 25000, headLabel: '0111 · Income Tax with Return', assessmentYear: '2025-2026',
  },
  {
    id: 'notif-user1-cor1', ownerScope: 'acct_882349102384', kind: 'correction',
    titleEn: 'Challan Correction Under Review (NBR-CHL-2026-881920)', titleBn: 'চালান সংশোধন আবেদন পর্যালোচনাধীন (NBR-CHL-2026-881920)',
    bodyEn: 'Assessment Year correction request is queued for Office review.',
    bodyBn: 'কর বর্ষ সংশোধনের আবেদনটি অফিস পর্যালোচনার জন্য প্রক্রিয়াধীন রয়েছে।',
    createdAt: '2026-04-12T09:00:00Z', targetRoute: '/corrections?ticketId=cor-1', targetRef: 'NBR-CHL-2026-881920',
  },
  {
    id: 'notif-user1-draft1', ownerScope: 'acct_882349102384', kind: 'draft',
    titleEn: 'Saved Tax Draft Pending Completion', titleBn: 'সংরক্ষিত কর খসড়া অসম্পূর্ণ রয়েছে',
    bodyEn: 'Advance Income Tax Q2 (AY 2026-2027 · ৳ 15,000) can be resumed anytime.',
    bodyBn: 'অগ্রিম আয়কর Q2 (কর বর্ষ ২০২৬-২০২৭ · ৳ ১৫,০০০) যেকোনো সময় পুনরায় শুরু করা যাবে।',
    createdAt: '2026-11-20T10:00:00Z', targetRoute: '/drafts?draftId=dr-1', targetRef: 'dr-1',
    amount: 15000, assessmentYear: '2026-2027',
  },
];

const SECONDARY_SEED: ScopedDomainData = {
  beneficiaryLists: [{ id: 'list-sec-family', name: 'Family', createdAt: '2025-04-01' }],
  beneficiaries: [{
    id: 'b-sec-1', name: 'Karim Chowdhury', tin: '445566778899', relationship: 'Father',
    listId: 'list-sec-family', phone: '+8801911002233', createdAt: '2025-04-02',
  }],
  transactions: [{
    id: 'tx-sec-201', transactionRef: 'SOHO-2026-44109', taxpayerTin: '112233445566',
    taxpayerName: 'Tasnim Chowdhury', ownerScope: 'acct_112233445566', originMode: 'signed_in', category: 'advance_tax',
    items: [{
      headId: 'h2', headCode: '0112', headNameEn: 'Advance Income Tax (AIT)', headNameBn: 'অগ্রিম আয়কর (এআইটি)',
      assessmentYear: '2026-2027', amount: 18500, taxpayerTin: '112233445566', taxpayerName: 'Tasnim Chowdhury',
      category: 'advance_tax', remarks: 'Chattogram advance installment',
    }],
    totalAmount: 18500, paymentChannel: 'Nagad', status: 'Completed', createdAt: '2026-06-14T09:20:00Z',
    challanNumber: 'NBR-CHL-2026-339104', bankRef: 'NG-TRX-8841209',
  }],
  drafts: [{
    id: 'dr-sec-1', title: 'Advance Tax - Chattogram Q3', category: 'advance_tax',
    items: [{
      headId: 'h2', headCode: '0112', headNameEn: 'Advance Income Tax (AIT)', headNameBn: 'অগ্রিম আয়কর (এআইটি)',
      assessmentYear: '2026-2027', amount: 9500, taxpayerTin: '112233445566', taxpayerName: 'Tasnim Chowdhury',
      category: 'advance_tax', remarks: 'Q3 installment draft',
    }],
    updatedAt: '2026-11-22',
  }],
  corrections: [],
  unverifiedInquiries: [],
  supportTickets: [],
  notifications: [
    {
      id: 'notif-user2-tx201', ownerScope: 'acct_112233445566', kind: 'payment',
      titleEn: 'Advance Tax Preview Recorded (SOHO-2026-44109)', titleBn: 'অগ্রিম কর প্রিভিউ সংরক্ষিত হয়েছে (SOHO-2026-44109)',
      bodyEn: 'Chattogram advance installment (৳ 18,500) recorded under your isolated account.',
      bodyBn: 'আপনার পৃথক অ্যাকাউন্টে চট্টগ্রাম অগ্রিম কিস্তি (৳ ১৮,৫০০) সংরক্ষিত হয়েছে।',
      createdAt: '2026-06-14T09:20:00Z', targetRoute: '/history?ref=SOHO-2026-44109', targetRef: 'SOHO-2026-44109',
      amount: 18500, headLabel: '0112 · Advance Income Tax', assessmentYear: '2026-2027',
    },
    {
      id: 'notif-user2-draft1', ownerScope: 'acct_112233445566', kind: 'draft',
      titleEn: 'Saved Draft Ready to Resume (Chattogram Q3)', titleBn: 'সংরক্ষিত খসড়া পুনরায় শুরু করতে প্রস্তুত',
      bodyEn: 'Advance Tax - Chattogram Q3 (৳ 9,500) is saved in your drafts.',
      bodyBn: 'অগ্রিম কর - চট্টগ্রাম Q3 (৳ ৯,৫০০) আপনার খসড়ায় সংরক্ষিত রয়েছে।',
      createdAt: '2026-11-22T08:30:00Z', targetRoute: '/drafts?draftId=dr-sec-1', targetRef: 'dr-sec-1',
      amount: 9500, assessmentYear: '2026-2027',
    },
  ],
};

export const EMPTY_WALKIN_DATA: ScopedDomainData = {
  beneficiaryLists: [],
  beneficiaries: [],
  transactions: [],
  drafts: [],
  corrections: [],
  unverifiedInquiries: [],
  supportTickets: [],
  notifications: [],
};

export function getSeedForScope(scope: string): ScopedDomainData {
  if (scope === 'acct_882349102384') {
    return {
      beneficiaryLists: [...INITIAL_BENEFICIARY_LISTS],
      beneficiaries: [...INITIAL_BENEFICIARIES],
      transactions: [...INITIAL_TRANSACTIONS],
      drafts: [...INITIAL_DRAFTS],
      corrections: [...INITIAL_CORRECTIONS],
      unverifiedInquiries: [],
      supportTickets: [...INITIAL_SUPPORT],
      notifications: [...USER1_NOTIFICATIONS],
    };
  }
  if (scope === 'acct_112233445566') {
    return {
      beneficiaryLists: [...SECONDARY_SEED.beneficiaryLists],
      beneficiaries: [...SECONDARY_SEED.beneficiaries],
      transactions: [...SECONDARY_SEED.transactions],
      drafts: [...SECONDARY_SEED.drafts],
      corrections: [...SECONDARY_SEED.corrections],
      unverifiedInquiries: [],
      supportTickets: [...SECONDARY_SEED.supportTickets],
      notifications: [...SECONDARY_SEED.notifications],
    };
  }
  return { ...EMPTY_WALKIN_DATA };
}
