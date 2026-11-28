import { isValidYmd } from '../design-system/dates/dateUtils';
import type { GiftDetails } from '../types/giftTax';
import type { PaymentLineItem, PaymentTransaction, TravelDetails } from '../types/tax';
import { resolveAccountStorageScope } from './accountSession';

export interface PaymentCertificateRecord {
  certificateId: string;
  transactionRef: string;
  challanNumber: string;
  bankRef: string;
  createdAt: string;
  paymentChannel: PaymentTransaction['paymentChannel'];
  ownerScope: string;
  taxpayerTin: string;
  taxpayerName: string;
  beneficiaryTin?: string;
  beneficiaryName?: string;
  giftDate?: string;
  giftDetails?: GiftDetails;
  travelDetails?: TravelDetails;
  items: readonly PaymentLineItem[];
  assessmentYears: string;
  totalAmount: number;
  lifecycleMode: 'signed_in' | 'walk_in';
  lifecycleNoteEn: string;
  lifecycleNoteBn: string;
}

export function isTransactionReconciled(tx: PaymentTransaction): boolean {
  if (!tx.items.length || !Number.isFinite(tx.totalAmount)) return false;
  const allowZero = tx.category === 'travel_tax';
  if (allowZero ? tx.totalAmount < 0 : tx.totalAmount <= 0) return false;
  if (tx.items.some((i) => !Number.isFinite(i.amount) || i.amount < 0)) return false;
  const itemsTotal = tx.items.reduce((sum, item) => sum + item.amount, 0);
  return Math.round(itemsTotal * 100) === Math.round(tx.totalAmount * 100);
}

export function buildPaymentCertificateRecord(
  tx: PaymentTransaction,
  fallbackAuthenticated = false
): PaymentCertificateRecord | null {
  if (tx.status !== 'Completed') return null;
  const isZeroTravel = tx.category === 'travel_tax' && tx.totalAmount === 0;
  if (!tx.transactionRef.trim() || !tx.challanNumber.trim() || (!isZeroTravel && !tx.bankRef.trim())) return null;
  if (!isTransactionReconciled(tx)) return null;

  const years = Array.from(new Set(tx.items.map((item) => item.assessmentYear))).filter(Boolean);
  const mode: 'signed_in' | 'walk_in' =
    tx.originMode ?? (fallbackAuthenticated ? 'signed_in' : 'walk_in');
  const ownerScope =
    tx.ownerScope ?? resolveAccountStorageScope(mode === 'signed_in', tx.taxpayerTin);

  return {
    certificateId: `CERT-${tx.transactionRef}`,
    transactionRef: tx.transactionRef,
    challanNumber: tx.challanNumber,
    bankRef: tx.bankRef,
    createdAt: tx.createdAt,
    paymentChannel: isZeroTravel ? 'Zero-Tax' : tx.paymentChannel,
    ownerScope,
    taxpayerTin: tx.taxpayerTin,
    taxpayerName: tx.taxpayerName,
    beneficiaryTin: tx.beneficiaryTin,
    beneficiaryName: tx.beneficiaryName,
    giftDate: tx.giftDate && isValidYmd(tx.giftDate) ? tx.giftDate : undefined,
    giftDetails: tx.giftDetails,
    travelDetails: tx.travelDetails,
    items: tx.items,
    assessmentYears: years.join(', ') || '—',
    totalAmount: tx.totalAmount,
    lifecycleMode: mode,
    lifecycleNoteEn:
      mode === 'signed_in'
        ? 'Signed-in browser preview: combined payment certificate linked to current account session ledger (official settlement requires live backend).'
        : 'Walk-in browser preview: combined payment certificate created without account login and available for immediate print/download only.',
    lifecycleNoteBn:
      mode === 'signed_in'
        ? 'সাইন-ইন ব্রাউজার প্রিভিউ: এই অ্যাকাউন্ট সেশনের সম্মিলিত পেমেন্ট সনদ (সরকারি নিষ্পত্তির জন্য লাইভ ব্যাকএন্ড প্রয়োজন)।'
        : 'ওয়াক-ইন ব্রাউজার প্রিভিউ: অ্যাকাউন্ট লগইন ছাড়া তৈরি হয়েছে; তাৎক্ষণিক প্রিন্ট ও ডাউনলোডের জন্য উপলব্ধ।',
  };
}

