export type Language = 'en' | 'bn';

export interface UserProfile {
  tin: string;
  name: string;
  circle: string;
  zone: string;
  email: string;
  phone: string;
  registeredDate: string;
  taxpayerType: 'Individual' | 'Company' | 'Firm';
}

export interface Beneficiary {
  id: string;
  name: string;
  tin: string;
  relationship: 'Father' | 'Mother' | 'Siblings' | 'Son' | 'Daughter' | 'Spouse' | 'Friends' | 'Clients' | 'Others';
  relationshipNote?: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export type TaxHeadCategory = 'tax_with_return' | 'other_tax' | 'travel_tax' | 'gift_tax';

export interface TaxHeadItem {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  category: TaxHeadCategory;
  defaultRate?: number;
  descriptionEn?: string;
  descriptionBn?: string;
}

export interface PaymentLineItem {
  headId: string;
  headCode: string;
  headNameEn: string;
  headNameBn: string;
  assessmentYear: string;
  amount: number;
  remarks?: string;
}

export type YmdMonth =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12';

export type YmdDay =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31';

export type YmdDateString = `${number}-${YmdMonth}-${YmdDay}`;

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  taxpayerTin: string;
  taxpayerName: string;
  beneficiaryTin?: string;
  beneficiaryName?: string;
  category: TaxHeadCategory;
  giftDate?: YmdDateString;
  items: PaymentLineItem[];
  totalAmount: number;
  paymentChannel: 'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'CityBank' | 'SonaliBank';
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  challanNumber: string;
  bankRef: string;
}

export interface PaymentDraft {
  id: string;
  title: string;
  category: TaxHeadCategory;
  items: PaymentLineItem[];
  beneficiaryTin?: string;
  updatedAt: string;
}

export interface CorrectionRequest {
  id: string;
  transactionId: string;
  challanNumber: string;
  reason: string;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Technical' | 'Tax Assessment' | 'Payment Issue' | 'Other';
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}
