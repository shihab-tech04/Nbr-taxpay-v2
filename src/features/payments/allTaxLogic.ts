import { validateCurrencyAmount } from '../../design-system/forms';
import { TAX_HEADS } from '../../shared/mockData';
import type { PaymentDraft, PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { ALL_TAX_CATEGORIES } from './allTaxCatalogue';

export const ALLOWED_ASSESSMENT_YEARS = new Set(['2024-2025', '2025-2026', '2026-2027']);

export const INITIAL_ALL_TAX_ITEMS: PaymentLineItem[] = [
  {
    headId: TAX_HEADS[0].id, headCode: TAX_HEADS[0].code, headNameEn: TAX_HEADS[0].nameEn, headNameBn: TAX_HEADS[0].nameBn,
    assessmentYear: '2025-2026', amount: 15000, category: TAX_HEADS[0].category, remarks: 'Annual return submission',
  },
];

const ALL_CATEGORY_SET = new Set<TaxHeadCategory>(ALL_TAX_CATEGORIES.map((c) => c.id));

export function rankFrequentPaymentCategories(
  transactions: readonly PaymentTransaction[],
  isAuthenticated: boolean,
  limit = 5
): TaxHeadCategory[] {
  if (!isAuthenticated || !Number.isInteger(limit) || limit < 1) return [];
  const counts = new Map<TaxHeadCategory, { count: number; last: number }>();
  let completedCount = 0;
  for (const tx of transactions) {
    if (tx.status !== 'Completed') continue;
    const timestamp = Date.parse(tx.createdAt);
    if (!Number.isFinite(timestamp)) continue;
    const txCategories = new Set<TaxHeadCategory>();
    if (ALL_CATEGORY_SET.has(tx.category)) txCategories.add(tx.category);
    for (const item of tx.items) {
      const itemCat = item.category ?? TAX_HEADS.find((h) => h.id === item.headId)?.category;
      if (itemCat && ALL_CATEGORY_SET.has(itemCat)) txCategories.add(itemCat);
    }
    if (txCategories.size === 0) continue;
    completedCount += 1;
    for (const cat of txCategories) {
      const prev = counts.get(cat);
      counts.set(cat, { count: (prev?.count ?? 0) + 1, last: Math.max(prev?.last ?? 0, timestamp) });
    }
  }
  if (completedCount < 2) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count || b[1].last - a[1].last || a[0].localeCompare(b[0]))
    .slice(0, Math.min(5, limit))
    .map(([category]) => category);
}

export function normalizeChallanRemarks(raw: string): string {
  return raw.replace(/\r\n/g, '\n').trim().slice(0, 500);
}

export type CombinedRuleErrorReason = 'duplicate_line' | 'return_single_ay_per_taxpayer' | 'return_cannot_mix_same_taxpayer';

export function validateCombinedLineAddition(
  existingItems: readonly PaymentLineItem[],
  candidate: PaymentLineItem,
  defaultTaxpayerKey = 'SELF'
): { ok: true } | { ok: false; reason: CombinedRuleErrorReason } {
  const candidateTin = (candidate.taxpayerTin ?? defaultTaxpayerKey).trim() || defaultTaxpayerKey;
  const candidateCat = candidate.category ?? TAX_HEADS.find((h) => h.id === candidate.headId)?.category ?? 'other_tax';
  for (const item of existingItems) {
    const itemTin = (item.taxpayerTin ?? defaultTaxpayerKey).trim() || defaultTaxpayerKey;
    const itemCat = item.category ?? TAX_HEADS.find((h) => h.id === item.headId)?.category ?? 'other_tax';
    if (itemTin === candidateTin && item.headId === candidate.headId && item.assessmentYear === candidate.assessmentYear) {
      return { ok: false, reason: 'duplicate_line' };
    }
    if (itemTin !== candidateTin) continue;
    if (itemCat === 'tax_with_return' && candidateCat === 'tax_with_return' && item.assessmentYear !== candidate.assessmentYear) {
      return { ok: false, reason: 'return_single_ay_per_taxpayer' };
    }
    if ((itemCat === 'tax_with_return' && candidateCat !== 'tax_with_return') || (itemCat !== 'tax_with_return' && candidateCat === 'tax_with_return')) {
      return { ok: false, reason: 'return_cannot_mix_same_taxpayer' };
    }
  }
  return { ok: true };
}

export function reconcileItemsWithTaxpayers(
  items: readonly PaymentLineItem[],
  activeTaxpayers: readonly { tin: string; name: string }[],
  liabilityMode: 'own' | 'facilitation'
): { validItems: PaymentLineItem[]; removedCount: number } {
  const allowedTins = new Set(
    (liabilityMode === 'own' ? activeTaxpayers.slice(0, 1) : activeTaxpayers).map((tp) => tp.tin.trim()).filter(Boolean)
  );
  if (allowedTins.size === 0) return { validItems: [], removedCount: items.length };
  const validItems: PaymentLineItem[] = [];
  let removedCount = 0;
  for (const item of items) {
    const itemTin = (item.taxpayerTin ?? '').trim();
    if (!itemTin || !allowedTins.has(itemTin)) { removedCount += 1; continue; }
    validItems.push(item);
  }
  return { validItems, removedCount };
}

