import type { Beneficiary, PaymentDraft, PaymentTransaction } from '../../types/tax';
import { reconcileItemsWithTaxpayers, validateResumedOrReusedSeed } from './allTaxLogic';
import type { SelectedTaxpayerEntry } from './components/AllTaxTaxpayerStep';

export interface AllTaxRouteState {
  resumeDraft?: PaymentDraft;
  reuseTx?: PaymentTransaction;
  selectedBeneficiary?: Beneficiary;
}

export function buildInitialTaxpayers(
  isAuthenticated: boolean,
  userTin: string,
  userName: string,
  state?: AllTaxRouteState | null
): SelectedTaxpayerEntry[] {
  if (state?.selectedBeneficiary) {
    const label = state.selectedBeneficiary.name.trim() || state.selectedBeneficiary.relationship;
    return [{ tin: state.selectedBeneficiary.tin, name: label, source: 'beneficiary' }];
  }
  const fromItems = (state?.resumeDraft?.items ?? state?.reuseTx?.items ?? [])
    .filter((i) => i.taxpayerTin)
    .map((i) => ({ tin: i.taxpayerTin!, name: i.taxpayerName ?? i.taxpayerTin!, source: 'one_time' as const }));
  if (fromItems.length > 0) {
    const unique = new Map<string, SelectedTaxpayerEntry>();
    fromItems.forEach((tp) => unique.set(tp.tin, tp));
    return [...unique.values()];
  }
  return isAuthenticated && userTin ? [{ tin: userTin, name: userName, source: 'self' }] : [];
}

export function resolveInitialAllTaxState(params: {
  routeState: AllTaxRouteState | null;
  activeScope: string;
  isAuthenticated: boolean;
  userTin: string;
  userName: string;
  isBn: boolean;
}) {
  const { routeState, activeScope, isAuthenticated, userTin, userName, isBn } = params;
  const initialSeed = routeState?.resumeDraft ?? routeState?.reuseTx ?? null;
  const seedValidation = validateResumedOrReusedSeed({
    draft: routeState?.resumeDraft,
    reuseTx: routeState?.reuseTx,
    activeScope,
    isAuthenticated,
    userTin,
  });
  const initialTaxpayers = buildInitialTaxpayers(isAuthenticated, userTin, userName, routeState);
  const initialMode: 'own' | 'facilitation' =
    routeState?.selectedBeneficiary || initialTaxpayers.length > 1 ? 'facilitation' : 'own';
  const initialReconciled = reconcileItemsWithTaxpayers(seedValidation.items, initialTaxpayers, initialMode);
  const initialBanner =
    seedValidation.warning === 'owner_mismatch'
      ? isBn ? 'পূর্বের লেনদেনটি বর্তমান অ্যাকাউন্টের সাথে মেলে না।' : 'Reused transaction does not match current signed-in owner.'
      : seedValidation.warning === 'pruned_invalid' || initialReconciled.removedCount > 0
      ? isBn ? 'অকার্যকর বা অসঙ্গত খাতসমূহ সমন্বয় করে বাদ দেওয়া হয়েছে।' : 'Incompatible or invalid line items were pruned under current rules.'
      : '';
  const initialStep: 'chooser' | 'form' =
    routeState?.selectedBeneficiary || (initialSeed && initialReconciled.validItems.length > 0) ? 'form' : 'chooser';
  return { initialSeed, initialTaxpayers, initialMode, initialReconciled, initialBanner, initialStep };
}
