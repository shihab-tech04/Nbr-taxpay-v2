import type { Beneficiary, PaymentDraft, PaymentTransaction } from '../../types/tax';
import { reconcileItemsWithTaxpayers, validateResumedOrReusedSeed } from './allTaxLogic';
import type { SelectedTaxpayerEntry } from './components/AllTaxTaxpayerStep';

export interface AllTaxRouteState {
  draftId?: string;
  reuseTxRef?: string;
  beneficiaryId?: string;
  resumeDraft?: unknown;
  reuseTx?: unknown;
  selectedBeneficiary?: unknown;
}

export function buildInitialTaxpayers(
  isAuthenticated: boolean,
  userTin: string,
  userName: string,
  seed?: {
    resolvedBeneficiary?: Beneficiary | null;
    resolvedDraft?: PaymentDraft | null;
    resolvedTx?: PaymentTransaction | null;
    beneficiaries?: readonly Beneficiary[];
  }
): SelectedTaxpayerEntry[] {
  if (seed?.resolvedBeneficiary) {
    const label = seed.resolvedBeneficiary.name.trim() || seed.resolvedBeneficiary.relationship;
    return [{ tin: seed.resolvedBeneficiary.tin, name: label, source: 'beneficiary' }];
  }
  const benTins = new Set((seed?.beneficiaries ?? []).map((b) => b.tin));
  const fromItems = (seed?.resolvedDraft?.items ?? seed?.resolvedTx?.items ?? [])
    .filter((i) => i.taxpayerTin)
    .map((i) => ({
      tin: i.taxpayerTin!,
      name: i.taxpayerName ?? i.taxpayerTin!,
      source: (i.taxpayerTin === userTin ? 'self' : benTins.has(i.taxpayerTin!) ? 'beneficiary' : 'one_time') as SelectedTaxpayerEntry['source'],
    }));
  if (fromItems.length > 0) {
    const unique = new Map<string, SelectedTaxpayerEntry>();
    fromItems.forEach((tp) => unique.set(tp.tin, tp));
    return [...unique.values()];
  }
  return isAuthenticated && userTin ? [{ tin: userTin, name: userName, source: 'self' }] : [];
}

export function resolveInitialAllTaxState(params: {
  routeState: AllTaxRouteState | null;
  draftIdParam?: string | null;
  reuseRefParam?: string | null;
  beneficiaryIdParam?: string | null;
  drafts: readonly PaymentDraft[];
  transactions: readonly PaymentTransaction[];
  beneficiaries: readonly Beneficiary[];
  activeScope: string;
  isAuthenticated: boolean;
  userTin: string;
  userName: string;
  isBn: boolean;
}) {
  const {
    routeState, draftIdParam, reuseRefParam, beneficiaryIdParam,
    drafts, transactions, beneficiaries, activeScope, isAuthenticated, userTin, userName, isBn,
  } = params;

  const hasInlinePayload = Boolean(
    routeState?.resumeDraft !== undefined || routeState?.reuseTx !== undefined || routeState?.selectedBeneficiary !== undefined
  );
  const draftId = routeState?.draftId || draftIdParam || '';
  const reuseTxRef = routeState?.reuseTxRef || reuseRefParam || '';
  const beneficiaryId = routeState?.beneficiaryId || beneficiaryIdParam || '';

  const resolvedDraft = !hasInlinePayload && draftId && isAuthenticated
    ? drafts.find((d) => d.id === draftId && d.category !== 'travel_tax' && d.category !== 'gift_tax') ?? null
    : null;
  const resolvedTx = !hasInlinePayload && reuseTxRef
    ? transactions.find((tx) => (tx.transactionRef === reuseTxRef || tx.id === reuseTxRef) && (!tx.ownerScope || tx.ownerScope === activeScope)) ?? null
    : null;
  const resolvedBeneficiary = !hasInlinePayload && beneficiaryId && isAuthenticated
    ? beneficiaries.find((b) => b.id === beneficiaryId) ?? null
    : null;

  const rejectedMissingOrForeign =
    hasInlinePayload || (Boolean(draftId) && !resolvedDraft) || (Boolean(reuseTxRef) && !resolvedTx) || (Boolean(beneficiaryId) && !resolvedBeneficiary);

  const initialSeed = resolvedDraft ?? resolvedTx ?? null;
  const seedValidation = validateResumedOrReusedSeed({
    draft: resolvedDraft ?? undefined, reuseTx: resolvedTx ?? undefined, activeScope, isAuthenticated, userTin,
  });
  const initialTaxpayers = buildInitialTaxpayers(isAuthenticated, userTin, userName, {
    resolvedBeneficiary, resolvedDraft, resolvedTx, beneficiaries,
  });
  const initialMode: 'own' | 'facilitation' =
    resolvedBeneficiary || resolvedDraft?.beneficiaryTin || resolvedTx?.beneficiaryTin || initialTaxpayers.length > 1 || (isAuthenticated && initialTaxpayers.some((tp) => tp.tin !== userTin))
      ? 'facilitation'
      : 'own';
  const initialReconciled = reconcileItemsWithTaxpayers(seedValidation.items, initialTaxpayers, initialMode);

  let initialBanner = '';
  if (rejectedMissingOrForeign || seedValidation.warning === 'owner_mismatch') {
    initialBanner = isBn ? 'অনুরোধকৃত রেকর্ডটি বর্তমান অ্যাকাউন্টে উপলব্ধ বা অনুমোদিত নয়।' : 'Requested draft or transaction is unavailable or does not belong to the active account.';
  } else if (seedValidation.warning === 'pruned_invalid' || initialReconciled.removedCount > 0) {
    initialBanner = isBn ? 'অকার্যকর বা অসঙ্গত খাতসমূহ সমন্বয় করে বাদ দেওয়া হয়েছে।' : 'Incompatible or invalid line items were pruned under current rules.';
  }

  const initialStep: 'chooser' | 'form' =
    resolvedBeneficiary || (initialSeed && initialReconciled.validItems.length > 0) ? 'form' : 'chooser';

  return {
    initialSeed, resolvedDraft, resolvedTx, resolvedBeneficiary,
    initialTaxpayers, initialMode, initialReconciled, initialBanner, initialStep,
  };
}
