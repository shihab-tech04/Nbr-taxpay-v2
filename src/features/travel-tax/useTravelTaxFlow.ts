import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDhakaTodayYmd } from '../../design-system/dates/dateUtils';
import { sanitizePassport } from '../../design-system/forms';
import { useApp } from '../../shared/AppContext';
import { rotateWalkInSessionId } from '../../shared/accountSession';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import type { PaymentTransaction } from '../../types/tax';
import {
  calculateTravelBreakdown,
  lookupBdPassport,
  maskPassport,
  validatePassengerDraft,
  validateReceiptMobile,
  validateTravelDetails,
} from './travelTaxLogic';
import {
  buildTravelTransactionPayload,
  emptyDraftPassenger,
  extractInitialConfirmedPassengers,
  type TravelRouteState,
} from './travelTaxFlowUtils';
import type {
  ConfirmedPassenger,
  DraftPassengerInput,
  TravelDetailsErrors,
  TravelDetailsInput,
  TravelPassengerErrors,
  TravelStage,
} from './travelTaxTypes';

export function useTravelTaxFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? null) as TravelRouteState | null;
  const { user, isAuthenticated, activeScope, addTransaction, saveDraft } = useApp();

  const initialConfirmed = extractInitialConfirmedPassengers(routeState);
  const [stage, setStage] = useState<TravelStage>(() => routeState?.resumeDraft?.travelDraft?.stage ?? 1);
  const [step, setStep] = useState<'stages' | 'channel' | 'success'>('stages');
  const [confirmedPassengers, setConfirmedPassengers] = useState<ConfirmedPassenger[]>(initialConfirmed);
  const [entryOpen, setEntryOpen] = useState(initialConfirmed.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPassengerInput>(() => emptyDraftPassenger());
  const [passengerErrors, setPassengerErrors] = useState<TravelPassengerErrors>({});
  const [details, setDetails] = useState<TravelDetailsInput>(() => ({
    travelMode: routeState?.resumeDraft?.travelDraft?.travelMode ?? routeState?.reuseTx?.travelDetails?.travelMode ?? 'Land',
    departurePort: routeState?.resumeDraft?.travelDraft?.departurePort ?? routeState?.reuseTx?.travelDetails?.departurePort ?? '',
    destination: routeState?.resumeDraft?.travelDraft?.destination ?? routeState?.reuseTx?.travelDetails?.destination ?? '',
    travelDate: routeState?.resumeDraft?.travelDraft?.travelDate ?? '',
  }));
  const [detailsErrors, setDetailsErrors] = useState<TravelDetailsErrors>({});
  const [receiptMobile, setReceiptMobile] = useState(routeState?.resumeDraft?.travelDraft?.contactMobile ?? routeState?.reuseTx?.travelDetails?.contactMobile ?? '');
  const [mobileError, setMobileError] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const submitLockRef = useRef(false);

  const breakdown = calculateTravelBreakdown(confirmedPassengers, details.travelDate);

  const handleCheckBdPassport = () => {
    const sample = lookupBdPassport(draft.passportNumber);
    if (!sample) {
      setDraft((prev) => ({ ...prev, passengerName: '', dob: '', bdChecked: false }));
      setPassengerErrors({ lookupUnavailable: true, passport: 'Passport lookup unavailable for this number. Use a valid sample passport.' });
      return;
    }
    setDraft((prev) => ({ ...prev, passportNumber: sample.passportNumber, passengerName: sample.passengerName, dob: sample.dob, bdChecked: true }));
    setPassengerErrors({});
  };

  const handleConfirmPassenger = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const errs = validatePassengerDraft(draft, confirmedPassengers, editingId, getDhakaTodayYmd());
    if (Object.keys(errs).length > 0) { setPassengerErrors(errs); return; }
    const cleanNum = sanitizePassport(draft.passportNumber, 12);
    const confirmed: ConfirmedPassenger = {
      id: editingId ?? draft.id, passportType: draft.passportType, passportNumber: cleanNum, passportMasked: maskPassport(cleanNum),
      passengerName: draft.passengerName.trim(), dob: draft.dob, nationality: draft.passportType === 'Foreign' ? draft.nationality : undefined, needsRevalidation: false,
    };
    setConfirmedPassengers((prev) => (editingId ? prev.map((p) => (p.id === editingId ? confirmed : p)) : [...prev, confirmed]));
    setEditingId(null); setDraft(emptyDraftPassenger()); setPassengerErrors({}); setEntryOpen(false);
  };

  const handleEditConfirmed = (id: string) => {
    const target = confirmedPassengers.find((p) => p.id === id);
    if (!target) return;
    setEditingId(id);
    setDraft({
      id: target.id, passportType: target.passportType, passportNumber: target.needsRevalidation ? '' : target.passportNumber,
      passengerName: target.passengerName, dob: target.dob, nationality: target.nationality ?? '',
      bdChecked: target.passportType === 'BD' && !target.needsRevalidation && Boolean(lookupBdPassport(target.passportNumber)), medicalAssessment: false,
    });
    setPassengerErrors({}); setEntryOpen(true);
  };

  const handleProceedFromDetails = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const errs = validateTravelDetails(details, confirmedPassengers, getDhakaTodayYmd());
    if (Object.keys(errs).length > 0) { setDetailsErrors(errs); return; }
    setDetailsErrors({}); setStage(3);
  };

  const finalizeTransaction = (channel: ActivePaymentChannel, mobileNormalized: string) => {
    if (!isRestrictedOperationAllowed('payment_submit') || submitLockRef.current || !breakdown.valid) return;
    submitLockRef.current = true;
    const tx = addTransaction(buildTravelTransactionPayload({
      breakdownItems: breakdown.items, totalAmount: breakdown.totalAmount, details, channel, mobileNormalized,
      isAuthenticated, userTin: user.tin, userName: user.name, activeScope,
    }));
    setCompletedTx(tx); setShowReceipt(isAuthenticated); setStep('success');
  };

  const handleProceedFromPreview = () => {
    const mob = validateReceiptMobile(receiptMobile, breakdown.totalAmount);
    if (!mob.valid) { setMobileError(mob.error ?? 'Invalid mobile'); return; }
    setMobileError('');
    if (breakdown.totalAmount === 0) finalizeTransaction('bKash', mob.normalized);
    else setStep('channel');
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    saveDraft({
      title: `Travel Tax (${details.travelMode} - ${details.destination || 'Draft'})`,
      category: 'travel_tax',
      items: [],
      travelDraft: {
        passengers: confirmedPassengers.map((p) => ({
          id: p.id, passengerName: p.passengerName, passportType: p.passportType, passportMasked: p.passportMasked,
          dob: p.dob, nationality: p.nationality, ageOnTravelDate: 0, amount: 0, confirmed: true,
        })),
        travelMode: details.travelMode, departurePort: details.departurePort, destination: details.destination,
        travelDate: details.travelDate, contactMobile: receiptMobile || undefined, stage,
      },
    });
    navigate('/drafts');
  };

  const resetWalkIn = () => {
    rotateWalkInSessionId(); submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setCertOpen(false);
    setConfirmedPassengers([]); setEntryOpen(true); setEditingId(null); setDraft(emptyDraftPassenger());
    setDetails({ travelMode: 'Land', departurePort: '', destination: '', travelDate: '' }); setReceiptMobile(''); setStage(1); setStep('stages');
  };

  return {
    isAuthenticated, stage, setStage, step, setStep, confirmedPassengers, entryOpen, editingId, draft, setDraft, passengerErrors, setPassengerErrors,
    details, setDetails, detailsErrors, setDetailsErrors, receiptMobile, setReceiptMobile, mobileError, setMobileError,
    paymentChannel, setPaymentChannel, completedTx, showReceipt, setShowReceipt, certOpen, setCertOpen, breakdown,
    handleCheckBdPassport, handleConfirmPassenger, handleEditConfirmed, handleProceedFromDetails, handleProceedFromPreview,
    handleConfirmChannelPayment: () => finalizeTransaction(paymentChannel, validateReceiptMobile(receiptMobile, breakdown.totalAmount).normalized),
    handleOpenAddAnother: () => { setEditingId(null); setDraft(emptyDraftPassenger()); setPassengerErrors({}); setEntryOpen(true); },
    handleCancelEntry: () => { setEditingId(null); setDraft(emptyDraftPassenger()); setPassengerErrors({}); setEntryOpen(false); },
    handleRemoveConfirmed: (id: string) => setConfirmedPassengers((prev) => { const next = prev.filter((p) => p.id !== id); if (next.length === 0) setEntryOpen(true); return next; }),
    handleProceedFromPassengers: () => {
      if (confirmedPassengers.some((p) => p.needsRevalidation)) { setPassengerErrors({ passport: 'Revalidate masked passport numbers before continuing.' }); return; }
      setStage(2);
    },
    handleSaveDraft, resetWalkIn, goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