export function buildCertificatePdfLines(cert: PaymentCertificateRecord): string[] {
  const bankShow = cert.bankRef.trim() || 'Not Applicable (Zero-Tax)';
  const channelShow = cert.paymentChannel === 'Zero-Tax' ? 'Zero-Tax Assessment' : cert.paymentChannel;
  const lines = [
    'SOHOJKOR CITIZEN PORTAL · সহজকর নাগরিক পোর্টাল — SAMPLE PAYMENT CERTIFICATE',
    'Illustrative UI preview only. Never official NBR settlement or Tax Credit verification.',
    `Certificate ID: ${cert.certificateId}`,
    `Transaction Ref: ${cert.transactionRef} | Challan: ${cert.challanNumber}`,
    `Bank Ref: ${bankShow} | Channel: ${channelShow}`,
    `Date: ${cert.createdAt} | Origin: ${cert.lifecycleMode === 'signed_in' ? 'Signed-In' : 'Walk-In'}`,
    `Payer: ${cert.taxpayerName || 'Walk-In Taxpayer'} (TIN: ${cert.taxpayerTin || 'Walk-In'})`,
  ];
  if (cert.giftDetails) {
    const g = cert.giftDetails;
    lines.push(`Credit Attribution & On Behalf Of (Donor): ${g.onBehalfOfName} (TIN: ${g.onBehalfOfTin})`);
    lines.push(`Through (Donee): ${g.throughName} (TIN: ${g.throughTin}) | Relationship: ${g.relationship} (${g.relationshipTag})`);
    lines.push(`Gift Value: BDT ${g.giftValue.toLocaleString('en-US')} | Date of Gift: ${g.giftDate}`);
    lines.push(`Gift Description: ${g.description}${g.remarks ? ` | Remarks: ${g.remarks}` : ''}`);
  } else if (cert.beneficiaryTin) {
    lines.push(`Recipient: ${cert.beneficiaryName ?? 'Recipient'} (TIN: ${cert.beneficiaryTin})`);
  }
  if (!cert.giftDetails && cert.giftDate) {
    lines.push(`Date of Gift: ${cert.giftDate}`);
  }
  if (cert.travelDetails) {
    const td = cert.travelDetails;
    const passportShow = td.passportMasked ?? td.passportNumber ?? '—';
    const routeMeta = [td.travelMode, td.departurePort, td.destination, td.travelDate].filter(Boolean).join(' · ');
    lines.push(`Travel: ${td.passengerName ?? ''} | Passport: ${passportShow} | ${routeMeta}`);
  }
  lines.push(`Assessment Year(s): ${cert.assessmentYears}`);
  cert.items.forEach((item, idx) => {
    const ownerTag = item.taxpayerTin ? ` [${item.taxpayerName ?? ''} ${item.taxpayerTin}]` : '';
    const noteTag = item.remarks ? ` — Note: ${item.remarks}` : '';
    lines.push(
      `Item ${idx + 1}:${ownerTag} [${item.headCode}] ${item.headNameEn} / ${item.headNameBn} (${item.assessmentYear}) — ৳ ${item.amount.toLocaleString('en-US')}${noteTag}`
    );
  });
  lines.push(`Reconciled Sample Total: ৳ ${cert.totalAmount.toLocaleString('en-US')}`);
  return lines;
}

function escapePdfAscii(input: string): string {
  const asciiOnly = input.replace(/[^\x20-\x7E]/g, ' ');
  return asciiOnly.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function buildSamplePdfBytes(lines: readonly string[]): Uint8Array {
  const textCommands = [
    'BT',
    '/F1 10 Tf',
    '42 752 Td',
    '15 TL',
    ...lines.map((line, i) => `${i === 0 ? '' : 'T* '}(${escapePdfAscii(line)}) Tj`),
    'ET',
  ].join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let body = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(body.length);
    body += obj;
  }
  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return new TextEncoder().encode(body);
}

export function downloadSamplePdf(filename: string, lines: readonly string[]): boolean {
  if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
    return false;
  }
  const bytes = buildSamplePdfBytes(lines);
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  const blob = new Blob([copy.buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
