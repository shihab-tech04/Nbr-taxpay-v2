import {
  Beneficiary,
  BeneficiaryList,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
  TaxHeadItem,
  UserProfile,
} from '../types/tax';

export const INITIAL_USER: UserProfile = {
  tin: '882349102384',
  name: 'Md. Rafiqul Islam',
  circle: 'Circle-112 (Company)',
  zone: 'Tax Zone-05, Dhaka',
  email: 'rafiqul.islam@example.com',
  phone: '+8801712345678',
  registeredDate: '2021-07-15',
  taxpayerType: 'Individual',
};

export const TAX_HEADS: TaxHeadItem[] = [
  { id: 'h1', code: '0111', nameEn: 'Income Tax with Return (Individual)', nameBn: 'রিটার্নসহ আয়কর (ব্যক্তিগত)', category: 'tax_with_return', descriptionEn: 'Annual tax submitted with income tax return (s.173 / s.174).' },
  { id: 'h2', code: '0112', nameEn: 'Advance Income Tax (AIT)', nameBn: 'অগ্রিম আয়কর (এআইটি)', category: 'advance_tax', descriptionEn: 'Advance payment of income tax in installments.' },
  { id: 'h3', code: '0113', nameEn: 'Tax against Assessed Demand (u/s 135)', nameBn: 'নির্ধারিত দাবির বিপরীতে কর', category: 'assessed_demand', descriptionEn: 'Payment against an assessed tax demand notice.' },
  { id: 'h4', code: '0114', nameEn: 'Tax Penalty & Late Surcharge', nameBn: 'কর জরিমানা ও বিলম্ব সারচার্জ', category: 'penalty', descriptionEn: 'Payment against an imposed statutory penalty.' },
  { id: 'h7', code: '0115', nameEn: 'Source Tax / TDS on Salaries & Supply', nameBn: 'উৎস কর / বেতন ও সরবরাহ থেকে কর্তন', category: 'source_tax', isWithholding: true, descriptionEn: 'Deposit TDS/TCS as a withholding agent.' },
  { id: 'h8', code: '0116', nameEn: 'Taxes Appellate Tribunal Fee / Deposit', nameBn: 'আপিল ট্রাইব্যুনাল ফি / জমা', category: 'appellate_tribunal', descriptionEn: 'Payment under Appellate Tribunal payment head.' },
  { id: 'h9', code: '0117', nameEn: 'Property Transfer & Capital Gains Surcharge', nameBn: 'সম্পত্তি হস্তান্তর ও মূলধনী লাভ সারচার্জ', category: 'other_tax', descriptionEn: 'Other statutory income tax heads and surcharges.' },
  { id: 'h5', code: '0120', nameEn: 'Travel Tax (Land / Water)', nameBn: 'ভ্রমণ কর (স্থল / জলপথ)', category: 'travel_tax', descriptionEn: 'Mandatory departure tax for international land and water travel.' },
  { id: 'h6', code: '0130', nameEn: 'Gift Tax (দানকর)', nameBn: 'দানকর (Gift Tax)', category: 'gift_tax', descriptionEn: 'Tax on taxable gifts made to non-exempt recipients.' },
];

export const INITIAL_BENEFICIARY_LISTS: BeneficiaryList[] = [
  { id: 'list-family', name: 'Family', createdAt: '2025-01-01' },
  { id: 'list-clients', name: 'Clients', createdAt: '2025-01-01' },
  { id: 'list-friends', name: 'Friends', createdAt: '2025-01-01' },
];

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: 'b1', name: 'Mrs. Fatema Begum', tin: '992384102938', relationship: 'Mother', listId: 'list-family', phone: '+8801811122233', createdAt: '2025-01-10' },
  { id: 'b2', name: 'Tanvir Islam', tin: '773492019283', relationship: 'Son', listId: 'list-family', phone: '+8801911223344', createdAt: '2025-03-12' },
  { id: 'b3', name: 'GreenCorp Ltd.', tin: '112938475601', relationship: 'Clients', listId: 'list-clients', phone: '+8801522334455', email: 'accounts@greencorp.bd', createdAt: '2025-05-20' },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-101',
    transactionRef: 'SOHO-2026-98124',
    taxpayerTin: '882349102384',
    taxpayerName: 'Md. Rafiqul Islam',
    ownerScope: 'acct_882349102384',
    originMode: 'signed_in',
    category: 'tax_with_return',
    items: [
      { headId: 'h1', headCode: '0111', headNameEn: 'Income Tax with Return (Individual)', headNameBn: 'রিটার্নসহ আয়কর (ব্যক্তিগত)', assessmentYear: '2025-2026', amount: 25000, taxpayerTin: '882349102384', taxpayerName: 'Md. Rafiqul Islam', category: 'tax_with_return', remarks: 'Regular annual return submission' },
    ],
    totalAmount: 25000,
    paymentChannel: 'bKash',
    status: 'Completed',
    createdAt: '2026-04-10T11:30:00Z',
    challanNumber: 'NBR-CHL-2026-881920',
    bankRef: 'BK-TRX-9982341',
  },
  {
    id: 'tx-102',
    transactionRef: 'SOHO-2026-88342',
    taxpayerTin: '882349102384',
    taxpayerName: 'Md. Rafiqul Islam',
    beneficiaryTin: '992384102938',
    beneficiaryName: 'Mrs. Fatema Begum',
    ownerScope: 'acct_882349102384',
    originMode: 'signed_in',
    category: 'gift_tax',
    giftDate: '2026-05-02',
    items: [
      { headId: 'h6', headCode: '0130', headNameEn: 'Gift Tax (দানকর)', headNameBn: 'দানকর (Gift Tax)', assessmentYear: '2025-2026', amount: 12500, taxpayerTin: '992384102938', taxpayerName: 'Mrs. Fatema Begum', category: 'gift_tax', remarks: 'Property gift on behalf of mother' },
    ],
    totalAmount: 12500,
    paymentChannel: 'Nagad',
    status: 'Completed',
    createdAt: '2026-05-02T14:15:00Z',
    challanNumber: 'NBR-CHL-2026-773821',
    bankRef: 'NG-TRX-5541290',
  },
];

export const INITIAL_DRAFTS: PaymentDraft[] = [
  {
    id: 'dr-1',
    title: 'Advance Income Tax Q2',
    category: 'advance_tax',
    items: [
      { headId: 'h2', headCode: '0112', headNameEn: 'Advance Income Tax (AIT)', headNameBn: 'অগ্রিম আয়কর (এআইটি)', assessmentYear: '2026-2027', amount: 15000, taxpayerTin: '882349102384', taxpayerName: 'Md. Rafiqul Islam', category: 'advance_tax', remarks: 'Quarterly AIT installment' },
    ],
    updatedAt: '2026-11-20',
  },
];

export const INITIAL_CORRECTIONS: CorrectionRequest[] = [
  {
    id: 'cor-1',
    transactionId: 'tx-101',
    challanNumber: 'NBR-CHL-2026-881920',
    reason: 'Incorrect Assessment Year in challan',
    description: 'Requested correction from AY 2024-2025 to 2025-2026 as per NBR notice.',
    status: 'Under Review',
    createdAt: '2026-04-12',
  },
];

export const INITIAL_SUPPORT: SupportTicket[] = [
  {
    id: 'sup-1',
    subject: 'Challan generation delay on bKash',
    category: 'Payment Issue',
    message: 'My bKash payment was deducted but challan took 15 mins to appear.',
    status: 'Resolved',
    createdAt: '2026-03-10',
  },
];
