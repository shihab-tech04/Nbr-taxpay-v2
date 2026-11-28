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
  directoryMatched: boolean;
  maskedNameHint: string;
  maskedSms: string;
  maskedEmail: string;
  profile: UserProfile;
}

interface DirectoryRecord {
  profile: UserProfile;
  notices: FirstLoginNotice[];
}

function maskTinDigitsOnly(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  return `${digits.slice(0, 3)}${'•'.repeat(digits.length - 3)}`;
}

function maskEmailValue(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return '••••@••••.•••';
  const [local, domain] = parts;
  const visibleLocal = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  const labels = domain.split('.');
  return `${visibleLocal}••••@${labels.map((l, i) => (i === 0 ? `${l.slice(0, 1)}••••` : '•••')).join('.')}`;
}

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

export function lookupTinIdentity(rawTin: string): TinLookupResult | null {
  const tin = rawTin.trim();
  if (!/^\d{12}$/.test(tin)) return null;

  const matched = DIRECTORY_RECORDS.find((entry) => entry.profile.tin === tin);
  if (matched) {
    return {
      tin,
      directoryMatched: true,
      maskedNameHint: `${matched.profile.name.slice(0, 2)}•••• (${matched.profile.zone})`,
      maskedSms: maskTinDigitsOnly(matched.profile.phone),
      maskedEmail: maskEmailValue(matched.profile.email),
      profile: matched.profile,
    };
  }

  return {
    tin,
    directoryMatched: false,
    maskedNameHint: `TIN ${maskTinDigitsOnly(tin)}`,
    maskedSms: '017••••••••',
    maskedEmail: 'tp••••@s••••.•••',
    profile: {
      tin,
      name: `Taxpayer ${maskTinDigitsOnly(tin)}`,
      circle: '—',
      zone: '—',
      email: '',
      phone: '',
      registeredDate: '—',
      taxpayerType: 'Individual',
    },
  };
}

export function getNoticesForTin(tin: string): FirstLoginNotice[] {
  const matched = DIRECTORY_RECORDS.find((entry) => entry.profile.tin === tin);
  if (matched) return matched.notices;
  return [
    {
      id: `notice-generic-${tin}`,
      titleEn: 'First-Login Security Reminder',
      titleBn: 'প্রথম লগইন নিরাপত্তা বার্তা',
      bodyEn: 'Sensitive TIN fields stay masked by default. Entering a TIN alone never unlocks private records.',
      bodyBn: 'সংবেদনশীল টিআইএন তথ্য ডিফল্টভাবে গোপন থাকে। শুধুমাত্র টিআইএন টাইপ করলে ব্যক্তিগত তথ্য উন্মুক্ত হয় না।',
      issuedAt: '2026-11-27',
    },
  ];
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
