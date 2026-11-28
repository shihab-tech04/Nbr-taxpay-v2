import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AppNotification, Beneficiary, BeneficiaryList, CorrectionRequest, PaymentDraft, PaymentTransaction, SupportTicket, UnverifiedCorrectionInquiry } from '../types/tax';
import { createExperimentalBeneficiary, createExperimentalBeneficiaryList, createExperimentalCorrection, createExperimentalDraft, createExperimentalSupportTicket, createExperimentalTransaction, createExperimentalUnverifiedInquiry } from './mockLedgerAdapter';
import { resolveAccountStorageScope } from './accountSession';
import { isRestrictedOperationAllowed } from './previewPolicy';
import { hasCorruptScopedDomainStorage, readScopedDomainData, writeScopedDomainData, type ScopedDomainData } from './scopedDomainStorage';
import { claimWalkInTransactionWithResult, type WalkInClaimResult } from './walkInClaim';
import { buildCorrectionNotification, buildDraftNotification, buildPaymentNotification, prependScopedNotification, sortNotificationsNewest } from './domainNotifications';
import { bulkDeleteBeneficiariesInDomain, bulkMoveBeneficiariesInDomain, deleteListFromDomain } from './domainMutations';
import { useSession } from './SessionContext';

export interface DomainStateContextValue {
  activeScope: string;
  beneficiaryLists: BeneficiaryList[];
  createBeneficiaryList: (name: string) => BeneficiaryList | null;
  renameBeneficiaryList: (listId: string, name: string) => void;
  deleteBeneficiaryList: (listId: string, transferToListId?: string) => boolean;
  beneficiaries: Beneficiary[];
  addBeneficiary: (b: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
  updateBeneficiary: (id: string, patch: Partial<Omit<Beneficiary, 'id' | 'createdAt'>>) => void;
  deleteBeneficiary: (id: string) => void;
  bulkMoveBeneficiaries: (ids: string[], targetListId?: string) => number;
  bulkDeleteBeneficiaries: (ids: string[]) => number;
  transactions: PaymentTransaction[];
  addTransaction: (tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>) => PaymentTransaction;
  claimWalkInTransaction: (tx: PaymentTransaction, targetTin: string, targetName: string) => PaymentTransaction | null;
  claimWalkInTransactionDetailed: (txOrRef: PaymentTransaction | string, targetTin: string) => WalkInClaimResult;
  drafts: PaymentDraft[];
  saveDraft: (draft: Omit<PaymentDraft, 'id' | 'updatedAt'>) => void;
  deleteDraft: (id: string) => void;
  corrections: CorrectionRequest[];
  addCorrection: (c: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => CorrectionRequest | null;
  unverifiedInquiries: UnverifiedCorrectionInquiry[];
  addUnverifiedInquiry: (inq: Omit<UnverifiedCorrectionInquiry, 'id' | 'ticketNumber' | 'createdAt' | 'status' | 'ownerScope'>) => UnverifiedCorrectionInquiry | null;
  supportTickets: SupportTicket[];
  addSupportTicket: (s: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  notificationsError: boolean;
  retryLoadNotifications: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DomainStateContext = createContext<DomainStateContextValue | undefined>(undefined);
interface ScopedStateSlice { scope: string; data: ScopedDomainData; corruptStorage: boolean }

export const DomainStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useSession();
  const activeScope = resolveAccountStorageScope(isAuthenticated, user.tin);
  const [slice, setSlice] = useState<ScopedStateSlice>(() => ({ scope: activeScope, data: readScopedDomainData(activeScope), corruptStorage: hasCorruptScopedDomainStorage(activeScope) }));
  const currentData = useMemo(() => (slice.scope === activeScope ? slice.data : readScopedDomainData(activeScope)), [activeScope, slice]);
  const notificationsError = useMemo(() => (slice.scope === activeScope ? slice.corruptStorage : hasCorruptScopedDomainStorage(activeScope)), [activeScope, slice]);

  const updateScoped = useCallback((updater: (current: ScopedDomainData) => ScopedDomainData) => {
    setSlice((prev) => {
      const base = prev.scope === activeScope ? prev.data : readScopedDomainData(activeScope);
      const next = updater(base);
      writeScopedDomainData(activeScope, next);
      return { scope: activeScope, data: next, corruptStorage: false };
    });
  }, [activeScope]);

  const retryLoadNotifications = useCallback(() => {
    const recovered = readScopedDomainData(activeScope);
    if (hasCorruptScopedDomainStorage(activeScope)) writeScopedDomainData(activeScope, recovered);
    setSlice({ scope: activeScope, data: recovered, corruptStorage: false });
  }, [activeScope]);

  const createBeneficiaryList = useCallback((name: string): BeneficiaryList | null => {
    const clean = name.trim();
    if (!isAuthenticated || !clean || !isRestrictedOperationAllowed('beneficiary_write')) return null;
    const created = createExperimentalBeneficiaryList(clean);
    updateScoped((curr) => ({ ...curr, beneficiaryLists: [...curr.beneficiaryLists, created] }));
    return created;
  }, [isAuthenticated, updateScoped]);

  const renameBeneficiaryList = useCallback((listId: string, name: string) => {
    const clean = name.trim();
    if (!isAuthenticated || !clean || !isRestrictedOperationAllowed('beneficiary_write')) return;
    updateScoped((curr) => ({ ...curr, beneficiaryLists: curr.beneficiaryLists.map((l) => (l.id === listId ? { ...l, name: clean } : l)) }));
  }, [isAuthenticated, updateScoped]);

  const deleteBeneficiaryList = useCallback((listId: string, transferToListId?: string): boolean => {
    if (!isAuthenticated || !isRestrictedOperationAllowed('beneficiary_write')) return false;
    let deleted = false;
    updateScoped((curr) => { const res = deleteListFromDomain(curr, listId, transferToListId); deleted = res.deleted; return res.next; });
    return deleted;
  }, [isAuthenticated, updateScoped]);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, 'id' | 'createdAt'>) => {
    if (isRestrictedOperationAllowed('beneficiary_write')) updateScoped((curr) => ({ ...curr, beneficiaries: [createExperimentalBeneficiary(b), ...curr.beneficiaries] }));
  }, [updateScoped]);

  const updateBeneficiary = useCallback((id: string, patch: Partial<Omit<Beneficiary, 'id' | 'createdAt'>>) => {
    if (isRestrictedOperationAllowed('beneficiary_write')) updateScoped((curr) => ({ ...curr, beneficiaries: curr.beneficiaries.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  }, [updateScoped]);

  const deleteBeneficiary = useCallback((id: string) => {
    if (isRestrictedOperationAllowed('beneficiary_write')) updateScoped((curr) => ({ ...curr, beneficiaries: curr.beneficiaries.filter((item) => item.id !== id) }));
  }, [updateScoped]);

  const bulkMoveBeneficiaries = useCallback((ids: string[], targetListId?: string): number => {
    if (!isAuthenticated || !isRestrictedOperationAllowed('beneficiary_write')) return 0;
    let count = 0;
    updateScoped((curr) => { const res = bulkMoveBeneficiariesInDomain(curr, ids, targetListId); count = res.movedCount; return res.next; });
    return count;
  }, [isAuthenticated, updateScoped]);

  const bulkDeleteBeneficiaries = useCallback((ids: string[]): number => {
    if (!isAuthenticated || !isRestrictedOperationAllowed('beneficiary_write')) return 0;
    let count = 0;
    updateScoped((curr) => { const res = bulkDeleteBeneficiariesInDomain(curr, ids); count = res.removedCount; return res.next; });
    return count;
  }, [isAuthenticated, updateScoped]);

  const addTransaction = useCallback((txData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>): PaymentTransaction => {
    if (!isRestrictedOperationAllowed('payment_submit')) throw new Error('Payment submission is disabled in public preview.');
    const newTx = createExperimentalTransaction({ ...txData, ownerScope: txData.ownerScope ?? activeScope, originMode: txData.originMode ?? (isAuthenticated ? 'signed_in' : 'walk_in') });
    updateScoped((curr) => ({ ...curr, transactions: [newTx, ...curr.transactions], notifications: isAuthenticated && activeScope !== 'walkin' ? prependScopedNotification(curr.notifications, buildPaymentNotification(activeScope, newTx)) : curr.notifications }));
    return newTx;
  }, [activeScope, isAuthenticated, updateScoped]);

  const claimWalkInTransactionDetailed = useCallback((txOrRef: PaymentTransaction | string, targetTin: string): WalkInClaimResult => {
    if (!isRestrictedOperationAllowed('payment_submit')) return { ok: false, reason: 'invalid_account' };
    const res = claimWalkInTransactionWithResult(txOrRef, targetTin);
    if (res.ok && activeScope === `acct_${targetTin}`) setSlice({ scope: activeScope, data: readScopedDomainData(activeScope), corruptStorage: false });
    return res;
  }, [activeScope]);

  const claimWalkInTransaction = useCallback((tx: PaymentTransaction, targetTin: string): PaymentTransaction | null => {
    const res = claimWalkInTransactionDetailed(tx, targetTin);
    return res.ok ? res.transaction : null;
  }, [claimWalkInTransactionDetailed]);

  const saveDraft = useCallback((draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>) => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    const created = createExperimentalDraft(draftData);
    updateScoped((curr) => ({ ...curr, drafts: [created, ...curr.drafts], notifications: activeScope !== 'walkin' ? prependScopedNotification(curr.notifications, buildDraftNotification(activeScope, created)) : curr.notifications }));
  }, [activeScope, isAuthenticated, updateScoped]);

  const deleteDraft = useCallback((id: string) => {
    if (isRestrictedOperationAllowed('draft_write')) updateScoped((curr) => ({ ...curr, drafts: curr.drafts.filter((item) => item.id !== id) }));
  }, [updateScoped]);

  const addCorrection = useCallback((cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>): CorrectionRequest | null => {
    if (!isRestrictedOperationAllowed('correction_write') || !isAuthenticated) return null;
    const created = createExperimentalCorrection({ ...cData, ownerScope: cData.ownerScope ?? activeScope });
    updateScoped((curr) => ({ ...curr, corrections: [created, ...curr.corrections], notifications: activeScope !== 'walkin' ? prependScopedNotification(curr.notifications, buildCorrectionNotification(activeScope, created)) : curr.notifications }));
    return created;
  }, [activeScope, isAuthenticated, updateScoped]);

  const addUnverifiedInquiry = useCallback((inqData: Omit<UnverifiedCorrectionInquiry, 'id' | 'ticketNumber' | 'createdAt' | 'status' | 'ownerScope'>): UnverifiedCorrectionInquiry | null => {
    if (!isRestrictedOperationAllowed('correction_write')) return null;
    const created = createExperimentalUnverifiedInquiry({ ...inqData, ownerScope: activeScope });
    updateScoped((curr) => ({ ...curr, unverifiedInquiries: [created, ...(curr.unverifiedInquiries ?? [])] }));
    return created;
  }, [activeScope, updateScoped]);

  const addSupportTicket = useCallback((sData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    if (isRestrictedOperationAllowed('support_ticket_write')) updateScoped((curr) => ({ ...curr, supportTickets: [createExperimentalSupportTicket(sData), ...curr.supportTickets] }));
  }, [updateScoped]);

  const markNotificationRead = useCallback((id: string) => {
    if (!isAuthenticated) return;
    const now = new Date().toISOString();
    updateScoped((curr) => ({ ...curr, notifications: curr.notifications.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: now } : n)) }));
  }, [isAuthenticated, updateScoped]);

