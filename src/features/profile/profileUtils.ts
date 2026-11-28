import type { UserProfile } from '../../types/tax';
import { maskFirstThreeDigits, maskHiddenEmailDomain } from '../../shared/accountSession';
import { INITIAL_USER } from '../../shared/mockData';
import { SAMPLE_TAXPAYER_PROFILE_24 } from './profileData';
import type { TaxpayerProfile24 } from './profileTypes';

export interface ResolvedTaxpayerProfile {
  profile: TaxpayerProfile24;
  isSampleIdentity: boolean;
  registrationNotLinked: boolean;
}

export function isSensitiveMaskValue(value: string, key?: keyof TaxpayerProfile24 | string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '—' || trimmed.toUpperCase() === 'N/A') return false;
  const digitCount = trimmed.match(/[0-9]/g)?.length ?? 0;
  if (key === 'tin' || key === 'previousTin') return digitCount >= 8;
  if (key === 'mobileNumber' || key === 'taxOfficePhone') return digitCount >= 6;
  if (key === 'emailAddress') return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed);
  return digitCount >= 6 || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed);
}

export function maskProfileTin(tin: string): string {
  return maskFirstThreeDigits(tin, 8);
}

export function maskProfilePhone(phone: string): string {
  return maskFirstThreeDigits(phone, 6);
}

export function maskProfileEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed || trimmed === '—' || trimmed.toUpperCase() === 'N/A') return trimmed || '—';
  return maskHiddenEmailDomain(trimmed);
}

export function formatProfileValue(key: string, value: string, revealed: boolean): string {
  if (!value.trim()) return '—';
  if (revealed) return value;
  if (key === 'tin' || key === 'previousTin') return maskProfileTin(value);
  if (key === 'mobileNumber' || key === 'taxOfficePhone') return maskProfilePhone(value);
  if (key === 'emailAddress') return maskProfileEmail(value);
  return value;
}

export function resolveTaxpayerProfile(
  user: UserProfile,
  isAuthenticated: boolean,
  publicPreview: boolean
): ResolvedTaxpayerProfile | null {
  if (!isAuthenticated || publicPreview || !user.tin.trim()) {
    return null;
  }

  if (user.tin === INITIAL_USER.tin) {
    return {
      isSampleIdentity: true,
      registrationNotLinked: false,
      profile: {
        ...SAMPLE_TAXPAYER_PROFILE_24,
        taxpayerName: user.name || SAMPLE_TAXPAYER_PROFILE_24.taxpayerName,
        tin: user.tin,
        tinType: user.taxpayerType || SAMPLE_TAXPAYER_PROFILE_24.tinType,
        taxesCircle: user.circle || SAMPLE_TAXPAYER_PROFILE_24.taxesCircle,
        registeredOn: user.registeredDate || SAMPLE_TAXPAYER_PROFILE_24.registeredOn,
        mobileNumber: user.phone || SAMPLE_TAXPAYER_PROFILE_24.mobileNumber,
        emailAddress: user.email || SAMPLE_TAXPAYER_PROFILE_24.emailAddress,
        taxesZone: user.zone || SAMPLE_TAXPAYER_PROFILE_24.taxesZone,
      },
    };
  }

  return {
    isSampleIdentity: false,
    registrationNotLinked: true,
    profile: {
      taxpayerName: user.name || '—',
      tin: user.tin || '—',
      tinType: user.taxpayerType || '—',
      taxesCircle: user.circle || '—',
      registeredOn: user.registeredDate || '—',
      lastLoginAt: 'Active session',
      taxpayerStatus: user.taxpayerType || '—',
      tinSubtype: '—',
      userType: '—',
      localTaxpayer: '—',
      mobileNumber: user.phone || '—',
      emailAddress: user.email || '—',
      registeredAddress: '—',
      currentAddress: '—',
      taxesZone: user.zone || '—',
      taxesRange: '—',
      district: '—',
      country: '—',
      previousTin: '—',
      certificateIssuedOn: '—',
      certificateLastUpdatedOn: '—',
      issuingOfficer: '—',
      taxOfficeAddress: '—',
      taxOfficePhone: '—',
    },
  };
}
