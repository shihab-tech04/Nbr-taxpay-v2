import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDhakaTodayYmd } from '../../design-system/dates/dateUtils';
import { sanitizePassport } from '../../design-system/forms';
import { useApp } from '../../shared/AppContext';
import { rotateWalkInSessionId } from '../../shared/accountSession';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import type { PaymentTransaction } from '../../types/tax';
import {
  calculateTravelBreakdown, lookupBdPassport, maskPassport, validatePassengerDraft,
  validateReceiptMobile, validateTravelDetails, validateTravelSubmission,
} from './travelTaxLogic';
import { getTravelTaxMsg } from './travelTaxMessages';
import {
  buildTravelTransactionPayload, emptyDraftPassenger, resolveTravelRouteSeed, type TravelRouteState,
} from './travelTaxFlowUtils';
import type {
  ConfirmedPassenger, DraftPassengerInput, TravelDetailsErrors, TravelDetailsInput, TravelPassengerErrors, TravelStage,
} from './travelTaxTypes';

export function useTravelTaxFlow() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const msg = getTravelTaxMsg(lang);
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? null) as TravelRouteState | null;
  const { user, isAuthenticated, activeScope, drafts, transactions, addTransaction, saveDraft } = useApp();

  const [seed] = useState(() =>
    resolveTravelRouteSeed({ routeState, activeScope, isAuthenticated, drafts, transactions, lang })
  );
  const [routeSeedError, setRouteSeedError] = useState<string>(seed.error ?? '');
  const [stage, setStage] = useState<TravelStage>(seed.initialStage);
  const [step, setStep] = useState<'stages' | 'channel' | 'success'>('stages');
  const [confirmedPassengers, setConfirmedPassengers] = useState<ConfirmedPassenger[]>(seed.passengers);
  const [entryOpen, setEntryOpen] = useState(seed.passengers.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPassengerInput>(() => emptyDraftPassenger());
  const [passengerErrors, setPassengerErrors] = useState<TravelPassengerErrors>({});
  const [details, setDetails] = useState<TravelDetailsInput>(seed.details);
  const [detailsErrors, setDetailsErrors] = useState<TravelDetailsErrors>({});
  const [receiptMobile, setReceiptMobile] = useState(seed.receiptMobile);
  const [mobileError, setMobileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const submitLockRef = useRef(false);

  const breakdown = calculateTravelBreakdown(confirmedPassengers, details.travelDate);

  const handleCheckBdPassport = () => {
    if (!sanitizePassport(draft.passportNumber, 12)) return;
    const sample = lookupBdPassport(draft.passportNumber);
    if (!sample) {
      setDraft((prev) => ({ ...prev, passengerName: '', dob: '', bdChecked: false }));
      setPassengerErrors({ lookupUnavailable: true, passport: msg.lookupUnavailable });
      return;
    }
    setDraft((prev) => ({ ...prev, passportNumber: sample.passportNumber, passengerName: sample.passengerName, dob: sample.dob, bdChecked: true }));
    setPassengerErrors({});
  };

  const handleConfirmPassenger = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const errs = validatePassengerDraft(draft, confirmedPassengers, editingId, getDhakaTodayYmd(), lang);
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
    const errs = validateTravelDetails(details, confirmedPassengers, getDhakaTodayYmd(), lang);
    if (Object.keys(errs).length > 0) { setDetailsErrors(errs); return; }
    setDetailsErrors({}); setStage(3);
  };

  const runFinalSubmission = (channel: ActivePaymentChannel | 'Zero-Tax') => {
    if (!isRestrictedOperationAllowed('payment_submit') || submitLockRef.current) return;
    const check = validateTravelSubmission({ passengers: confirmedPassengers, details, receiptMobile, todayYmd: getDhakaTodayYmd(), lang });
    if (!check.ok || !check.breakdown.valid) {
      setSubmitError(check.error ?? msg.preSubmitFailed);
      return;
    }
    setSubmitError('');
    submitLockRef.current = true;
    const resolvedChannel: ActivePaymentChannel | 'Zero-Tax' = check.breakdown.totalAmount === 0 ? 'Zero-Tax' : channel;
    const tx = addTransaction(buildTravelTransactionPayload({
      breakdownItems: check.breakdown.items, totalAmount: check.breakdown.totalAmount, details, channel: resolvedChannel,
      mobileNormalized: check.normalizedMobile, isAuthenticated, userTin: user.tin, userName: user.name, activeScope,
    }));
    setCompletedTx(tx); setShowReceipt(isAuthenticated); setStep('success');
  };

  const handleProceedFromPreview = () => {
    const check = validateTravelSubmission({ passengers: confirmedPassengers, details, receiptMobile, todayYmd: getDhakaTodayYmd(), lang });
    const mob = validateReceiptMobile(receiptMobile, breakdown.totalAmount, lang);
    if (!mob.valid) { setMobileError(mob.error ?? msg.mobileInvalid); return; }
    setMobileError('');
    if (!check.ok) { setSubmitError(check.error ?? msg.preSubmitFailed); return; }
    setSubmitError('');
    if (check.breakdown.totalAmount === 0) runFinalSubmission('Zero-Tax');
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
        travelDate: details.travelDate, contactMobile: receiptMobile || undefined, stage: 1,
      },
    });
    navigate('/drafts');
  };

  const resetWalkIn = () => {
    rotateWalkInSessionId(); submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setCertOpen(false);
    setConfirmedPassengers([]); setEntryOpen(true); setEditingId(null); setDraft(emptyDraftPassenger());
    setDetails({ travelMode: 'Land', departurePort: '', destination: '', travelDate: '' }); setReceiptMobile('');
    setRouteSeedError(''); setSubmitError(''); setStage(1); setStep('stages');
  };

  const isDirty = confirmedPassengers.length > 0 || Boolean(draft.passportNumber || details.departurePort || details.destination || details.travelDate);

  return {
    isAuthenticated, isDirty, routeSeedError, stage, setStage, step, setStep, confirmedPassengers, entryOpen, editingId,
    draft, setDraft, passengerErrors, setPassengerErrors, details, setDetails, detailsErrors, setDetailsErrors,
    receiptMobile, setReceiptMobile, mobileError, setMobileError, submitError, paymentChannel, setPaymentChannel,
    completedTx, showReceipt, setShowReceipt, certOpen, setCertOpen, breakdown, handleCheckBdPassport,
    handleConfirmPassenger, handleEditConfirmed, handleProceedFromDetails, handleProceedFromPreview,
    handleConfirmChannelPayment: () => runFinalSubmission(paymentChannel),
    handleOpenAddAnother: () => { setEditingId(null); setDraft(emptyDraftPassenger()); setPassengerErrors({}); setEntryOpen(true); },
    handleCancelEntry: () => { setEditingId(null); setDraft(emptyDraftPassenger()); setPassengerErrors({}); setEntryOpen(false); },
    handleRemoveConfirmed: (id: string) => setConfirmedPassengers((prev) => { const next = prev.filter((p) => p.id !== id); if (next.length === 0) setEntryOpen(true); return next; }),
    handleProceedFromPassengers: () => {
      if (confirmedPassengers.length === 0) { setPassengerErrors({ passport: msg.noConfirmedPassengers }); return; }
      if (confirmedPassengers.some((p) => p.needsRevalidation)) { setPassengerErrors({ passport: msg.revalidateBeforeContinue }); return; }
      setStage(2);
    },
    handleSaveDraft, resetWalkIn, goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
