import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Beneficiary,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
} from '../types/tax';
import {
  INITIAL_BENEFICIARIES,
  INITIAL_CORRECTIONS,
  INITIAL_DRAFTS,
  INITIAL_SUPPORT,
  INITIAL_TRANSACTIONS,
} from './mockData';
import {
  createExperimentalBeneficiary,
  createExperimentalCorrection,
  createExperimentalDraft,
  createExperimentalSupportTicket,
  createExperimentalTransaction,
} from './mockLedgerAdapter';
import { isRestrictedOperationAllowed } from './previewPolicy';
import { readJsonStorage, writeAppStorage } from './storageAdapter';

export interface DomainStateContextValue {
  beneficiaries: Beneficiary[];
  addBeneficiary: (b: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
  deleteBeneficiary: (id: string) => void;
  transactions: PaymentTransaction[];
  addTransaction: (
    tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>
  ) => PaymentTransaction;
  drafts: PaymentDraft[];
  saveDraft: (draft: Omit<PaymentDraft, 'id' | 'updatedAt'>) => void;
  deleteDraft: (id: string) => void;
  corrections: CorrectionRequest[];
  addCorrection: (c: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (s: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
}

const DomainStateContext = createContext<DomainStateContextValue | undefined>(undefined);

export const DomainStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() =>
    readJsonStorage('sohojkor_beneficiaries', INITIAL_BENEFICIARIES)
  );
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() =>
    readJsonStorage('sohojkor_transactions', INITIAL_TRANSACTIONS)
  );
  const [drafts, setDrafts] = useState<PaymentDraft[]>(() =>
    readJsonStorage('sohojkor_drafts', INITIAL_DRAFTS)
  );
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(() =>
    readJsonStorage('sohojkor_corrections', INITIAL_CORRECTIONS)
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    readJsonStorage('sohojkor_support', INITIAL_SUPPORT)
  );

  useEffect(() => {
    writeAppStorage('sohojkor_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    writeAppStorage('sohojkor_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    writeAppStorage('sohojkor_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    writeAppStorage('sohojkor_corrections', JSON.stringify(corrections));
  }, [corrections]);

  useEffect(() => {
    writeAppStorage('sohojkor_support', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, 'id' | 'createdAt'>) => {
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    setBeneficiaries((prev) => [createExperimentalBeneficiary(b), ...prev]);
  }, []);

  const deleteBeneficiary = useCallback((id: string) => {
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    setBeneficiaries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addTransaction = useCallback(
    (
      txData: Omit<
        PaymentTransaction,
        'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'
      >
    ): PaymentTransaction => {
      if (!isRestrictedOperationAllowed('payment_submit')) {
        throw new Error('Payment submission is disabled in public preview.');
      }
      const newTx = createExperimentalTransaction(txData);
      setTransactions((prev) => [newTx, ...prev]);
      return newTx;
    },
    []
  );

  const saveDraft = useCallback((draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>) => {
    if (!isRestrictedOperationAllowed('draft_write')) return;
    setDrafts((prev) => [createExperimentalDraft(draftData), ...prev]);
  }, []);

  const deleteDraft = useCallback((id: string) => {
    if (!isRestrictedOperationAllowed('draft_write')) return;
    setDrafts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addCorrection = useCallback(
    (cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => {
      if (!isRestrictedOperationAllowed('correction_write')) return;
      setCorrections((prev) => [createExperimentalCorrection(cData), ...prev]);
    },
    []
  );

  const addSupportTicket = useCallback(
    (sData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
      if (!isRestrictedOperationAllowed('support_ticket_write')) return;
      setSupportTickets((prev) => [createExperimentalSupportTicket(sData), ...prev]);
    },
    []
  );

  const value = useMemo<DomainStateContextValue>(
    () => ({
      beneficiaries,
      addBeneficiary,
      deleteBeneficiary,
      transactions,
      addTransaction,
      drafts,
      saveDraft,
      deleteDraft,
      corrections,
      addCorrection,
      supportTickets,
      addSupportTicket,
    }),
    [
      beneficiaries,
      addBeneficiary,
      deleteBeneficiary,
      transactions,
      addTransaction,
      drafts,
      saveDraft,
      deleteDraft,
      corrections,
      addCorrection,
      supportTickets,
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
