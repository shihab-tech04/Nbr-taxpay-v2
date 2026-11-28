import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  Beneficiary, BeneficiaryList, CorrectionRequest, PaymentDraft, PaymentTransaction, SupportTicket,
} from '../types/tax';
import {
  createExperimentalBeneficiary, createExperimentalBeneficiaryList, createExperimentalCorrection,
  createExperimentalDraft, createExperimentalSupportTicket, createExperimentalTransaction,
} from './mockLedgerAdapter';
import { resolveAccountStorageScope } from './accountSession';
import { isRestrictedOperationAllowed } from './previewPolicy';
import { readScopedDomainData, writeScopedDomainData, type ScopedDomainData } from './scopedDomainStorage';
import { claimWalkInTransactionWithResult, type WalkInClaimResult } from './walkInClaim';
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
  transactions: PaymentTransaction[];
  addTransaction: (tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>) => PaymentTransaction;
  claimWalkInTransaction: (tx: PaymentTransaction, targetTin: string, targetName: string) => PaymentTransaction | null;
  claimWalkInTransactionDetailed: (txOrRef: PaymentTransaction | string, targetTin: string) => WalkInClaimResult;
  drafts: PaymentDraft[];
  saveDraft: (draft: Omit<PaymentDraft, 'id' | 'updatedAt'>) => void;
  deleteDraft: (id: string) => void;
  corrections: CorrectionRequest[];
  addCorrection: (c: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (s: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
}

const DomainStateContext = createContext<DomainStateContextValue | undefined>(undefined);
interface ScopedStateSlice { scope: string; data: ScopedDomainData }

export const DomainStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useSession();
  const activeScope = resolveAccountStorageScope(isAuthenticated, user.tin);
  const [slice, setSlice] = useState<ScopedStateSlice>(() => ({ scope: activeScope, data: readScopedDomainData(activeScope) }));
  const currentData = useMemo(() => (slice.scope === activeScope ? slice.data : readScopedDomainData(activeScope)), [activeScope, slice]);

  const updateScoped = useCallback((updater: (current: ScopedDomainData) => ScopedDomainData) => {
    setSlice((prev) => {
      const base = prev.scope === activeScope ? prev.data : readScopedDomainData(activeScope);
      const next = updater(base);
      writeScopedDomainData(activeScope, next);
      return { scope: activeScope, data: next };
    });
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
    updateScoped((curr) => {
      const members = curr.beneficiaries.filter((b) => b.listId === listId);
      if (members.length > 0 && (!transferToListId || transferToListId === listId || !curr.beneficiaryLists.some((l) => l.id === transferToListId))) {
        return curr;
      }
      deleted = true;
      return {
        ...curr,
        beneficiaryLists: curr.beneficiaryLists.filter((l) => l.id !== listId),
        beneficiaries: members.length > 0 ? curr.beneficiaries.map((b) => (b.listId === listId ? { ...b, listId: transferToListId } : b)) : curr.beneficiaries,
      };
    });
    return deleted;
  }, [isAuthenticated, updateScoped]);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, 'id' | 'createdAt'>) => {
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    updateScoped((curr) => ({ ...curr, beneficiaries: [createExperimentalBeneficiary(b), ...curr.beneficiaries] }));
  }, [updateScoped]);

  const updateBeneficiary = useCallback((id: string, patch: Partial<Omit<Beneficiary, 'id' | 'createdAt'>>) => {
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    updateScoped((curr) => ({ ...curr, beneficiaries: curr.beneficiaries.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  }, [updateScoped]);

  const deleteBeneficiary = useCallback((id: string) => {
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    updateScoped((curr) => ({ ...curr, beneficiaries: curr.beneficiaries.filter((item) => item.id !== id) }));
  }, [updateScoped]);

  const addTransaction = useCallback((txData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>): PaymentTransaction => {
    if (!isRestrictedOperationAllowed('payment_submit')) throw new Error('Payment submission is disabled in public preview.');
    const newTx = createExperimentalTransaction({ ...txData, ownerScope: txData.ownerScope ?? activeScope, originMode: txData.originMode ?? (isAuthenticated ? 'signed_in' : 'walk_in') });
    updateScoped((curr) => ({ ...curr, transactions: [newTx, ...curr.transactions] }));
    return newTx;
  }, [activeScope, isAuthenticated, updateScoped]);

  const claimWalkInTransactionDetailed = useCallback((txOrRef: PaymentTransaction | string, targetTin: string): WalkInClaimResult => {
    if (!isRestrictedOperationAllowed('payment_submit')) return { ok: false, reason: 'invalid_account' };
    const res = claimWalkInTransactionWithResult(txOrRef, targetTin);
    if (res.ok && activeScope === `acct_${targetTin}`) setSlice({ scope: activeScope, data: readScopedDomainData(activeScope) });
    return res;
  }, [activeScope]);

  const claimWalkInTransaction = useCallback((tx: PaymentTransaction, targetTin: string): PaymentTransaction | null => {
    const res = claimWalkInTransactionDetailed(tx, targetTin);
    return res.ok ? res.transaction : null;
  }, [claimWalkInTransactionDetailed]);

  const saveDraft = useCallback((draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>) => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    updateScoped((curr) => ({ ...curr, drafts: [createExperimentalDraft(draftData), ...curr.drafts] }));
  }, [isAuthenticated, updateScoped]);

  const deleteDraft = useCallback((id: string) => {
    if (!isRestrictedOperationAllowed('draft_write')) return;
    updateScoped((curr) => ({ ...curr, drafts: curr.drafts.filter((item) => item.id !== id) }));
  }, [updateScoped]);

  const addCorrection = useCallback((cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!isRestrictedOperationAllowed('correction_write')) return;
    updateScoped((curr) => ({ ...curr, corrections: [createExperimentalCorrection(cData), ...curr.corrections] }));
  }, [updateScoped]);

  const addSupportTicket = useCallback((sData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    if (!isRestrictedOperationAllowed('support_ticket_write')) return;
    updateScoped((curr) => ({ ...curr, supportTickets: [createExperimentalSupportTicket(sData), ...curr.supportTickets] }));
  }, [updateScoped]);

  const value = useMemo<DomainStateContextValue>(() => ({
    activeScope, beneficiaryLists: currentData.beneficiaryLists, createBeneficiaryList, renameBeneficiaryList, deleteBeneficiaryList,
    beneficiaries: currentData.beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary,
    transactions: currentData.transactions, addTransaction, claimWalkInTransaction, claimWalkInTransactionDetailed,
    drafts: currentData.drafts, saveDraft, deleteDraft, corrections: currentData.corrections, addCorrection,
    supportTickets: currentData.supportTickets, addSupportTicket,
  }), [activeScope, currentData, createBeneficiaryList, renameBeneficiaryList, deleteBeneficiaryList, addBeneficiary, updateBeneficiary, deleteBeneficiary, addTransaction, claimWalkInTransaction, claimWalkInTransactionDetailed, saveDraft, deleteDraft, addCorrection, addSupportTicket]);

  return <DomainStateContext.Provider value={value}>{children}</DomainStateContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useDomainState(): DomainStateContextValue {
  const context = useContext(DomainStateContext);
  if (!context) throw new Error('useDomainState must be used within a DomainStateProvider');
  return context;
}
