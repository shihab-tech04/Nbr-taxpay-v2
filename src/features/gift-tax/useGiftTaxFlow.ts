import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import { executePaymentAttempt } from '../../components/payments/paymentSubmission';
import { getDhakaTodayYmd } from '../../design-system/forms';
import { rotateWalkInSessionId } from '../../shared/accountSession';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentTransaction } from '../../types/tax';
import { buildGiftTransactionPayload, resolveGiftTaxRouteSeed } from './giftTaxFlowUtils';
import { calculateGiftTaxAmount, canUndoGiftPartyRemoval, isGiftRelationshipValid, lookupGiftTaxpayer, validateGiftPartiesStep, validateGiftValuationStep } from './giftTaxLogic';
import type { GiftFormErrors, GiftPartyRecord, GiftRelationship, GiftRouteState, RemovedPartyUndoState } from './giftTaxTypes';

export function useGiftTaxFlow() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, activeScope, beneficiaries, drafts, transactions, addTransaction, saveDraft } = useApp();
  const [seed] = useState(() => resolveGiftTaxRouteSeed({
    routeState: (location.state ?? null) as GiftRouteState | null,
    draftIdParam: searchParams.get('draftId'), reuseRefParam: searchParams.get('reuseRef'),
    drafts, transactions, activeScope, isAuthenticated,
  }));

  const [stage, setStage] = useState<1 | 2 | 3>(seed.stage);
  const [step, setStep] = useState<'stages' | 'channel' | 'success'>('stages');
  const [donor, setDonor] = useState<GiftPartyRecord | null>(seed.donor);
  const [donee, setDonee] = useState<GiftPartyRecord | null>(seed.donee);
  const [donorTinInput, setDonorTinInput] = useState(seed.donor?.tin ?? '');
  const [doneeTinInput, setDoneeTinInput] = useState(seed.donee?.tin ?? '');
  const [donorLookupResult, setDonorLookupResult] = useState<GiftPartyRecord | null>(null);
  const [doneeLookupResult, setDoneeLookupResult] = useState<GiftPartyRecord | null>(null);
  const [donorLookupError, setDonorLookupError] = useState('');
  const [doneeLookupError, setDoneeLookupError] = useState('');
  const [relationship, setRelationship] = useState<GiftRelationship | ''>(seed.relationship);
  const [relationshipTag, setRelationshipTag] = useState(seed.relationshipTag);
  const [undoParty, setUndoParty] = useState<RemovedPartyUndoState | null>(null);
  const [giftAmountInput, setGiftAmountInput] = useState(seed.giftAmountInput);
  const [giftDate, setGiftDate] = useState(seed.giftDate);
  const [description, setDescription] = useState(seed.description);
  const [remarks, setRemarks] = useState(seed.remarks);
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackError, setAckError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<GiftFormErrors>({});
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const submitLockRef = useRef(false);

  const calculation = calculateGiftTaxAmount(giftAmountInput);
  const valuationCurrentErrors = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd());
  const hasValidatedEstimate = Boolean(completedTx || (Object.keys(valuationCurrentErrors).length === 0 && calculation.giftAmount > 0));
  const isDirty = Boolean(step !== 'success' && (donor || donee || donorTinInput || doneeTinInput || relationship || giftAmountInput || description || giftDate || remarks));

  const runPartyLookup = (role: 'donor' | 'donee') => {
    const match = lookupGiftTaxpayer(role === 'donor' ? donorTinInput : doneeTinInput, beneficiaries);
    if (role === 'donor') {
      setDonorLookupResult(match);
      setDonorLookupError(match ? '' : (isBn ? 'এই ১২ ডিজিটের টিআইএন-এর জন্য কোনো দাতার তথ্য পাওয়া যায়নি।' : 'No taxpayer record found for this 12-digit TIN.'));
    } else {
      setDoneeLookupResult(match);
      setDoneeLookupError(match ? '' : (isBn ? 'এই ১২ ডিজিটের টিআইএন-এর জন্য কোনো গ্রহীতার তথ্য পাওয়া যায়নি।' : 'No taxpayer record found for this 12-digit TIN.'));
    }
  };

  const handleAddDonor = () => {
    if (!donorLookupResult || (donee && donorLookupResult.tin === donee.tin)) return;
    setDonor(donorLookupResult); setDonorLookupResult(null); setDonorTinInput(''); setUndoParty(null);
    setAcknowledged(false); setErrors((p) => ({ ...p, donor: undefined }));
  };

  const handleAddDonee = () => {
    if (!doneeLookupResult || (donor && doneeLookupResult.tin === donor.tin)) return;
    if (!isGiftRelationshipValid(relationship, relationshipTag)) {
      setErrors((p) => ({
        ...p,
        relationship: !relationship ? (isBn ? 'গ্রহীতার সম্পর্ক নির্বাচন করুন।' : 'Select a valid Donee relationship.') : undefined,
        relationshipTag: relationship === 'Others' ? (isBn ? 'অন্যান্য সম্পর্কের বিবরণ (১–৮০ অক্ষর) লিখুন।' : 'Custom relationship description (1–80 characters) is required.') : undefined,
      }));
      return;
    }
    const cleanTag = relationship === 'Others' ? relationshipTag.trim() : relationship;
    setDonee({ ...doneeLookupResult, relationship: relationship || undefined, relationshipTag: cleanTag });
    setDoneeLookupResult(null); setDoneeTinInput(''); setUndoParty(null);
    setAcknowledged(false); setErrors((p) => ({ ...p, donee: undefined, relationship: undefined, relationshipTag: undefined }));
  };

  const handleSelectRelationship = (nextRel: GiftRelationship) => {
    setRelationship(nextRel);
    const nextTag = nextRel === 'Others' ? (relationship === 'Others' ? relationshipTag : '') : nextRel;
    setRelationshipTag(nextTag);
    if (donee) setDonee({ ...donee, relationship: nextRel, relationshipTag: nextRel === 'Others' ? nextTag.trim() : nextRel });
    setErrors((p) => ({ ...p, relationship: undefined, relationshipTag: undefined }));
  };

  const handleChangeRelationshipTag = (nextTag: string) => {
    setRelationshipTag(nextTag);
    if (donee && relationship === 'Others') setDonee({ ...donee, relationshipTag: nextTag.trim() });
    if (errors.relationshipTag) setErrors((p) => ({ ...p, relationshipTag: undefined }));
  };

  const handleEditParty = (role: 'donor' | 'donee') => {
    if (role === 'donor' && donor) { setDonorTinInput(donor.tin); setDonorLookupResult(donor); setDonorLookupError(''); setDonor(null); }
    else if (role === 'donee' && donee) { setDoneeTinInput(donee.tin); setDoneeLookupResult(donee); setDoneeLookupError(''); setDonee(null); }
    setAcknowledged(false); setStep('stages'); setStage(1);
  };

  const handleRemoveParty = (role: 'donor' | 'donee') => {
    setAcknowledged(false);
    if (role === 'donor' && donor) { setUndoParty({ role: 'donor', party: donor }); setDonor(null); setStep('stages'); setStage(1); }
    else if (role === 'donee' && donee) { setUndoParty({ role: 'donee', party: donee, relationship, relationshipTag }); setDonee(null); setStep('stages'); setStage(1); }
  };

  const handleUndoRemove = () => {
    if (!undoParty) return;
    const check = canUndoGiftPartyRemoval(undoParty, donor, donee);
    if (!check.ok) {
      if (check.reason === 'duplicate_tin') {
        const msg = isBn ? 'পূর্বাবস্থায় ফেরানো সম্ভব নয়: দাতা ও গ্রহীতার টিআইএন একই হতে পারবে না।' : 'Cannot undo: Donor and Donee cannot share the same 12-digit TIN.';
        setErrors((p) => ({ ...p, [undoParty.role]: msg }));
      }
      return;
    }
    if (undoParty.role === 'donor') setDonor(undoParty.party);
    else {
      setDonee(undoParty.party);
      if (undoParty.relationship) setRelationship(undoParty.relationship);
      if (undoParty.relationshipTag !== undefined) setRelationshipTag(undoParty.relationshipTag);
    }
    setUndoParty(null);
  };

  const runSubmission = (channel: ActivePaymentChannel | 'Zero-Tax') => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    if (!acknowledged) { setAckError(isBn ? 'নিশ্চিত করার আগে ঘোষণাটি অনুমোদন করুন।' : 'Please check the explicit acknowledgement box before confirming.'); return; }
    const partyErrs = validateGiftPartiesStep({ donor, donee, relationship, relationshipTag }, lang);
    if (Object.keys(partyErrs).length > 0 || !donor || !donee || !relationship) { setErrors(partyErrs); setStep('stages'); setStage(1); return; }
    const valErrs = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd());
    if (Object.keys(valErrs).length > 0) { setErrors(valErrs); setStep('stages'); setStage(2); return; }
    setAckError(''); setSubmitError('');
    executePaymentAttempt({
      lockRef: submitLockRef,
      fallbackError: isBn ? 'দানকর জমা ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Gift tax submission failed. Please review and retry.',
      run: () => addTransaction(buildGiftTransactionPayload({
        donor, donee: { ...donee, relationship, relationshipTag: relationship === 'Others' ? relationshipTag.trim() : relationship },
        relationship, relationshipTag, giftValue: calculation.giftAmount, giftDate, description, remarks,
        calculatedTax: calculation.calculatedTax, assessmentYear: seed.assessmentYear, channel, isAuthenticated, activeScope,
      })),
      onSuccess: (tx) => { setCompletedTx(tx); setShowReceipt(isAuthenticated); setStep('success'); },
      onError: setSubmitError,
    });
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    const cleanRel = relationship || undefined;
    const items = donor && donee && cleanRel && calculation.giftAmount > 0
      ? buildGiftTransactionPayload({ donor, donee, relationship: cleanRel, relationshipTag, giftValue: calculation.giftAmount, giftDate: giftDate || getDhakaTodayYmd(), description: description || 'Gift Tax Draft', remarks, calculatedTax: calculation.calculatedTax, assessmentYear: seed.assessmentYear, channel: calculation.calculatedTax === 0 ? 'Zero-Tax' : paymentChannel, isAuthenticated: true, activeScope }).items
      : [];
    saveDraft({
      title: `Gift Tax — ${donor?.name ?? (isBn ? 'দাতা' : 'Donor')} → ${donee?.name ?? (isBn ? 'গ্রহীতা' : 'Donee')}`,
      category: 'gift_tax', items,
      giftDraft: { donor, donee: donee ? { ...donee, relationship: cleanRel, relationshipTag } : null, relationship, relationshipTag, giftAmountInput, giftDate, description, remarks, creditAttributionRole: 'donor', throughTin: donee?.tin, throughName: donee?.name, onBehalfOfTin: donor?.tin, onBehalfOfName: donor?.name, stage },
    });
    navigate('/drafts');
  };

  const resetWalkIn = () => {
    rotateWalkInSessionId(); submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setCertOpen(false);
    setDonor(null); setDonee(null); setDonorTinInput(''); setDoneeTinInput(''); setDonorLookupResult(null); setDoneeLookupResult(null);
    setDonorLookupError(''); setDoneeLookupError(''); setRelationship(''); setRelationshipTag(''); setUndoParty(null);
    setGiftAmountInput(''); setGiftDate(''); setDescription(''); setRemarks(''); setAcknowledged(false); setAckError(''); setSubmitError(''); setErrors({}); setStage(1); setStep('stages');
  };

  return {
    lang, isBn, isAuthenticated, isDirty, seedRejected: seed.rejected, stage, setStage, step, setStep, donor, donee,
    donorTinInput, setDonorTinInput, doneeTinInput, setDoneeTinInput, donorLookupResult, setDonorLookupResult,
    doneeLookupResult, setDoneeLookupResult, donorLookupError, setDonorLookupError, doneeLookupError, setDoneeLookupError,
    relationship, relationshipTag, undoParty, giftAmountInput, setGiftAmountInput, giftDate, setGiftDate,
    description, setDescription, remarks, setRemarks, paymentChannel, setPaymentChannel,
    acknowledged, setAcknowledged, ackError, setAckError, submitError, errors, setErrors,
    calculation, hasValidatedEstimate, completedTx, showReceipt, setShowReceipt, certOpen, setCertOpen,
    handleSearchDonor: () => runPartyLookup('donor'), handleSearchDonee: () => runPartyLookup('donee'),
    handleAddDonor, handleAddDonee, handleSelectRelationship, handleChangeRelationshipTag, handleEditParty, handleRemoveParty, handleUndoRemove,
    handleProceedStage1: () => { const pe = validateGiftPartiesStep({ donor, donee, relationship, relationshipTag }, lang); if (Object.keys(pe).length > 0) { setErrors(pe); return; } setErrors({}); setStage(2); },
    handleProceedStage2: () => { const ve = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd()); if (Object.keys(ve).length > 0) { setErrors(ve); return; } setErrors({}); setAcknowledged(false); setAckError(''); setSubmitError(''); setStage(3); },
    handleProceedFromPreview: () => { if (calculation.calculatedTax === 0) runSubmission('Zero-Tax'); else { setAcknowledged(false); setAckError(''); setSubmitError(''); setStep('channel'); } },
    handleConfirmChannelPayment: () => runSubmission(paymentChannel),
    handleSaveDraft, resetWalkIn, goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
