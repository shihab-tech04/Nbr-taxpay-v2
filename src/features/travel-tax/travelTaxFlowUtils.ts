import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import type { PaymentDraft, PaymentTransaction } from '../../types/tax';
import type { ConfirmedPassenger, DraftPassengerInput, TravelDetailsInput } from './travelTaxTypes';

export interface TravelRouteState {
  resumeDraft?: PaymentDraft;
  reuseTx?: PaymentTransaction;
}

export function emptyDraftPassenger(id = `tp-${Date.now()}`): DraftPassengerInput {
  return { id, passportType: 'BD', passportNumber: '', passengerName: '', dob: '', nationality: '', bdChecked: false, medicalAssessment: false };
}

export function extractInitialConfirmedPassengers(routeState: TravelRouteState | null): ConfirmedPassenger[] {
  if (routeState?.resumeDraft?.travelDraft?.passengers?.length) {
    return routeState.resumeDraft.travelDraft.passengers.map((p) => ({
      id: p.id, passportType: p.passportType, passportNumber: p.passportMasked, passportMasked: p.passportMasked,
      passengerName: p.passengerName, dob: p.dob, nationality: p.nationality,
    }));
  }
  if (routeState?.reuseTx?.travelDetails?.passengers?.length) {
    return routeState.reuseTx.travelDetails.passengers.map((p) => ({
      id: p.id, passportType: p.passportType, passportNumber: '', passportMasked: p.passportMasked,
      passengerName: p.passengerName, dob: p.dob, nationality: p.nationality, needsRevalidation: true,
    }));
  }
  return [];
}

export function buildTravelTransactionPayload(params: {
  breakdownItems: ReadonlyArray<ConfirmedPassenger & { ageOnTravelDate: number; amount: number }>;
  totalAmount: number;
  details: TravelDetailsInput;
  channel: ActivePaymentChannel;
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
      headId: 'h5', headCode: '0120',
      headNameEn: `Travel Tax - ${details.travelMode} (${p.passportMasked})`,
      headNameBn: `ভ্রমণ কর - ${details.travelMode} (${p.passengerName})`,
      assessmentYear: '2025-2026',
      amount: p.amount,
      remarks: `${details.departurePort} -> ${details.destination} on ${details.travelDate} (Age ${p.ageOnTravelDate})`,
    })),
    totalAmount,
    paymentChannel: channel,
    status: 'Completed',
  };
}
