import {
  Beneficiary,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
} from '../types/tax';

// Explicitly isolated experimental mock adapters for offline prototype state.
// These helpers do NOT connect to official NBR/Sonali/bank verification APIs.

export function createExperimentalBeneficiary(
  input: Omit<Beneficiary, 'id' | 'createdAt'>
): Beneficiary {
  return {
    ...input,
    id: `b-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function createExperimentalTransaction(
  txData: Omit<
    PaymentTransaction,
    'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'
  >
): PaymentTransaction {
  return {
    ...txData,
    id: `tx-${Date.now()}`,
    transactionRef: `SOHO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    challanNumber: `NBR-CHL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    bankRef: `${txData.paymentChannel.substring(0, 2).toUpperCase()}-TRX-${Math.floor(1000000 + Math.random() * 9000000)}`,
    createdAt: new Date().toISOString(),
  };
}

export function createExperimentalDraft(
  draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>
): PaymentDraft {
  return {
    ...draftData,
    id: `dr-${Date.now()}`,
    updatedAt: new Date().toISOString().split('T')[0],
  };
}

export function createExperimentalCorrection(
  data: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>
): CorrectionRequest {
  return {
    ...data,
    id: `cor-${Date.now()}`,
    status: 'Submitted',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function createExperimentalSupportTicket(
  data: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
): SupportTicket {
  return {
    ...data,
    id: `sup-${Date.now()}`,
    status: 'Open',
    createdAt: new Date().toISOString().split('T')[0],
  };
}
