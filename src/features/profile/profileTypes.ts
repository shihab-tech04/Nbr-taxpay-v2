export type ProfileFieldSource = 'certificate' | 'tin_profile' | 'account';

export interface TaxpayerProfile24 {
  // Identity
  taxpayerName: string;
  tin: string;
  // Summary (Embedded account & registration header)
  tinType: string;
  taxesCircle: string;
  registeredOn: string;
  lastLoginAt: string;
  // Personal information
  taxpayerStatus: string;
  tinSubtype: string;
  userType: string;
  localTaxpayer: string;
  // Contact and addresses
  mobileNumber: string;
  emailAddress: string;
  registeredAddress: string;
  currentAddress: string;
  // Jurisdiction
  taxesZone: string;
  taxesRange: string;
  district: string;
  country: string;
  // Certificate details
  certificateIssuedOn: string;
  certificateLastUpdatedOn: string;
  issuingOfficer: string;
  taxOfficeAddress: string;
  taxOfficePhone: string;
  previousTin: string;
}

export type ProfileGroupKey =
  | 'identity'
  | 'summary'
  | 'personal'
  | 'contact'
  | 'jurisdiction'
  | 'certificate';

export interface ProfileFieldMeta {
  key: keyof TaxpayerProfile24;
  labelEn: string;
  labelBn: string;
  group: ProfileGroupKey;
  source: ProfileFieldSource;
  maskable?: boolean;
  copyable?: boolean;
}

export const PROFILE_24_FIELD_MANIFEST: readonly ProfileFieldMeta[] = [
  // Group 1: Identity Details
  { key: 'taxpayerName', labelEn: 'Name', labelBn: 'করদাতার নাম', group: 'identity', source: 'certificate' },
  { key: 'tin', labelEn: 'TIN', labelBn: 'টিআইএন', group: 'identity', source: 'certificate', maskable: true, copyable: true },

  // Group 2: Summary (Embedded in ProfileSummaryCard)
  { key: 'tinType', labelEn: 'TIN type', labelBn: 'টিআইএন-এর ধরণ', group: 'summary', source: 'tin_profile' },
  { key: 'taxesCircle', labelEn: 'Taxes circle', labelBn: 'কর সার্কেল', group: 'summary', source: 'certificate' },
  { key: 'registeredOn', labelEn: 'Registered since', labelBn: 'নিবন্ধনের তারিখ', group: 'summary', source: 'tin_profile' },
  { key: 'lastLoginAt', labelEn: 'Last account login', labelBn: 'সর্বশেষ লগইন', group: 'summary', source: 'account' },

  // Group 3: Personal Information
  { key: 'taxpayerStatus', labelEn: 'Taxpayer status', labelBn: 'করদাতার স্থিতি', group: 'personal', source: 'tin_profile' },
  { key: 'tinSubtype', labelEn: 'TIN classification', labelBn: 'টিআইএন শ্রেণিবিভাগ', group: 'personal', source: 'tin_profile' },
  { key: 'userType', labelEn: 'User type', labelBn: 'ব্যবহারকারীর ধরণ', group: 'personal', source: 'tin_profile' },
  { key: 'localTaxpayer', labelEn: 'Local taxpayer', labelBn: 'স্থানীয় করদাতা', group: 'personal', source: 'tin_profile' },

  // Group 4: Contact & Addresses
  { key: 'mobileNumber', labelEn: 'Mobile number', labelBn: 'মোবাইল নম্বর', group: 'contact', source: 'tin_profile', maskable: true, copyable: true },
  { key: 'emailAddress', labelEn: 'Email address', labelBn: 'ইমেইল ঠিকানা', group: 'contact', source: 'tin_profile', maskable: true, copyable: true },
  { key: 'registeredAddress', labelEn: 'Registered / permanent address', labelBn: 'স্থায়ী ঠিকানা', group: 'contact', source: 'tin_profile' },
  { key: 'currentAddress', labelEn: 'Current address', labelBn: 'বর্তমান ঠিকানা', group: 'contact', source: 'tin_profile' },

  // Group 5: Tax Jurisdiction
  { key: 'taxesZone', labelEn: 'Taxes zone', labelBn: 'কর অঞ্চল', group: 'jurisdiction', source: 'certificate' },
  { key: 'taxesRange', labelEn: 'Taxes range', labelBn: 'কর রেঞ্জ', group: 'jurisdiction', source: 'tin_profile' },
  { key: 'district', labelEn: 'District', labelBn: 'জেলা', group: 'jurisdiction', source: 'tin_profile' },
  { key: 'country', labelEn: 'Country', labelBn: 'দেশ', group: 'jurisdiction', source: 'tin_profile' },

  // Group 6: Certificate Details
  { key: 'certificateIssuedOn', labelEn: 'Certificate issue date', labelBn: 'সনদ জারির তারিখ', group: 'certificate', source: 'certificate' },
  { key: 'certificateLastUpdatedOn', labelEn: 'Certificate last updated', labelBn: 'সর্বশেষ হালনাগাদ', group: 'certificate', source: 'certificate' },
  { key: 'issuingOfficer', labelEn: 'Issuing tax officer', labelBn: 'প্রদানকারী কর্মকর্তা', group: 'certificate', source: 'certificate' },
  { key: 'taxOfficeAddress', labelEn: 'Tax office address', labelBn: 'কর অফিসের ঠিকানা', group: 'certificate', source: 'certificate' },
  { key: 'taxOfficePhone', labelEn: 'Tax office phone', labelBn: 'কর অফিসের ফোন', group: 'certificate', source: 'certificate', maskable: true },
  { key: 'previousTin', labelEn: 'Previous TIN', labelBn: 'পূর্ববর্তী টিআইএন', group: 'certificate', source: 'certificate', maskable: true, copyable: true },
];
