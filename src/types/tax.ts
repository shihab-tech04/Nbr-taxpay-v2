import type { BeneficiaryRelationship, GiftDetails, GiftDraftSnapshot, GiftPartyRecord, YmdDateString, YmdDay, YmdMonth } from './giftTax';
export type { BeneficiaryRelationship, GiftDetails, GiftDraftSnapshot, GiftPartyRecord, YmdDateString, YmdDay, YmdMonth };

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
  relationship: BeneficiaryRelationship;
  relationshipNote?: string;
  listId?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export type TaxHeadCategory =
  | 'tax_with_return' | 'advance_tax' | 'assessed_demand' | 'penalty'
  | 'source_tax' | 'appellate_tribunal' | 'other_tax' | 'travel_tax' | 'gift_tax';

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
  circle?: string;
  category?: TaxHeadCategory;
  remarks?: string;
}

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
  circle?: string;
  beneficiaryTin?: string;
  beneficiaryName?: string;
  ownerScope?: string;
  originMode?: 'signed_in' | 'walk_in';
  walkInSessionId?: string;
  claimedByTin?: string;
  claimedAt?: string;
  category: TaxHeadCategory;
  giftDate?: YmdDateString;
  giftDetails?: GiftDetails;
  travelDetails?: TravelDetails;
  items: PaymentLineItem[];
  totalAmount: number;
  paymentChannel: 'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'CityBank' | 'SonaliBank' | 'Zero-Tax';
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
  giftDraft?: GiftDraftSnapshot;
  updatedAt: string;
}

export interface CorrectionRequest {
  id: string;
  ticketNumber?: string;
  ownerScope?: string;
  transactionId: string;
  transactionRef?: string;
  challanNumber: string;
  allocationIndex?: number;
  taxpayerTin?: string;
  currentAssessmentYear?: string;
  currentCircle?: string;
  currentHeadCode?: string;
  currentHeadName?: string;
  proposedAssessmentYear?: string;
  proposedCircle?: string;
  proposedHeadCode?: string;
  proposedHeadName?: string;
  reason: string;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface UnverifiedCorrectionInquiry {
  id: string;
  ticketNumber: string;
  ownerScope: string;
  walkInSessionId?: string;
  originalReference: string;
  reason: string;
  requestedOutcome: string;
  evidenceNote?: string;
  status: 'Logged (Unverified Inquiry)';
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

export interface AppNotification {
  id: string;
  ownerScope: string;
  kind: 'payment' | 'recipient' | 'correction' | 'draft' | 'system';
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  createdAt: string;
  readAt?: string;
  targetRoute: string;
  targetRef?: string;
  amount?: number;
  headLabel?: string;
  assessmentYear?: string;
}
