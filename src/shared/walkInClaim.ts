import type { PaymentTransaction } from '../types/tax';
import { getActiveWalkInSessionId, lookupTinIdentity, normalizeBdMobile } from './accountSession';
import { readScopedDomainData, writeScopedDomainData } from './scopedDomainStorage';
import { readJsonStorage, writeAppStorage } from './storageAdapter';

export type WalkInClaimFailureReason =
  | 'invalid_account'
  | 'not_found_or_forged'
  | 'stale_session'
  | 'duplicate_claim'
  | 'ownership_mismatch';

export type WalkInClaimResult =
  | { ok: true; transaction: PaymentTransaction }
  | { ok: false; reason: WalkInClaimFailureReason };

const CLAIMED_REFS_KEY = 'sohojkor_claimed_walkin_refs';

function readClaimedRefs(): string[] {
  return readJsonStorage<string[]>(CLAIMED_REFS_KEY, []);
}

function recordClaimedRef(ref: string): void {
  const existing = readClaimedRefs();
  if (!existing.includes(ref)) {
    writeAppStorage(CLAIMED_REFS_KEY, JSON.stringify([...existing, ref]));
  }
}

export function isWalkInTransactionEligibleForOwner(
  tx: PaymentTransaction,
  verifiedTin: string,
  verifiedPhone: string
): boolean {
  const cleanPayerTin = tx.taxpayerTin.trim();
  if (cleanPayerTin) {
    return cleanPayerTin === verifiedTin;
  }
  if (tx.category === 'travel_tax' && tx.travelDetails?.contactMobile) {
    const txMob = normalizeBdMobile(tx.travelDetails.contactMobile);
    const userMob = normalizeBdMobile(verifiedPhone);
    return Boolean(txMob && userMob && txMob === userMob);
  }
  return false;
}

export function claimWalkInTransactionWithResult(
  txRefOrTx: PaymentTransaction | string,
  targetTin: string
): WalkInClaimResult {
  if (!/^\d{12,13}$/.test(targetTin)) {
    return { ok: false, reason: 'invalid_account' };
  }
  const verified = lookupTinIdentity(targetTin);
  if (!verified) {
    return { ok: false, reason: 'invalid_account' };
  }

  const ref = typeof txRefOrTx === 'string' ? txRefOrTx.trim() : txRefOrTx.transactionRef.trim();
  if (!ref) {
    return { ok: false, reason: 'not_found_or_forged' };
  }

  const targetScope = `acct_${targetTin}`;
  const targetData = readScopedDomainData(targetScope);
  if (readClaimedRefs().includes(ref) || targetData.transactions.some((item) => item.transactionRef === ref)) {
    return { ok: false, reason: 'duplicate_claim' };
  }

  const rawWalkIn = readScopedDomainData('walkin', { includeAllSessions: true });
  const storedTx = rawWalkIn.transactions.find((item) => item.transactionRef === ref);
  if (!storedTx || storedTx.originMode !== 'walk_in') {
    return { ok: false, reason: 'not_found_or_forged' };
  }
  if (storedTx.claimedByTin) {
    return { ok: false, reason: 'duplicate_claim' };
  }

  const currentSessionId = getActiveWalkInSessionId();
  if (storedTx.walkInSessionId && storedTx.walkInSessionId !== currentSessionId) {
    return { ok: false, reason: 'stale_session' };
  }

  if (!isWalkInTransactionEligibleForOwner(storedTx, targetTin, verified.profile.phone)) {
    return { ok: false, reason: 'ownership_mismatch' };
  }

  // Preserve original payer identity (taxpayerTin / taxpayerName) untouched.
  const claimed: PaymentTransaction = {
    ...storedTx,
    ownerScope: targetScope,
    claimedByTin: targetTin,
    claimedAt: new Date().toISOString(),
  };

  writeScopedDomainData(targetScope, {
    ...targetData,
    transactions: [claimed, ...targetData.transactions],
  });
  writeScopedDomainData('walkin', {
    ...rawWalkIn,
    transactions: rawWalkIn.transactions.filter((item) => item.transactionRef !== ref),
  });
  recordClaimedRef(ref);
  return { ok: true, transaction: claimed };
}