export function validateResumedOrReusedSeed(input: {
  draft?: PaymentDraft; reuseTx?: PaymentTransaction; activeScope: string; isAuthenticated: boolean; userTin: string;
}): { items: PaymentLineItem[]; warning?: 'owner_mismatch' | 'pruned_invalid' } {
  const { draft, reuseTx, activeScope, isAuthenticated, userTin } = input;
  if (reuseTx?.ownerScope && isAuthenticated && reuseTx.ownerScope !== activeScope && reuseTx.claimedByTin !== userTin) {
    return { items: [], warning: 'owner_mismatch' };
  }
  const rawItems = draft?.items ?? reuseTx?.items ?? [];
  const validItems: PaymentLineItem[] = [];
  let pruned = false;
  for (const raw of rawItems) {
    const head = TAX_HEADS.find((h) => h.id === raw.headId && ALL_CATEGORY_SET.has(h.category));
    if (!head || !ALLOWED_ASSESSMENT_YEARS.has(raw.assessmentYear) || !Number.isFinite(raw.amount) || raw.amount < 100) { pruned = true; continue; }
    const tpTin = (raw.taxpayerTin ?? (isAuthenticated ? userTin : '')).trim();
    if (!/^\d{12,13}$/.test(tpTin)) { pruned = true; continue; }
    const candidate: PaymentLineItem = { ...raw, taxpayerTin: tpTin, category: head.category, remarks: normalizeChallanRemarks(raw.remarks ?? '') };
    if (!validateCombinedLineAddition(validItems, candidate, tpTin).ok) { pruned = true; continue; }
    validItems.push(candidate);
  }
  return { items: validItems, warning: pruned ? 'pruned_invalid' : undefined };
}

export type AddItemResult =
  | { ok: true; item: PaymentLineItem }
  | { ok: false; reason: 'min' | 'invalid' | 'missing_head' | 'missing_taxpayer' | 'invalid_ay' };

export function validateAndBuildTaxItem(input: {
  selectedHeadId: string; amountInput: string; assessmentYear: string; remarks: string; taxpayerTin?: string; taxpayerName?: string;
}): AddItemResult {
  const cleanTin = (input.taxpayerTin ?? '').trim();
  if (!/^\d{12,13}$/.test(cleanTin)) return { ok: false, reason: 'missing_taxpayer' };
  if (!ALLOWED_ASSESSMENT_YEARS.has(input.assessmentYear)) return { ok: false, reason: 'invalid_ay' };
  const head = TAX_HEADS.find((h) => h.id === input.selectedHeadId && ALL_CATEGORY_SET.has(h.category));
  const amountCheck = validateCurrencyAmount(input.amountInput, { minAmount: 100, decimalScale: 2, required: true });
  if (!amountCheck.valid || amountCheck.numericValue === null) {
    return { ok: false, reason: amountCheck.reason === 'min' || amountCheck.reason === 'required' ? 'min' : 'invalid' };
  }
  if (!head) return { ok: false, reason: 'missing_head' };
  return {
    ok: true,
    item: {
      headId: head.id, headCode: head.code, headNameEn: head.nameEn, headNameBn: head.nameBn,
      assessmentYear: input.assessmentYear, amount: amountCheck.numericValue,
      taxpayerTin: cleanTin, taxpayerName: input.taxpayerName?.trim() || undefined,
      category: head.category, remarks: normalizeChallanRemarks(input.remarks),
    },
  };
}

export function resolveAllTaxPayerAndRecipients(params: {
  isAuthenticated: boolean; userTin: string; userName: string;
  selectedTaxpayers: readonly { tin: string; name: string }[]; items: readonly PaymentLineItem[];
  legacyBeneficiaryTin?: string; legacyBeneficiaryName?: string;
}) {
  const payerTin = params.isAuthenticated ? params.userTin : (params.selectedTaxpayers[0]?.tin ?? params.items[0]?.taxpayerTin ?? '');
  const payerName = params.isAuthenticated ? params.userName : (params.selectedTaxpayers[0]?.name ?? params.items[0]?.taxpayerName ?? 'Walk-In Taxpayer');
  const recipientMap = new Map<string, string>();
  for (const item of params.items) {
    const tin = item.taxpayerTin?.trim();
    if (tin && tin !== payerTin) recipientMap.set(tin, item.taxpayerName?.trim() || tin);
  }
  if (recipientMap.size === 0) {
    for (const tp of params.selectedTaxpayers) {
      if (tp.tin.trim() && tp.tin.trim() !== payerTin) recipientMap.set(tp.tin.trim(), tp.name.trim() || tp.tin.trim());
    }
  }
  const recipients = [...recipientMap.entries()].map(([tin, name]) => ({ tin, name }));
  const beneficiaryTin = recipients.length > 0 ? recipients.map((r) => r.tin).join(', ') : (params.legacyBeneficiaryTin?.trim() || undefined);
  const beneficiaryName = recipients.length > 0 ? recipients.map((r) => r.name).join(', ') : (params.legacyBeneficiaryName?.trim() || undefined);
  return { payerTin, payerName, recipients, beneficiaryTin, beneficiaryName };
}

export function calculateItemsTotal(items: readonly PaymentLineItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}
