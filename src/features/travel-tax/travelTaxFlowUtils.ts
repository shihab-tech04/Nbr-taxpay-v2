import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import type { PaymentDraft, PaymentTransaction } from '../../types/tax';
import { getTravelTaxMsg, type TravelLang } from './travelTaxMessages';
import {
  TRAVEL_TAX_ECONOMIC_CODE,
  TRAVEL_TAX_YEAR,
  type ConfirmedPassenger,
  type DraftPassengerInput,
  type TravelDetailsInput,
} from './travelTaxTypes';

export interface TravelRouteState {
  draftId?: string;
  reuseTxRef?: string;
  resumeDraft?: unknown;
  reuseTx?: unknown;
}

export interface TravelSeedResolution {
  passengers: ConfirmedPassenger[];
  details: TravelDetailsInput;
  receiptMobile: string;
  initialStage: 1;
  rejected: boolean;
  error?: string;
}

function normalizeMaskedDisplay(masked?: string): string {
  const clean = (masked ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!clean) return '••••';
  return `••••${clean.slice(-4)}`;
}

export function emptyDraftPassenger(id = `tp-${Date.now()}`): DraftPassengerInput {
  return { id, passportType: 'BD', passportNumber: '', passengerName: '', dob: '', nationality: '', bdChecked: false, medicalAssessment: false };
}

export function resolveTravelRouteSeed(params: {
  routeState: TravelRouteState | null;
  draftIdParam?: string | null;
  reuseRefParam?: string | null;
  activeScope: string;
  isAuthenticated: boolean;
  drafts: readonly PaymentDraft[];
  transactions: readonly PaymentTransaction[];
  lang?: TravelLang;
}): TravelSeedResolution {
  const { routeState, draftIdParam, reuseRefParam, activeScope, isAuthenticated, drafts, transactions, lang = 'en' } = params;
  const emptyDetails: TravelDetailsInput = { travelMode: 'Land', departurePort: '', destination: '', travelDate: '' };
  const msg = getTravelTaxMsg(lang);

  // Never trust inline payload objects from routeState; only resolve stored owner-scoped IDs/refs.
  if (routeState?.resumeDraft !== undefined || routeState?.reuseTx !== undefined) {
    return { passengers: [], details: emptyDetails, receiptMobile: '', initialStage: 1, rejected: true, error: msg.routeStateRejected };
  }

  const targetDraftId = routeState?.draftId || draftIdParam || '';
  const targetReuseRef = routeState?.reuseTxRef || reuseRefParam || '';
  if (!targetDraftId && !targetReuseRef) {
    return { passengers: [], details: emptyDetails, receiptMobile: '', initialStage: 1, rejected: false };
  }

  if (targetDraftId) {
    const storedDraft = isAuthenticated
      ? drafts.find((item) => item.id === targetDraftId && item.category === 'travel_tax')
      : undefined;
    if (!storedDraft || !storedDraft.travelDraft?.passengers?.length) {
      return { passengers: [], details: emptyDetails, receiptMobile: '', initialStage: 1, rejected: true, error: msg.routeStateRejected };
    }
    return {
      passengers: storedDraft.travelDraft.passengers.map((p) => ({
        id: p.id, passportType: p.passportType, passportNumber: '', passportMasked: normalizeMaskedDisplay(p.passportMasked),
        passengerName: p.passengerName, dob: p.dob, nationality: p.nationality, needsRevalidation: true,
      })),
      details: {
        travelMode: storedDraft.travelDraft.travelMode ?? 'Land',
        departurePort: storedDraft.travelDraft.departurePort ?? '',
        destination: storedDraft.travelDraft.destination ?? '',
        travelDate: storedDraft.travelDraft.travelDate ?? '',
      },
      receiptMobile: storedDraft.travelDraft.contactMobile ?? '',
      initialStage: 1,
      rejected: false,
    };
  }

  const storedTx = transactions.find(
    (item) =>
      (item.transactionRef === targetReuseRef || item.id === targetReuseRef) &&
      item.category === 'travel_tax' &&
      (!item.ownerScope || item.ownerScope === activeScope)
  );
  if (!storedTx || !storedTx.travelDetails?.passengers?.length) {
    return { passengers: [], details: emptyDetails, receiptMobile: '', initialStage: 1, rejected: true, error: msg.routeStateRejected };
  }
  return {
    passengers: storedTx.travelDetails.passengers.map((p) => ({
      id: p.id, passportType: p.passportType, passportNumber: '', passportMasked: normalizeMaskedDisplay(p.passportMasked),
      passengerName: p.passengerName, dob: p.dob, nationality: p.nationality, needsRevalidation: true,
    })),
    details: {
      travelMode: storedTx.travelDetails.travelMode ?? 'Land',
      departurePort: storedTx.travelDetails.departurePort ?? '',
      destination: storedTx.travelDetails.destination ?? '',
      travelDate: '',
    },
    receiptMobile: storedTx.travelDetails.contactMobile ?? '',
    initialStage: 1,
    rejected: false,
  };
}

export function buildTravelTransactionPayload(params: {
  breakdownItems: ReadonlyArray<ConfirmedPassenger & { ageOnTravelDate: number; amount: number }>;
  totalAmount: number;
  details: TravelDetailsInput;
  channel: ActivePaymentChannel | 'Zero-Tax';
  mobileNormalized: string;
  isAuthenticated: boolean;
  userTin: string;
  userName: string;
  activeScope: string;
}): Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'> {
  const { breakdownItems, totalAmount, details, channel, mobileNormalized, isAuthenticated, userTin, userName, activeScope } = params;
  return {
    taxpayerTin: isAuthenticated ? userTin : '',
    taxpayerName: isAuthenticated ? userName : (breakdownItems[0]?.passengerName || 'Walk-in Passenger'),
    ownerScope: activeScope,
    originMode: isAuthenticated ? 'signed_in' : 'walk_in',
    category: 'travel_tax',
    travelDetails: {
      passengerName: breakdownItems[0]?.passengerName,
      passportMasked: breakdownItems[0]?.passportMasked,
      travelMode: details.travelMode,
      departurePort: details.departurePort,
      destination: details.destination,
      travelDate: details.travelDate,
      contactMobile: mobileNormalized || undefined,
      passengers: breakdownItems.map((p) => ({
        id: p.id, passengerName: p.passengerName, passportType: p.passportType, passportMasked: p.passportMasked,
        dob: p.dob, nationality: p.nationality, ageOnTravelDate: p.ageOnTravelDate, amount: p.amount, confirmed: true,
      })),
    },
    items: breakdownItems.map((p) => ({
      headId: 'h5', headCode: TRAVEL_TAX_ECONOMIC_CODE,
      headNameEn: `Travel Tax - ${details.travelMode} (${p.passportMasked})`,
      headNameBn: `ভ্রমণ কর - ${details.travelMode} (${p.passengerName})`,
      assessmentYear: TRAVEL_TAX_YEAR,
      amount: p.amount,
      remarks: `${details.departurePort} -> ${details.destination} on ${details.travelDate} (Age ${p.ageOnTravelDate})`,
    })),
    totalAmount,
    paymentChannel: totalAmount === 0 ? 'Zero-Tax' : channel,
    status: 'Completed',
  };
}
