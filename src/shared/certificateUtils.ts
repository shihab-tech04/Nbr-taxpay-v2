import type { PaymentLineItem, PaymentTransaction } from '../types/tax';

export interface PaymentCertificateRecord {
  certificateId: string;
  transactionRef: string;
  challanNumber: string;
  bankRef: string;
  createdAt: string;
  paymentChannel: PaymentTransaction['paymentChannel'];
  taxpayerTin: string;
  taxpayerName: string;
  beneficiaryTin?: string;
  beneficiaryName?: string;
  giftDate?: string;
  items: readonly PaymentLineItem[];
  assessmentYears: string;
  totalAmount: number;
  lifecycleMode: 'signed_in' | 'walk_in';
  lifecycleNoteEn: string;
  lifecycleNoteBn: string;
}

export function buildPaymentCertificateRecord(
  tx: PaymentTransaction,
  isAuthenticated: boolean
): PaymentCertificateRecord | null {
  if (tx.status !== 'Completed') return null;
  const years = Array.from(new Set(tx.items.map((item) => item.assessmentYear))).filter(Boolean);
  const mode = isAuthenticated ? 'signed_in' : 'walk_in';

  return {
    certificateId: `CERT-${tx.transactionRef}`,
    transactionRef: tx.transactionRef,
    challanNumber: tx.challanNumber,
    bankRef: tx.bankRef,
    createdAt: tx.createdAt,
    paymentChannel: tx.paymentChannel,
    taxpayerTin: tx.taxpayerTin,
    taxpayerName: tx.taxpayerName,
    beneficiaryTin: tx.beneficiaryTin,
    beneficiaryName: tx.beneficiaryName,
    giftDate: tx.giftDate,
    items: tx.items,
    assessmentYears: years.join(', ') || '—',
    totalAmount: tx.totalAmount,
    lifecycleMode: mode,
    lifecycleNoteEn: isAuthenticated
      ? 'Signed-in browser preview: combined payment certificate linked to current session ledger (official verification requires SQL/API backend).'
      : 'Walk-in browser preview: combined payment certificate available for immediate print/download in this session without server account binding.',
    lifecycleNoteBn: isAuthenticated
      ? 'সাইন-ইন ব্রাউজার প্রিভিউ: এই সেশনের সম্মিলিত পেমেন্ট সনদ (সরকারি যাচাইয়ের জন্য ব্যাকএন্ড সংযোগ প্রয়োজন)।'
      : 'ওয়াক-ইন ব্রাউজার প্রিভিউ: অ্যাকাউন্ট সংযোগ ছাড়াই এই সেশনে তাৎক্ষণিক প্রিন্ট বা ডাউনলোডের জন্য উপলব্ধ।',
  };
}

function escapePdfText(input: string): string {
  const asciiOnly = input.replace(/[^\x20-\x7E]/g, ' ');
  return asciiOnly.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function buildCertificatePdfLines(cert: PaymentCertificateRecord): string[] {
  const lines = [
    'SOHOJKOR CITIZEN PORTAL - SAMPLE PAYMENT CERTIFICATE (UI PREVIEW)',
    'Illustrative preview only. Not an official NBR or Tax Credit certificate.',
    `Certificate ID: ${cert.certificateId}`,
    `Transaction Ref: ${cert.transactionRef} | Challan: ${cert.challanNumber}`,
    `Bank Ref: ${cert.bankRef} | Channel: ${cert.paymentChannel}`,
    `Date: ${cert.createdAt} | Mode: ${cert.lifecycleMode === 'signed_in' ? 'Signed-In' : 'Walk-In'}`,
    `Payer: ${cert.taxpayerName} (TIN: ${cert.taxpayerTin})`,
  ];
  if (cert.beneficiaryTin) {
    lines.push(`Beneficiary: ${cert.beneficiaryName ?? 'Recipient'} (TIN: ${cert.beneficiaryTin})`);
  }
  lines.push(`Assessment Year(s): ${cert.assessmentYears}`);
  cert.items.forEach((item, idx) => {
    lines.push(
      `Item ${idx + 1}: [${item.headCode}] ${item.headNameEn} (${item.assessmentYear}) - BDT ${item.amount.toLocaleString('en-US')}`
    );
  });
  lines.push(`Sample Total Amount: BDT ${cert.totalAmount.toLocaleString('en-US')}`);
  return lines;
}

export function buildSamplePdfBytes(lines: readonly string[]): Uint8Array {
  const textCommands = [
    'BT',
    '/F1 10 Tf',
    '42 752 Td',
    '15 TL',
    ...lines.map((line, i) => `${i === 0 ? '' : 'T* '}(${escapePdfText(line)}) Tj`),
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
