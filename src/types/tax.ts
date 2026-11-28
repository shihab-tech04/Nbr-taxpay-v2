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

export interface BeneficiaryList {
  id: string;
  name: string;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  tin: string;
  relationship:
    | 'Father'
    | 'Mother'
    | 'Siblings'
    | 'Son'
    | 'Daughter'
    | 'Spouse'
    | 'Friends'
    | 'Clients'
    | 'Others';
  relationshipNote?: string;
  listId?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export type TaxHeadCategory =
  | 'tax_with_return'
  | 'advance_tax'
  | 'assessed_demand'
  | 'penalty'
  | 'source_tax'
  | 'appellate_tribunal'
  | 'other_tax'
  | 'travel_tax'
  | 'gift_tax';

export interface TaxHeadItem {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  category: TaxHeadCategory;
  defaultRate?: number;
  isWithholding?: boolean;
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
  taxpayerTin?: string;
  taxpayerName?: string;
  category?: TaxHeadCategory;
  remarks?: string;
}

export type YmdMonth = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type YmdDay =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
export type YmdDateString = `${number}-${YmdMonth}-${YmdDay}`;

export interface TravelPassengerRecord {
  id: string;
  passengerName: string;
  passportType: 'BD' | 'Foreign';
  passportMasked: string;
  dob: string;
  nationality?: string;
  ageOnTravelDate: number;
  amount: number;
  confirmed: boolean;
}

export interface TravelDetails {
  passengerName?: string;
  passportNumber?: string;
  passportMasked?: string;
  travelMode?: 'Land' | 'Water';
  departurePort?: string;
  destination: string;
  travelDate?: string;
  travelClass?: string;
  contactMobile?: string;
  passengers?: TravelPassengerRecord[];
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  taxpayerTin: string;
  taxpayerName: string;
  beneficiaryTin?: string;
  beneficiaryName?: string;
  ownerScope?: string;
  originMode?: 'signed_in' | 'walk_in';
  walkInSessionId?: string;
  claimedByTin?: string;
  claimedAt?: string;
  category: TaxHeadCategory;
  giftDate?: YmdDateString;
  travelDetails?: TravelDetails;
  items: PaymentLineItem[];
  totalAmount: number;
  paymentChannel: 'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'CityBank' | 'SonaliBank';
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  challanNumber: string;
  bankRef: string;
}

export interface TravelDraftSnapshot {
  passengers: TravelPassengerRecord[];
  travelMode: 'Land' | 'Water';
  departurePort: string;
  destination: string;
  travelDate: string;
  contactMobile?: string;
  stage?: 1 | 2 | 3;
}

export interface PaymentDraft {
  id: string;
  title: string;
  category: TaxHeadCategory;
  items: PaymentLineItem[];
  beneficiaryTin?: string;
  remarks?: string;
  travelDraft?: TravelDraftSnapshot;
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
