import type { PaymentTransaction } from '../../types/tax';

export function formatTxBeneficiarySummary(tx: PaymentTransaction, isBn: boolean): string {
  if (tx.beneficiaryTin || tx.beneficiaryName) {
    return `${tx.beneficiaryName || (isBn ? 'প্রাপক' : 'Beneficiary')}${tx.beneficiaryTin ? ` (${tx.beneficiaryTin})` : ''}`;
  }
  const extraTins = Array.from(
    new Set(
      tx.items
        .map((i) => i.taxpayerTin?.trim())
        .filter((tin): tin is string => Boolean(tin && tin !== tx.taxpayerTin))
    )
  );
  if (extraTins.length === 1) {
    const match = tx.items.find((i) => i.taxpayerTin === extraTins[0]);
    return `${match?.taxpayerName || extraTins[0]} (${extraTins[0]})`;
  }
  if (extraTins.length > 1) {
    return isBn ? `${extraTins.length}জন করদাতা` : `${extraTins.length} taxpayers`;
  }
  return isBn ? 'নিজস্ব / প্রযোজ্য নয়' : 'Self / —';
}

export function formatTxHeadSummary(tx: PaymentTransaction, isBn: boolean): string {
  const first = tx.items[0];
  if (!first) return tx.category.replace(/_/g, ' ');
  const label = `[${first.headCode}] ${isBn ? first.headNameBn : first.headNameEn}`;
  return tx.items.length > 1 ? `${label} (+${tx.items.length - 1})` : label;
}

export function formatTxAySummary(tx: PaymentTransaction): string {
  const years = Array.from(new Set(tx.items.map((i) => i.assessmentYear).filter(Boolean)));
  return years.length > 0 ? years.join(', ') : '—';
}

export function matchesHistorySearch(tx: PaymentTransaction, rawQuery: string, isBn: boolean): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    tx.transactionRef,
    tx.challanNumber,
    tx.taxpayerTin,
    tx.taxpayerName,
    tx.beneficiaryTin ?? '',
    tx.beneficiaryName ?? '',
    tx.category,
    tx.paymentChannel,
    formatTxHeadSummary(tx, isBn),
    formatTxAySummary(tx),
  ];
  return haystacks.some((h) => h.toLowerCase().includes(q));
}
