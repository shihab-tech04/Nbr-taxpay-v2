import type { CorrectionRequest } from '../types/tax';
import { isTransactionCorrectionEligible } from './correctionLogic';
import { buildCorrectionNotification, prependScopedNotification } from './domainNotifications';
import { createExperimentalCorrection } from './mockLedgerAdapter';
import type { ScopedDomainData } from './scopedDomainSeeds';

export function deleteListFromDomain(
  curr: ScopedDomainData,
  listId: string,
  transferToListId?: string
): { next: ScopedDomainData; deleted: boolean } {
  const members = curr.beneficiaries.filter((b) => b.listId === listId);
  if (
    members.length > 0 &&
    (!transferToListId ||
      transferToListId === listId ||
      !curr.beneficiaryLists.some((l) => l.id === transferToListId))
  ) {
    return { next: curr, deleted: false };
  }
  return {
    deleted: true,
    next: {
      ...curr,
      beneficiaryLists: curr.beneficiaryLists.filter((l) => l.id !== listId),
      beneficiaries:
        members.length > 0
          ? curr.beneficiaries.map((b) => (b.listId === listId ? { ...b, listId: transferToListId } : b))
          : curr.beneficiaries,
    },
  };
}

export function bulkMoveBeneficiariesInDomain(
  curr: ScopedDomainData,
  ids: readonly string[],
  targetListId?: string
): { next: ScopedDomainData; movedCount: number } {
  const validList = !targetListId || curr.beneficiaryLists.some((l) => l.id === targetListId);
  if (!validList || ids.length === 0) return { next: curr, movedCount: 0 };
  const idSet = new Set(ids);
  let movedCount = 0;
  const beneficiaries = curr.beneficiaries.map((b) => {
    if (!idSet.has(b.id)) return b;
    movedCount += 1;
    return { ...b, listId: targetListId || undefined };
  });
  return { next: { ...curr, beneficiaries }, movedCount };
}

export function bulkDeleteBeneficiariesInDomain(
  curr: ScopedDomainData,
  ids: readonly string[]
): { next: ScopedDomainData; removedCount: number } {
  if (ids.length === 0) return { next: curr, removedCount: 0 };
  const idSet = new Set(ids);
  let removedCount = 0;
  const beneficiaries = curr.beneficiaries.filter((b) => {
    if (idSet.has(b.id)) {
      removedCount += 1;
      return false;
    }
    return true;
  });
  return { next: { ...curr, beneficiaries }, removedCount };
}

export function appendVerifiedCorrectionSafely(
  curr: ScopedDomainData,
  cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>,
  activeScope: string,
  isAuthenticated: boolean,
  prepared?: CorrectionRequest
): { next: ScopedDomainData; created: CorrectionRequest | null } {
  const tx = curr.transactions.find(
    (item) => item.id === cData.transactionId || item.challanNumber === cData.challanNumber
  );
  if (!isTransactionCorrectionEligible(tx, activeScope, isAuthenticated) || !tx) {
    return { next: curr, created: null };
  }
  const idx = cData.allocationIndex ?? (tx.items.length === 1 ? 0 : -1);
  if (!Number.isInteger(idx) || idx < 0 || idx >= tx.items.length) {
    return { next: curr, created: null };
  }
  const hasActiveDuplicate = curr.corrections.some(
    (c) =>
      (c.status === 'Submitted' || c.status === 'Under Review') &&
      (c.challanNumber === tx.challanNumber || c.transactionId === tx.id) &&
      (c.allocationIndex ?? 0) === idx &&
      (!c.ownerScope || c.ownerScope === activeScope)
  );
  if (hasActiveDuplicate) {
    return { next: curr, created: null };
  }
  const created =
    prepared ??
    createExperimentalCorrection({
      ...cData,
      ownerScope: activeScope,
      transactionId: tx.id,
      transactionRef: tx.transactionRef,
      challanNumber: tx.challanNumber,
      allocationIndex: idx,
    });
  return {
    created,
    next: {
      ...curr,
      corrections: [created, ...curr.corrections],
      notifications:
        activeScope !== 'walkin'
          ? prependScopedNotification(curr.notifications, buildCorrectionNotification(activeScope, created))
          : curr.notifications,
    },
  };
}

