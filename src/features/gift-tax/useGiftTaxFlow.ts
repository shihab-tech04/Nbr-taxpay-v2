import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { ActivePaymentChannel } from '../../components/payments/paymentChannels';
import { getDhakaTodayYmd } from '../../design-system/forms';
import { rotateWalkInSessionId } from '../../shared/accountSession';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentTransaction } from '../../types/tax';
import { buildGiftTransactionPayload, resolveGiftTaxRouteSeed } from './giftTaxFlowUtils';
import { calculateGiftTaxAmount, lookupGiftTaxpayer, validateGiftPartiesStep, validateGiftValuationStep } from './giftTaxLogic';
import type { GiftFormErrors, GiftPartyRecord, GiftRelationship, GiftRouteState, RemovedPartyUndoState } from './giftTaxTypes';

export function useGiftTaxFlow() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, activeScope, beneficiaries, drafts, transactions, addTransaction, saveDraft } = useApp();

  const [seed] = useState(() =>
    resolveGiftTaxRouteSeed({
      routeState: (location.state ?? null) as GiftRouteState | null,
      draftIdParam: searchParams.get('draftId'),
      reuseRefParam: searchParams.get('reuseRef'),
      drafts, transactions, activeScope, isAuthenticated,
    })
  );

  const [stage, setStage] = useState<1 | 2 | 3 | 4>(seed.stage);
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
  const [errors, setErrors] = useState<GiftFormErrors>({});
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const submitLockRef = useRef(false);

  const calculation = calculateGiftTaxAmount(giftAmountInput);
  const valuationCurrentErrors = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd());
  const hasValidatedEstimate = Boolean(completedTx || (Object.keys(valuationCurrentErrors).length === 0 && calculation.calculatedTax > 0));
  const isDirty = Boolean(stage < 4 && (donor || donee || donorTinInput || doneeTinInput || giftAmountInput || description || giftDate || remarks));

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
    setErrors((p) => ({ ...p, donor: undefined }));
  };

  const handleAddDonee = () => {
    if (!doneeLookupResult || (donor && doneeLookupResult.tin === donor.tin)) return;
    setDonee({ ...doneeLookupResult, relationship: relationship || undefined, relationshipTag: relationshipTag.trim() || undefined });
    setDoneeLookupResult(null); setDoneeTinInput(''); setUndoParty(null);
    setErrors((p) => ({ ...p, donee: undefined }));
  };

  const handleSelectRelationship = (nextRel: GiftRelationship) => {
    const prevRel = relationship;
    setRelationship(nextRel);
    const nextTag = !relationshipTag.trim() || relationshipTag.trim() === prevRel ? nextRel : relationshipTag;
    setRelationshipTag(nextTag);
    if (donee) setDonee({ ...donee, relationship: nextRel, relationshipTag: nextTag.trim() });
    setErrors((p) => ({ ...p, relationship: undefined, relationshipTag: undefined }));
  };

  const handleChangeRelationshipTag = (nextTag: string) => {
    setRelationshipTag(nextTag);
    if (donee) setDonee({ ...donee, relationshipTag: nextTag.trim() });
    if (errors.relationshipTag) setErrors((p) => ({ ...p, relationshipTag: undefined }));
  };

  const handleEditParty = (role: 'donor' | 'donee') => {
    if (role === 'donor' && donor) { setDonorTinInput(donor.tin); setDonorLookupResult(donor); setDonorLookupError(''); }
    else if (role === 'donee' && donee) { setDoneeTinInput(donee.tin); setDoneeLookupResult(donee); setDoneeLookupError(''); }
    setStage(1);
  };

  const handleRemoveParty = (role: 'donor' | 'donee') => {
    if (role === 'donor' && donor) { setUndoParty({ role: 'donor', party: donor }); setDonor(null); setStage(1); }
    else if (role === 'donee' && donee) { setUndoParty({ role: 'donee', party: donee, relationship, relationshipTag }); setDonee(null); setStage(1); }
  };

  const handleUndoRemove = () => {
    if (!undoParty) return;
    if (undoParty.role === 'donor') setDonor(undoParty.party);
    else {
      setDonee(undoParty.party);
      if (undoParty.relationship) setRelationship(undoParty.relationship);
      if (undoParty.relationshipTag !== undefined) setRelationshipTag(undoParty.relationshipTag);
    }
    setUndoParty(null);
  };

  const handleProceedStage1 = () => {
    const partyErrs = validateGiftPartiesStep({ donor, donee, relationship, relationshipTag }, lang);
    if (Object.keys(partyErrs).length > 0) { setErrors(partyErrs); return; }
    if (donee && relationship) setDonee({ ...donee, relationship, relationshipTag: relationshipTag.trim() });
    setErrors({}); setStage(2);
  };

  const handleProceedStage2 = () => {
    const valErrs = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd());
    if (Object.keys(valErrs).length > 0) { setErrors(valErrs); return; }
    setErrors({}); setStage(3);
  };

  const handlePay = () => {
    if (!isRestrictedOperationAllowed('payment_submit') || submitLockRef.current) return;
    const partyErrs = validateGiftPartiesStep({ donor, donee, relationship, relationshipTag }, lang);
    if (Object.keys(partyErrs).length > 0 || !donor || !donee || !relationship) { setErrors(partyErrs); setStage(1); return; }
    const valErrs = validateGiftValuationStep({ giftAmountInput, description, giftDate, remarks }, lang, getDhakaTodayYmd());
    if (Object.keys(valErrs).length > 0 || calculation.calculatedTax <= 0) { setErrors(valErrs); setStage(2); return; }
    submitLockRef.current = true;
    const tx = addTransaction(buildGiftTransactionPayload({
      donor, donee: { ...donee, relationship, relationshipTag: relationshipTag.trim() }, relationship, relationshipTag,
      giftValue: calculation.giftAmount, giftDate, description, remarks, calculatedTax: calculation.calculatedTax,
      assessmentYear: seed.assessmentYear, channel: paymentChannel, isAuthenticated, activeScope,
    }));
    setCompletedTx(tx); setShowReceipt(isAuthenticated); setStage(4);
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    const items = donor && donee && relationship && calculation.calculatedTax > 0
      ? buildGiftTransactionPayload({ donor, donee, relationship, relationshipTag, giftValue: calculation.giftAmount, giftDate: giftDate || getDhakaTodayYmd(), description: description || 'Gift Tax Draft', remarks, calculatedTax: calculation.calculatedTax, assessmentYear: seed.assessmentYear, channel: paymentChannel, isAuthenticated: true, activeScope }).items
      : [];
    saveDraft({
      title: `Gift Tax — ${donor?.name ?? (isBn ? 'দাতা' : 'Donor')} → ${donee?.name ?? (isBn ? 'গ্রহীতা' : 'Donee')}`,
      category: 'gift_tax', items,
      giftDraft: { donor, donee: donee ? { ...donee, relationship: relationship || undefined, relationshipTag } : null, giftAmountInput, giftDate, description, remarks, stage: stage === 4 ? 3 : stage },
    });
    navigate('/drafts');
  };

  const resetWalkIn = () => {
    rotateWalkInSessionId(); submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setCertOpen(false);
    setDonor(null); setDonee(null); setDonorTinInput(''); setDoneeTinInput(''); setDonorLookupResult(null); setDoneeLookupResult(null);
    setDonorLookupError(''); setDoneeLookupError(''); setRelationship(''); setRelationshipTag(''); setUndoParty(null);
    setGiftAmountInput(''); setGiftDate(''); setDescription(''); setRemarks(''); setErrors({}); setStage(1);
  };

  return {
    lang, isBn, isAuthenticated, isDirty, seedRejected: seed.rejected, stage, setStage, donor, donee,
    donorTinInput, setDonorTinInput, doneeTinInput, setDoneeTinInput, donorLookupResult, setDonorLookupResult,
    doneeLookupResult, setDoneeLookupResult, donorLookupError, setDonorLookupError, doneeLookupError, setDoneeLookupError,
    relationship, relationshipTag, undoParty, giftAmountInput, setGiftAmountInput, giftDate, setGiftDate,
    description, setDescription, remarks, setRemarks, paymentChannel, setPaymentChannel, errors, setErrors,
    calculation, hasValidatedEstimate, completedTx, showReceipt, setShowReceipt, certOpen, setCertOpen,
    handleSearchDonor: () => runPartyLookup('donor'), handleSearchDonee: () => runPartyLookup('donee'),
    handleAddDonor, handleAddDonee, handleSelectRelationship, handleChangeRelationshipTag, handleEditParty, handleRemoveParty,
    handleUndoRemove, handleProceedStage1, handleProceedStage2, handlePay, handleSaveDraft, resetWalkIn,
    goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
