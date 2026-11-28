import type { GiftPartyRecord } from '../types/giftTax';
import type { Beneficiary } from '../types/tax';
import { lookupTinIdentity } from './accountSession';

export const DIRECTORY_SUGGESTED_TINS: readonly string[] = [
  '882349102384',
  '992384102938',
  '773492019283',
  '112938475601',
  '112233445566',
  '445566778899',
];

const SAMPLE_TAXPAYER_RECORDS: readonly GiftPartyRecord[] = [
  { tin: '992384102938', name: 'Mrs. Fatema Begum', classification: 'Individual' },
  { tin: '773492019283', name: 'Tanvir Islam', classification: 'Individual' },
  { tin: '112938475601', name: 'GreenCorp Ltd.', classification: 'Company' },
  { tin: '445566778899', name: 'Karim Chowdhury', classification: 'Individual' },
  { tin: '556677889900', name: 'Farhana Rahman', classification: 'Individual' },
];

export function lookupTaxpayerDirectoryRecord(
  rawTin: string,
  beneficiaries: readonly Beneficiary[] = []
): GiftPartyRecord | null {
  const cleanTin = rawTin.trim();
  if (!/^\d{12}$/.test(cleanTin)) return null;
  const acct = lookupTinIdentity(cleanTin);
  if (acct) {
    return {
      tin: acct.tin,
      name: acct.profile.name,
      classification: acct.profile.taxpayerType,
    };
  }
  const ben = beneficiaries.find((b) => b.tin.trim() === cleanTin);
  if (ben) {
    return {
      tin: cleanTin,
      name: ben.name.trim() || ben.relationship,
      classification: 'Saved Beneficiary',
    };
  }
  const sample = SAMPLE_TAXPAYER_RECORDS.find((p) => p.tin === cleanTin);
  return sample ? { ...sample } : null;
}
