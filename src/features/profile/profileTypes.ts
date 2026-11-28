export interface TaxpayerProfile24 {
  // Identity
  taxpayerName: string;
  tin: string;
  // Summary / Account
  tinType: string;
  registeredOn: string;
  previousTin: string;
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
  taxesCircle: string;
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
  maskable?: boolean;
  copyable?: boolean;
}

export const PROFILE_24_FIELD_MANIFEST: readonly ProfileFieldMeta[] = [
  // Group 1: Identity
  { key: 'taxpayerName', labelEn: 'Name', labelBn: 'করদাতার নাম', group: 'identity' },
  { key: 'tin', labelEn: 'TIN', labelBn: 'টিআইএন', group: 'identity', maskable: true, copyable: true },

  // Group 2: Summary / Account
  { key: 'tinType', labelEn: 'TIN type', labelBn: 'টিআইএন-এর ধরণ', group: 'summary' },
  { key: 'registeredOn', labelEn: 'Registered since', labelBn: 'নিবন্ধনের তারিখ', group: 'summary' },
  { key: 'previousTin', labelEn: 'Previous TIN', labelBn: 'পূর্ববর্তী টিআইএন', group: 'summary' },
  { key: 'lastLoginAt', labelEn: 'Last account login', labelBn: 'সর্বশেষ লগইন', group: 'summary' },

  // Group 3: Personal information
  { key: 'taxpayerStatus', labelEn: 'Taxpayer status', labelBn: 'করদাতার স্থিতি', group: 'personal' },
  { key: 'tinSubtype', labelEn: 'TIN classification', labelBn: 'টিআইএন শ্রেণিবিভাগ', group: 'personal' },
  { key: 'userType', labelEn: 'User type', labelBn: 'ব্যবহারকারীর ধরণ', group: 'personal' },
  { key: 'localTaxpayer', labelEn: 'Local taxpayer', labelBn: 'স্থানীয় করদাতা', group: 'personal' },

  // Group 4: Contact and addresses
  { key: 'mobileNumber', labelEn: 'Mobile number', labelBn: 'মোবাইল নম্বর', group: 'contact', maskable: true, copyable: true },
  { key: 'emailAddress', labelEn: 'Email address', labelBn: 'ইমেইল ঠিকানা', group: 'contact', maskable: true, copyable: true },
  { key: 'registeredAddress', labelEn: 'Registered / permanent address', labelBn: 'স্থায়ী ঠিকানা', group: 'contact' },
  { key: 'currentAddress', labelEn: 'Current address', labelBn: 'বর্তমান ঠিকানা', group: 'contact' },

  // Group 5: Jurisdiction
  { key: 'taxesCircle', labelEn: 'Taxes circle', labelBn: 'কর সার্কেল', group: 'jurisdiction' },
  { key: 'taxesZone', labelEn: 'Taxes zone', labelBn: 'কর অঞ্চল', group: 'jurisdiction' },
  { key: 'taxesRange', labelEn: 'Taxes range', labelBn: 'কর রেঞ্জ', group: 'jurisdiction' },
  { key: 'district', labelEn: 'District', labelBn: 'জেলা', group: 'jurisdiction' },
  { key: 'country', labelEn: 'Country', labelBn: 'দেশ', group: 'jurisdiction' },

  // Group 6: Certificate details
  { key: 'certificateIssuedOn', labelEn: 'Certificate issue date', labelBn: 'সনদ জারির তারিখ', group: 'certificate' },
  { key: 'certificateLastUpdatedOn', labelEn: 'Certificate last updated', labelBn: 'সর্বশেষ হালনাগাদ', group: 'certificate' },
  { key: 'issuingOfficer', labelEn: 'Issuing tax officer', labelBn: 'প্রদানকারী কর্মকর্তা', group: 'certificate' },
  { key: 'taxOfficeAddress', labelEn: 'Tax office address', labelBn: 'কর অফিসের ঠিকানা', group: 'certificate' },
  { key: 'taxOfficePhone', labelEn: 'Tax office phone', labelBn: 'কর অফিসের ফোন', group: 'certificate' },
];
