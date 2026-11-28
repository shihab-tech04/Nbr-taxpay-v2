import type {
  AppNotification,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
} from '../types/tax';

export function sortNotificationsNewest(items: AppNotification[]): AppNotification[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function buildPaymentNotification(
  scope: string,
  tx: PaymentTransaction
): AppNotification {
  const firstItem = tx.items[0];
  const isZero = tx.category === 'travel_tax' && tx.totalAmount === 0;
  return {
    id: `notif-${tx.id}`,
    ownerScope: scope,
    kind: 'payment',
    titleEn: isZero
      ? `Zero-Tax Travel Assessment (${tx.transactionRef})`
      : `Sample Payment Recorded (${tx.transactionRef})`,
    titleBn: isZero
      ? `শূন্য-কর ভ্রমণ মূল্যায়ন সম্পন্ন (${tx.transactionRef})`
      : `নমুনা পেমেন্ট সংরক্ষিত হয়েছে (${tx.transactionRef})`,
    bodyEn: isZero
      ? `${firstItem?.headNameEn ?? 'Travel Tax'} completed without online payment.`
      : `${firstItem?.headNameEn ?? tx.category} — ৳ ${tx.totalAmount.toLocaleString()} via ${tx.paymentChannel}.`,
    bodyBn: isZero
      ? `${firstItem?.headNameBn ?? 'ভ্রমণ কর'} অনলাইন পেমেন্ট ছাড়াই সম্পন্ন হয়েছে।`
      : `${firstItem?.headNameBn ?? tx.category} — ৳ ${tx.totalAmount.toLocaleString()} (${tx.paymentChannel})।`,
    createdAt: tx.createdAt,
    targetRoute: `/history?ref=${encodeURIComponent(tx.transactionRef)}`,
    targetRef: tx.transactionRef,
    amount: tx.totalAmount,
    headLabel: firstItem ? `${firstItem.headCode} · ${firstItem.headNameEn}` : undefined,
    assessmentYear: firstItem?.assessmentYear,
  };
}

export function buildDraftNotification(
  scope: string,
  draft: PaymentDraft
): AppNotification {
  const first = draft.items[0];
  const total = draft.items.reduce((sum, item) => sum + item.amount, 0);
  return {
    id: `notif-${draft.id}`,
    ownerScope: scope,
    kind: 'draft',
    titleEn: `Tax Draft Saved (${draft.title})`,
    titleBn: `কর খসড়া সংরক্ষিত হয়েছে (${draft.title})`,
    bodyEn: `${draft.items.length} item(s) · ৳ ${total.toLocaleString()} saved to resume later.`,
    bodyBn: `${draft.items.length}টি আইটেম · ৳ ${total.toLocaleString()} পরবর্তীতে সম্পন্ন করার জন্য সংরক্ষিত।`,
    createdAt: new Date().toISOString(),
    targetRoute: `/drafts?draftId=${encodeURIComponent(draft.id)}`,
    targetRef: draft.id,
    amount: total,
    assessmentYear: first?.assessmentYear,
  };
}

export function buildCorrectionNotification(
  scope: string,
  correction: CorrectionRequest
): AppNotification {
  return {
    id: `notif-${correction.id}`,
    ownerScope: scope,
    kind: 'correction',
    titleEn: `Correction Submitted (${correction.ticketNumber ?? correction.challanNumber})`,
    titleBn: `সংশোধনের আবেদন জমা হয়েছে (${correction.ticketNumber ?? correction.challanNumber})`,
    bodyEn: `${correction.reason} — request logged for review.`,
    bodyBn: `${correction.reason} — পর্যালোচনার জন্য নথিভুক্ত হয়েছে।`,
    createdAt: new Date().toISOString(),
    targetRoute: `/corrections?ticketId=${encodeURIComponent(correction.id)}`,
    targetRef: correction.ticketNumber ?? correction.challanNumber,
  };
}

export function prependScopedNotification(
  existing: AppNotification[],
  next: AppNotification
): AppNotification[] {
  const filtered = existing.filter((item) => item.id !== next.id);
  return sortNotificationsNewest([next, ...filtered]);
}
