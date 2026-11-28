import type { PaymentTransaction } from '../types/tax';
import { readAppStorage, readJsonStorage, writeAppStorage } from './storageAdapter';
import { getActiveWalkInSessionId, lookupTinIdentity } from './accountSession';
import {
  EMPTY_WALKIN_DATA,
  getSeedForScope,
  type ScopedDomainData,
} from './scopedDomainSeeds';

export type { ScopedDomainData };

export function getScopedDomainStorageKey(scope: string): string {
  return `sohojkor_domain_${scope}`;
}

export function hasCorruptScopedDomainStorage(scope: string): boolean {
  const saved = readAppStorage(getScopedDomainStorageKey(scope));
  if (!saved) return false;
  try {
    const parsed = JSON.parse(saved);
    return !parsed || typeof parsed !== 'object' || Array.isArray(parsed);
  } catch {
    return true;
  }
}

export function readScopedDomainData(
  scope: string,
  options: { includeAllSessions?: boolean } = {}
): ScopedDomainData {
  const seed = getSeedForScope(scope);
  const raw = readJsonStorage<ScopedDomainData>(getScopedDomainStorageKey(scope), seed);
  const lists = Array.isArray(raw.beneficiaryLists) ? raw.beneficiaryLists : seed.beneficiaryLists;
  const notifications = Array.isArray(raw.notifications) ? raw.notifications : seed.notifications;
  if (scope !== 'walkin' || options.includeAllSessions) {
    return {
      ...seed,
      ...raw,
      beneficiaryLists: lists,
      notifications: scope === 'walkin' ? [] : notifications,
    };
  }
  const activeGuestSession = getActiveWalkInSessionId();
  return {
    ...EMPTY_WALKIN_DATA,
    ...raw,
    beneficiaryLists: [],
    drafts: [],
    beneficiaries: [],
    notifications: [],
    transactions: (raw.transactions ?? []).filter(
      (tx) => !tx.walkInSessionId || tx.walkInSessionId === activeGuestSession
    ),
  };
}

export function writeScopedDomainData(scope: string, data: ScopedDomainData): void {
  writeAppStorage(getScopedDomainStorageKey(scope), JSON.stringify(data));
}

export function claimWalkInTransactionInStorage(
  tx: PaymentTransaction,
  targetTin: string,
  _targetName: string
): PaymentTransaction | null {
  if (!/^\d{12,13}$/.test(targetTin) || !lookupTinIdentity(targetTin)) return null;
  if (tx.originMode !== 'walk_in' && tx.ownerScope !== 'walkin') return null;
  if (tx.taxpayerTin.trim() && tx.taxpayerTin.trim() !== targetTin) return null;
  const targetScope = `acct_${targetTin}`;
  const targetData = readScopedDomainData(targetScope);
  if (targetData.transactions.some((item) => item.transactionRef === tx.transactionRef)) return null;
  const walkinData = readScopedDomainData('walkin');
  const stored = walkinData.transactions.find((item) => item.transactionRef === tx.transactionRef);
  if (!stored) return null;
  const claimed: PaymentTransaction = {
    ...stored,
    ownerScope: targetScope,
    claimedByTin: targetTin,
    claimedAt: new Date().toISOString(),
  };
  writeScopedDomainData(targetScope, { ...targetData, transactions: [claimed, ...targetData.transactions] });
  writeScopedDomainData('walkin', {
    ...walkinData,
    transactions: walkinData.transactions.filter((item) => item.transactionRef !== tx.transactionRef),
  });
  return claimed;
}
