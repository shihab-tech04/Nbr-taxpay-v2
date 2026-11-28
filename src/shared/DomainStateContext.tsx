import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  Beneficiary,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
} from '../types/tax';
import {
  createExperimentalBeneficiary,
  createExperimentalCorrection,
  createExperimentalDraft,
  createExperimentalSupportTicket,
  createExperimentalTransaction,
} from './mockLedgerAdapter';
import { resolveAccountStorageScope } from './accountSession';
import { isRestrictedOperationAllowed } from './previewPolicy';
import {
  claimWalkInTransactionInStorage,
  readScopedDomainData,
  writeScopedDomainData,
  type ScopedDomainData,
} from './scopedDomainStorage';
import { useSession } from './SessionContext';

export interface DomainStateContextValue {
  activeScope: string;
  beneficiaries: Beneficiary[];
  addBeneficiary: (b: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
  deleteBeneficiary: (id: string) => void;
  transactions: PaymentTransaction[];
  addTransaction: (
    tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>
  ) => PaymentTransaction;
  claimWalkInTransaction: (tx: PaymentTransaction, targetTin: string, targetName: string) => PaymentTransaction | null;
  drafts: PaymentDraft[];
  saveDraft: (draft: Omit<PaymentDraft, 'id' | 'updatedAt'>) => void;
  deleteDraft: (id: string) => void;
  corrections: CorrectionRequest[];
  addCorrection: (c: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (s: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
}

const DomainStateContext = createContext<DomainStateContextValue | undefined>(undefined);

interface ScopedStateSlice {
  scope: string;
  data: ScopedDomainData;
}

export const DomainStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useSession();
  const activeScope = resolveAccountStorageScope(isAuthenticated, user.tin);
  const [slice, setSlice] = useState<ScopedStateSlice>(() => ({
    scope: activeScope,
    data: readScopedDomainData(activeScope),
  }));

  const currentData = useMemo(
    () => (slice.scope === activeScope ? slice.data : readScopedDomainData(activeScope)),
    [activeScope, slice]
  );

  const updateScoped = useCallback(
    (updater: (current: ScopedDomainData) => ScopedDomainData) => {
      setSlice((prev) => {
        const base = prev.scope === activeScope ? prev.data : readScopedDomainData(activeScope);
        const next = updater(base);
        writeScopedDomainData(activeScope, next);
        return { scope: activeScope, data: next };
      });
    },
    [activeScope]
  );

  const addBeneficiary = useCallback(
    (b: Omit<Beneficiary, 'id' | 'createdAt'>) => {
      if (!isRestrictedOperationAllowed('beneficiary_write')) return;
      updateScoped((curr) => ({ ...curr, beneficiaries: [createExperimentalBeneficiary(b), ...curr.beneficiaries] }));
    },
    [updateScoped]
  );

  const deleteBeneficiary = useCallback(
    (id: string) => {
      if (!isRestrictedOperationAllowed('beneficiary_write')) return;
      updateScoped((curr) => ({ ...curr, beneficiaries: curr.beneficiaries.filter((item) => item.id !== id) }));
    },
    [updateScoped]
  );

  const addTransaction = useCallback(
    (
      txData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>
    ): PaymentTransaction => {
      if (!isRestrictedOperationAllowed('payment_submit')) {
        throw new Error('Payment submission is disabled in public preview.');
      }
      const newTx = createExperimentalTransaction({
        ...txData,
        ownerScope: txData.ownerScope ?? activeScope,
        originMode: txData.originMode ?? (isAuthenticated ? 'signed_in' : 'walk_in'),
      });
      updateScoped((curr) => ({ ...curr, transactions: [newTx, ...curr.transactions] }));
      return newTx;
    },
    [activeScope, isAuthenticated, updateScoped]
  );

  const claimWalkInTransaction = useCallback(
    (tx: PaymentTransaction, targetTin: string, targetName: string): PaymentTransaction | null => {
      if (!isRestrictedOperationAllowed('payment_submit')) return null;
      const claimed = claimWalkInTransactionInStorage(tx, targetTin, targetName);
      if (claimed && activeScope === `acct_${targetTin}`) {
        setSlice({ scope: activeScope, data: readScopedDomainData(activeScope) });
      }
      return claimed;
    },
    [activeScope]
  );

  const saveDraft = useCallback(
    (draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>) => {
      if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
      updateScoped((curr) => ({ ...curr, drafts: [createExperimentalDraft(draftData), ...curr.drafts] }));
    },
    [isAuthenticated, updateScoped]
  );

  const deleteDraft = useCallback(
    (id: string) => {
      if (!isRestrictedOperationAllowed('draft_write')) return;
      updateScoped((curr) => ({ ...curr, drafts: curr.drafts.filter((item) => item.id !== id) }));
    },
    [updateScoped]
  );

  const addCorrection = useCallback(
    (cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => {
      if (!isRestrictedOperationAllowed('correction_write')) return;
      updateScoped((curr) => ({ ...curr, corrections: [createExperimentalCorrection(cData), ...curr.corrections] }));
    },
    [updateScoped]
  );

  const addSupportTicket = useCallback(
    (sData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
      if (!isRestrictedOperationAllowed('support_ticket_write')) return;
      updateScoped((curr) => ({
        ...curr,
        supportTickets: [createExperimentalSupportTicket(sData), ...curr.supportTickets],
      }));
    },
    [updateScoped]
  );

  const value = useMemo<DomainStateContextValue>(
    () => ({
      activeScope,
      beneficiaries: currentData.beneficiaries,
      addBeneficiary,
      deleteBeneficiary,
      transactions: currentData.transactions,
      addTransaction,
      claimWalkInTransaction,
      drafts: currentData.drafts,
      saveDraft,
      deleteDraft,
      corrections: currentData.corrections,
      addCorrection,
      supportTickets: currentData.supportTickets,
      addSupportTicket,
    }),
    [
      activeScope,
      currentData,
      addBeneficiary,
      deleteBeneficiary,
      addTransaction,
      claimWalkInTransaction,
      saveDraft,
      deleteDraft,
      addCorrection,
      addSupportTicket,
    ]
  );

  return <DomainStateContext.Provider value={value}>{children}</DomainStateContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useDomainState(): DomainStateContextValue {
  const context = useContext(DomainStateContext);
  if (!context) {
    throw new Error('useDomainState must be used within a DomainStateProvider');
  }
  return context;
}
