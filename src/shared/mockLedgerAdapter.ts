import {
  Beneficiary,
  BeneficiaryList,
  CorrectionRequest,
  PaymentDraft,
  PaymentTransaction,
  SupportTicket,
  UnverifiedCorrectionInquiry,
} from '../types/tax';
import { isValidYmd } from '../design-system/dates/dateUtils';
import { getActiveWalkInSessionId } from './accountSession';

// Explicitly isolated experimental mock adapters for offline prototype state.
// These helpers do NOT connect to official NBR/Sonali/bank verification APIs.

export function createExperimentalBeneficiaryList(name: string): BeneficiaryList {
  return {
    id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: name.trim(),
    createdAt: new Date().toISOString().split('T')[0],
  };
}

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
  if (txData.giftDate !== undefined && !isValidYmd(txData.giftDate)) {
    throw new Error(`Invalid giftDate "${String(txData.giftDate)}"; expected valid YYYY-MM-DD.`);
  }
  const isWalkIn = txData.originMode === 'walk_in' || txData.ownerScope === 'walkin';
  const safeTravelDetails = txData.travelDetails
    ? {
        ...txData.travelDetails,
        passportNumber: isWalkIn ? undefined : txData.travelDetails.passportNumber,
      }
    : undefined;
  const isZeroTax =
    (txData.category === 'travel_tax' || txData.category === 'gift_tax') && txData.totalAmount === 0;
  const resolvedChannel = isZeroTax ? 'Zero-Tax' : txData.paymentChannel;
  return {
    ...txData,
    paymentChannel: resolvedChannel,
    travelDetails: safeTravelDetails,
    walkInSessionId: isWalkIn ? txData.walkInSessionId ?? getActiveWalkInSessionId() : txData.walkInSessionId,
    id: `tx-${Date.now()}`,
    transactionRef: `SOHO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    challanNumber: `NBR-CHL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    bankRef: isZeroTax
      ? ''
      : `${resolvedChannel.substring(0, 2).toUpperCase()}-TRX-${Math.floor(1000000 + Math.random() * 9000000)}`,
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
    ticketNumber: data.ticketNumber ?? `CORR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Submitted',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export function createExperimentalUnverifiedInquiry(
  data: Omit<UnverifiedCorrectionInquiry, 'id' | 'ticketNumber' | 'createdAt' | 'status'>
): UnverifiedCorrectionInquiry {
  const isWalkIn = data.ownerScope === 'walkin';
  return {
    ...data,
    walkInSessionId: isWalkIn ? data.walkInSessionId ?? getActiveWalkInSessionId() : data.walkInSessionId,
    id: `inq-${Date.now()}`,
    ticketNumber: `INQ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Logged (Unverified Inquiry)',
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