  const markAllNotificationsRead = useCallback(() => {
    if (!isAuthenticated) return;
    const now = new Date().toISOString();
    updateScoped((curr) => ({ ...curr, notifications: curr.notifications.map((n) => (n.readAt ? n : { ...n, readAt: now })) }));
  }, [isAuthenticated, updateScoped]);

  const notifications = useMemo(() => (isAuthenticated ? sortNotificationsNewest(currentData.notifications.filter((n) => n.ownerScope === activeScope)) : []), [activeScope, currentData.notifications, isAuthenticated]);
  const unreadNotificationCount = useMemo(() => notifications.filter((n) => !n.readAt).length, [notifications]);

  const value = useMemo<DomainStateContextValue>(() => ({
    activeScope, beneficiaryLists: currentData.beneficiaryLists, createBeneficiaryList, renameBeneficiaryList, deleteBeneficiaryList,
    beneficiaries: currentData.beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary, bulkMoveBeneficiaries, bulkDeleteBeneficiaries,
    transactions: currentData.transactions, addTransaction, claimWalkInTransaction, claimWalkInTransactionDetailed,
    drafts: currentData.drafts, saveDraft, deleteDraft, corrections: currentData.corrections, addCorrection,
    unverifiedInquiries: currentData.unverifiedInquiries ?? [], addUnverifiedInquiry, supportTickets: currentData.supportTickets,
    addSupportTicket, notifications, unreadNotificationCount, notificationsError, retryLoadNotifications, markNotificationRead, markAllNotificationsRead,
  }), [activeScope, currentData, createBeneficiaryList, renameBeneficiaryList, deleteBeneficiaryList, addBeneficiary, updateBeneficiary, deleteBeneficiary, bulkMoveBeneficiaries, bulkDeleteBeneficiaries, addTransaction, claimWalkInTransaction, claimWalkInTransactionDetailed, saveDraft, deleteDraft, addCorrection, addUnverifiedInquiry, addSupportTicket, notifications, unreadNotificationCount, notificationsError, retryLoadNotifications, markNotificationRead, markAllNotificationsRead]);

  return <DomainStateContext.Provider value={value}>{children}</DomainStateContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDomainState = (): DomainStateContextValue => {
  const ctx = useContext(DomainStateContext);
  if (!ctx) throw new Error('useDomainState must be used within a DomainStateProvider');
  return ctx;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useOptionalDomainState = (): DomainStateContextValue | undefined => useContext(DomainStateContext);
