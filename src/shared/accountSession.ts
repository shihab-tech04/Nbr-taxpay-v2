import type { UserProfile } from '../types/tax';
import { INITIAL_USER } from './mockData';

export type OtpDeliveryChannel = 'sms' | 'email';

export interface FirstLoginNotice {
  id: string;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  issuedAt: string;
}

export interface TinLookupResult {
  tin: string;
  userId: string;
  directoryMatched: true;
  maskedNameHint: string;
  maskedSms: string;
  maskedEmail: string;
  profile: UserProfile;
}

interface DirectoryRecord {
  userId: string;
  password: string;
  profile: UserProfile;
  notices: FirstLoginNotice[];
}

export function maskFirstThreeDigits(value: string, minDigits = 6): string {
  const digitCount = value.match(/[0-9]/g)?.length ?? 0;
  if (digitCount < minDigits) return value.trim() || '—';
  const visibleDigits = digitCount > 3 ? 3 : 0;
  let seen = 0;
  return [...value]
    .map((char) => {
      if (!/[0-9]/.test(char)) return char;
      seen += 1;
      return seen <= visibleDigits ? char : '*';
    })
    .join('');
}

export function maskHiddenEmailDomain(email: string): string {
  const trimmed = email.trim();
  if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return '****';
  const at = trimmed.indexOf('@');
  const local = trimmed.slice(0, at);
  return `${local.slice(0, 2)}${'*'.repeat(Math.max(3, local.length - 2))}@****.***`;
}

export const WALKIN_GUEST_USER: UserProfile = {
  tin: '',
  name: 'Walk-In Taxpayer',
  circle: '—',
  zone: '—',
  email: '',
  phone: '',
  registeredDate: '—',
  taxpayerType: 'Individual',
};

export const ISOLATED_SECONDARY_USER: UserProfile = {
  tin: '112233445566',
  name: 'Tasnim Chowdhury',
  circle: 'Circle-019',
  zone: 'Tax Zone-02, Chattogram',
  email: 'tasnim@chattogram.org',
  phone: '+8801911223344',
  registeredDate: '2024-02-11',
  taxpayerType: 'Individual',
};

const DIRECTORY_RECORDS: readonly DirectoryRecord[] = [
  {
    userId: 'user1',
    password: 'user1',
    profile: INITIAL_USER,
    notices: [
      {
        id: 'notice-welcome-2026',
        titleEn: 'First-Login Account Notice',
        titleBn: 'প্রথম লগইন অ্যাকাউন্ট বিজ্ঞপ্তি',
        bodyEn:
          'You are viewing the citizen frontend preview. Combined Payment Certificates are available per completed transaction; Tax Credit Certificates require live NBR backend verification.',
        bodyBn:
          'আপনি নাগরিক ফ্রন্টএন্ড প্রিভিউ দেখছেন। প্রতিটি সম্পন্ন লেনদেনের জন্য সম্মিলিত পেমেন্ট সনদ উপলব্ধ; কর রেয়াত সনদের জন্য এনবিআর ব্যাকএন্ড যাচাই প্রয়োজন।',
        issuedAt: '2026-11-27',
      },
      {
        id: 'notice-ay2526-review',
        titleEn: 'Verify Assessment Year & Contacts',
        titleBn: 'কর বর্ষ ও যোগাযোগ যাচাই করুন',
        bodyEn:
          'Review your masked TIN profile and confirm beneficiary details before previewing any tax challan.',
        bodyBn:
          'যেকোনো কর চালান প্রিভিউ করার আগে আপনার প্রোফাইল ও প্রাপকের তথ্য যাচাই করুন।',
        issuedAt: '2026-11-27',
      },
    ],
  },
  {
    userId: 'user2',
    password: 'user2',
    profile: ISOLATED_SECONDARY_USER,
    notices: [
      {
        id: 'notice-tasnim-welcome',
        titleEn: 'Chattogram Zone Notice',
        titleBn: 'চট্টগ্রাম অঞ্চল বিজ্ঞপ্তি',
        bodyEn:
          'Signed in under isolated taxpayer identity Tasnim Chowdhury. No data from other sample profiles is merged.',
        bodyBn:
          'পৃথক করদাতা তাসনিম চৌধুরী হিসেবে সাইন-ইন সম্পন্ন হয়েছে। অন্য কোনো প্রোফাইলের তথ্য যুক্ত হয়নি।',
        issuedAt: '2026-11-27',
      },
    ],
  },
];

export const VALID_DEMO_OTPS = new Set(['123456', '111111']);

export function resolveAccountStorageScope(isAuthenticated: boolean, tin?: string): string {
  const cleanTin = tin?.trim() ?? '';
  if (!isAuthenticated || !/^\d{12,13}$/.test(cleanTin)) {
    return 'walkin';
  }
  return `acct_${cleanTin}`;
}

export function lookupTinIdentity(rawIdentifier: string): TinLookupResult | null {
  const query = rawIdentifier.trim().toLowerCase();
  if (!query) return null;
  const matched = DIRECTORY_RECORDS.find(
    (entry) => entry.profile.tin === query || entry.userId.toLowerCase() === query
  );
  if (!matched) return null;

  return {
    tin: matched.profile.tin,
    userId: matched.userId,
    directoryMatched: true,
    maskedNameHint: `${matched.profile.name.slice(0, 2)}**** (${matched.profile.zone})`,
    maskedSms: maskFirstThreeDigits(matched.profile.phone, 6),
    maskedEmail: maskHiddenEmailDomain(matched.profile.email),
    profile: matched.profile,
  };
}

export function verifyDemoCredentials(rawIdentifier: string, password: string): TinLookupResult | null {
  const query = rawIdentifier.trim().toLowerCase();
  const matched = DIRECTORY_RECORDS.find(
    (entry) => entry.profile.tin === query || entry.userId.toLowerCase() === query
  );
  if (!matched) return null;
  if (password !== matched.password && password !== matched.profile.tin) return null;
  return lookupTinIdentity(matched.profile.tin);
}

export function getNoticesForTin(tin: string): FirstLoginNotice[] {
  const matched = DIRECTORY_RECORDS.find((entry) => entry.profile.tin === tin);
  return matched ? matched.notices : [];
}

export function verifySimulationOtp(
  otp: string
): { valid: true } | { valid: false; reason: 'format' | 'mismatch' } {
  if (!/^\d{6}$/.test(otp.trim())) {
    return { valid: false, reason: 'format' };
  }
  if (!VALID_DEMO_OTPS.has(otp.trim())) {
    return { valid: false, reason: 'mismatch' };
  }
  return { valid: true };
}

export function sanitizeReturnPath(rawReturnTo: string | null | undefined): string {
  if (!rawReturnTo) return '/dashboard';
  const trimmed = rawReturnTo.trim();
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('://') ||
    trimmed.startsWith('/login')
  ) {
    return '/dashboard';
  }
  return trimmed;
}
