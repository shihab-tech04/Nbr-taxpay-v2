import type { TaxpayerProfile24 } from './profileTypes';
import { INITIAL_USER } from '../../shared/mockData';

export const DEFAULT_TAXPAYER_PROFILE_24: TaxpayerProfile24 = {
  // Identity
  taxpayerName: INITIAL_USER.name,
  tin: INITIAL_USER.tin,

  // Summary / Account
  tinType: INITIAL_USER.taxpayerType,
  registeredOn: INITIAL_USER.registeredDate,
  previousTin: 'N/A',
  lastLoginAt: '2026-11-27 18:00 (Asia/Dhaka)',

  // Personal information
  taxpayerStatus: 'Resident (নিবাসী)',
  tinSubtype: 'General Individual (সাধারণ ব্যক্তি)',
  userType: 'Individual Citizen',
  localTaxpayer: 'Yes (হ্যাঁ)',

  // Contact and addresses
  mobileNumber: INITIAL_USER.phone,
  emailAddress: INITIAL_USER.email,
  registeredAddress: 'Holding 42, Road 7, Dhanmondi, Dhaka-1205',
  currentAddress: 'Holding 42, Road 7, Dhanmondi, Dhaka-1205',

  // Jurisdiction
  taxesCircle: INITIAL_USER.circle,
  taxesZone: INITIAL_USER.zone,
  taxesRange: 'Range-04',
  district: 'Dhaka',
  country: 'Bangladesh',

  // Certificate details
  certificateIssuedOn: '2021-07-20',
  certificateLastUpdatedOn: '2025-08-14',
  issuingOfficer: 'Deputy Commissioner of Taxes',
  taxOfficeAddress: 'Segunbagicha, Dhaka-1000',
  taxOfficePhone: '+880-2-9355555',
};
