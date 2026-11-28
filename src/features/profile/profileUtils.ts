import type { UserProfile } from '../../types/tax';
import { INITIAL_USER } from '../../shared/mockData';
import { SAMPLE_TAXPAYER_PROFILE_24 } from './profileData';
import type { TaxpayerProfile24 } from './profileTypes';

export function isSensitiveMaskValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '—' || trimmed.toUpperCase() === 'N/A') return false;
  return trimmed.replace(/\D/g, '').length >= 4 || trimmed.includes('@');
}

export function maskProfileTin(tin: string): string {
  const digits = tin.replace(/\D/g, '');
  if (digits.length < 4) {
    const trimmed = tin.trim();
    return trimmed === 'N/A' || trimmed === '—' || trimmed === '' ? trimmed || '—' : '••••';
  }
  return `${digits.slice(0, 3)}${'•'.repeat(digits.length - 3)}`;
}

export function maskProfilePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    const trimmed = phone.trim();
    return trimmed === 'N/A' || trimmed === '—' || trimmed === '' ? trimmed || '—' : '••••';
  }
  return `${digits.slice(0, 3)}${'•'.repeat(digits.length - 3)}`;
}

export function maskProfileEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed || trimmed === '—' || trimmed.toUpperCase() === 'N/A') return trimmed || '—';
  const parts = trimmed.split('@');
  if (parts.length !== 2) return '••••@••••';
  const [local, domain] = parts;
  const visibleLocal = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  const domainLabels = domain.split('.');
  const firstLabel = domainLabels[0] ?? '';
  const visibleDomainHead = firstLabel.slice(0, 1);
  const maskedDomainLabels = domainLabels.map((label, idx) =>
    idx === 0 ? `${visibleDomainHead}••••` : '•'.repeat(Math.max(2, label.length))
  );
  return `${visibleLocal}••••@${maskedDomainLabels.join('.')}`;
}

export function formatProfileValue(
  key: string,
  value: string,
  revealed: boolean
): string {
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
): { profile: TaxpayerProfile24; isSampleIdentity: boolean } {
  const useSampleFixture =
    publicPreview || !isAuthenticated || user.tin === INITIAL_USER.tin;

  if (useSampleFixture) {
    return {
      isSampleIdentity: true,
      profile: {
        ...SAMPLE_TAXPAYER_PROFILE_24,
        taxpayerName: user.name || SAMPLE_TAXPAYER_PROFILE_24.taxpayerName,
        tin: user.tin || SAMPLE_TAXPAYER_PROFILE_24.tin,
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
    profile: {
      taxpayerName: user.name || '—',
      tin: user.tin || '—',
      tinType: user.taxpayerType || '—',
      taxesCircle: user.circle || '—',
      registeredOn: user.registeredDate || '—',
      lastLoginAt: 'Active session',
      taxpayerStatus: '—',
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
      certificateIssuedOn: '—',
      certificateLastUpdatedOn: '—',
      issuingOfficer: '—',
      taxOfficeAddress: '—',
      taxOfficePhone: '—',
      previousTin: '—',
    },
  };
}
