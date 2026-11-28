import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { executePaymentAttempt } from '../../components/payments/paymentSubmission';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { getHeadsForCategory } from './allTaxCatalogue';
import { resolveInitialAllTaxState, type AllTaxRouteState } from './allTaxFlowUtils';
import {
  calculateItemsTotal, rankFrequentPaymentCategories, reconcileItemsWithTaxpayers,
  resolveAllTaxPayerAndRecipients, validateAndBuildTaxItem, validateCombinedLineAddition,
} from './allTaxLogic';
import type { SelectedTaxpayerEntry } from './components/AllTaxTaxpayerStep';
import type { ActivePaymentChannel } from './paymentChannels';

export function useAllTaxPaymentFlow() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeState = (location.state ?? null) as AllTaxRouteState | null;
  const { user, isAuthenticated, activeScope, beneficiaries, addBeneficiary, drafts, transactions, addTransaction, saveDraft } = useApp();

  const [init] = useState(() =>
    resolveInitialAllTaxState({
      routeState, draftIdParam: searchParams.get('draftId'), reuseRefParam: searchParams.get('reuseRef'),
      beneficiaryIdParam: searchParams.get('beneficiaryId'), drafts, transactions, beneficiaries,
      activeScope, isAuthenticated, userTin: user.tin, userName: user.name, isBn,
    })
  );

  const [step, setStep] = useState<'chooser' | 'taxpayer' | 'form' | 'preview' | 'channel' | 'success'>(init.initialStep);
  const [selectedCategory, setSelectedCategory] = useState<TaxHeadCategory>(init.initialSeed?.category ?? 'tax_with_return');
  const [liabilityMode, setLiabilityModeState] = useState<'own' | 'facilitation'>(init.initialMode);
  const [selectedTaxpayers, setSelectedTaxpayersState] = useState<SelectedTaxpayerEntry[]>(init.initialTaxpayers);
  const [selectedTaxpayerTin, setSelectedTaxpayerTin] = useState<string>(() => init.initialTaxpayers[0]?.tin ?? '');
  const [assessmentYear, setAssessmentYear] = useState(init.initialReconciled.validItems[0]?.assessmentYear ?? '2025-2026');
  const [selectedHeadId, setSelectedHeadId] = useState(() => getHeadsForCategory(init.initialSeed?.category ?? 'tax_with_return')[0].id);
  const [amountInput, setAmountInput] = useState('');
  const [amountError, setAmountError] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');
  const [formBannerError, setFormBannerError] = useState(init.initialBanner);
  const [submitError, setSubmitError] = useState('');
  const [remarks, setRemarks] = useState(init.resolvedDraft?.remarks ?? '');
  const [isForBeneficiary, setIsForBeneficiary] = useState(Boolean(init.resolvedBeneficiary || init.resolvedDraft?.beneficiaryTin || init.resolvedTx?.beneficiaryTin));
  const [beneficiaryTin, setBeneficiaryTin] = useState(init.resolvedBeneficiary?.tin ?? init.resolvedDraft?.beneficiaryTin ?? init.resolvedTx?.beneficiaryTin ?? '');
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [items, setItems] = useState<PaymentLineItem[]>(init.initialReconciled.validItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const submitLockRef = useRef(false);

  const frequentCategories = useMemo(() => rankFrequentPaymentCategories(transactions, isAuthenticated, 5), [transactions, isAuthenticated]);
  const totalAmount = calculateItemsTotal(items);
  const hasValidatedTotal = Boolean(completedTx || (items.length > 0 && editingIndex === null && reconcileItemsWithTaxpayers(items, selectedTaxpayers, liabilityMode).removedCount === 0));
  const payerAndRecipients = useMemo(() => resolveAllTaxPayerAndRecipients({
    isAuthenticated, userTin: user.tin, userName: user.name, selectedTaxpayers, items,
    legacyBeneficiaryTin: isForBeneficiary ? beneficiaryTin : undefined,
    legacyBeneficiaryName: isForBeneficiary ? beneficiaries.find((b) => b.tin === beneficiaryTin)?.name : undefined,
  }), [beneficiaries, beneficiaryTin, isAuthenticated, isForBeneficiary, items, selectedTaxpayers, user.name, user.tin]);

  const handleCancelEdit = () => { setEditingIndex(null); setAmountInput(''); setRemarks(''); setAmountError(''); setFormBannerError(''); };

  const applyTaxpayerReconciliation = (nextTaxpayers: SelectedTaxpayerEntry[], nextMode: 'own' | 'facilitation') => {
    const rec = reconcileItemsWithTaxpayers(items, nextTaxpayers, nextMode);
    if (rec.removedCount > 0) {
      setItems(rec.validItems);
      handleCancelEdit();
      setFormBannerError(isBn ? `করদাতা পরিবর্তনের ফলে ${rec.removedCount}টি অসঙ্গত খাত বাদ দেওয়া হয়েছে।` : `Removed ${rec.removedCount} allocation(s) belonging to deselected taxpayers.`);
    }
  };

  const setLiabilityMode = (mode: 'own' | 'facilitation') => {
    setLiabilityModeState(mode);
    const nextTaxpayers = mode === 'own' && isAuthenticated && user.tin ? [{ tin: user.tin, name: user.name, source: 'self' as const }] : mode === 'own' ? selectedTaxpayers.slice(0, 1) : selectedTaxpayers;
    setSelectedTaxpayersState(nextTaxpayers);
    if (nextTaxpayers.length > 0 && !nextTaxpayers.some((tp) => tp.tin === selectedTaxpayerTin)) setSelectedTaxpayerTin(nextTaxpayers[0].tin);
    applyTaxpayerReconciliation(nextTaxpayers, mode);
  };

  const setSelectedTaxpayers = (next: SelectedTaxpayerEntry[]) => {
    setSelectedTaxpayersState(next);
    if (next.length > 0 && !next.some((tp) => tp.tin === selectedTaxpayerTin)) setSelectedTaxpayerTin(next[0].tin);
    applyTaxpayerReconciliation(next, liabilityMode);
  };

  const handleSelectCategory = (cat: TaxHeadCategory) => {
    setSelectedCategory(cat);
    const firstHead = getHeadsForCategory(cat)[0];
    if (firstHead) setSelectedHeadId(firstHead.id);
    if (selectedTaxpayers.length === 0 && isAuthenticated && user.tin) { setSelectedTaxpayersState([{ tin: user.tin, name: user.name, source: 'self' }]); setSelectedTaxpayerTin(user.tin); }
    setStep('taxpayer');
  };

  const handleAddOrUpdateItem = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const activeTp = selectedTaxpayers.find((tp) => tp.tin === selectedTaxpayerTin) ?? selectedTaxpayers[0];
    const result = validateAndBuildTaxItem({ selectedHeadId, amountInput, assessmentYear, remarks, taxpayerTin: activeTp?.tin, taxpayerName: activeTp?.name });
    if (!result.ok) {
      if (result.reason === 'missing_taxpayer') setFormBannerError(isBn ? 'অনুগ্রহ করে বৈধ করদাতা নির্বাচন করুন।' : 'Select a valid taxpayer before adding an allocation.');
      else if (result.reason !== 'missing_head') setAmountError(result.reason === 'min' ? t('amountMinError', { amount: '100' }) : t('amountInvalidError'));
      return;
    }
    const baseItems = editingIndex !== null ? items.filter((_, idx) => idx !== editingIndex) : items;
    const ruleCheck = validateCombinedLineAddition(baseItems, result.item, activeTp?.tin || user.tin || 'WALKIN');
    if (!ruleCheck.ok) {
      setFormBannerError(
        ruleCheck.reason === 'duplicate_line' ? (isBn ? 'একই করদাতা, কর খাত ও কর বর্ষ ইতিমধ্যে যুক্ত আছে।' : 'This taxpayer, tax head, and assessment year is already in your challan.')
          : ruleCheck.reason === 'return_single_ay_per_taxpayer' ? (isBn ? 'একই করদাতার রিটার্নসহ করের জন্য কেবল ১টি কর বর্ষ অনুমোদিত।' : 'Tax with Return permits only one Assessment Year per taxpayer.')
          : (isBn ? 'একই করদাতার জন্য রিটার্নসহ কর ও অন্যান্য খাত একসাথে যোগ করা যাবে না।' : 'Cannot mix Tax with Return and non-Return heads for the same taxpayer (allowed across different taxpayers).')
      );
      return;
    }
    setAmountError(''); setFormBannerError('');
    setItems(editingIndex !== null ? items.map((existing, idx) => (idx === editingIndex ? result.item : existing)) : [...items, result.item]);
    setEditingIndex(null); setAmountInput(''); setRemarks('');
  };

  const handleEditItem = (idx: number) => {
    const target = items[idx]; if (!target) return;
    setEditingIndex(idx); if (target.taxpayerTin) setSelectedTaxpayerTin(target.taxpayerTin);
    setSelectedHeadId(target.headId); setAssessmentYear(target.assessmentYear);
    setAmountInput(String(target.amount)); setRemarks(target.remarks ?? ''); setAmountError(''); setFormBannerError('');
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) handleCancelEdit();
    else if (editingIndex !== null && idx < editingIndex) setEditingIndex(editingIndex - 1);
  };

  const handleProceedToPreview = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const rec = reconcileItemsWithTaxpayers(items, selectedTaxpayers, liabilityMode);
    if (rec.removedCount > 0) { setItems(rec.validItems); setFormBannerError(isBn ? 'অসঙ্গত করদাতার খাত বাদ দেওয়া হয়েছে।' : 'Orphan taxpayer allocations were removed.'); return; }
    if (rec.validItems.length === 0) { setFormBannerError(t('noItemsError')); return; }
    setBeneficiaryError(''); setFormBannerError(''); setSubmitError(''); setStep('preview');
  };

  const handleConfirmPayment = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const rec = reconcileItemsWithTaxpayers(items, selectedTaxpayers, liabilityMode);
    if (rec.removedCount > 0 || rec.validItems.length === 0) { setItems(rec.validItems); setStep('form'); setFormBannerError(isBn ? 'জমা দেওয়ার আগে অসঙ্গত খাত বাদ দেওয়া হয়েছে।' : 'Orphan allocations rejected before submission.'); return; }
    setSubmitError('');
    executePaymentAttempt({
      lockRef: submitLockRef,
      fallbackError: isBn ? 'পেমেন্ট জমা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Payment submission failed. Please try again.',
      run: () => addTransaction({
        taxpayerTin: payerAndRecipients.payerTin, taxpayerName: payerAndRecipients.payerName,
        ownerScope: activeScope, originMode: isAuthenticated ? 'signed_in' : 'walk_in',
        beneficiaryTin: payerAndRecipients.beneficiaryTin, beneficiaryName: payerAndRecipients.beneficiaryName,
        category: selectedCategory, items: rec.validItems, totalAmount: calculateItemsTotal(rec.validItems), paymentChannel, status: 'Completed',
      }),
      onSuccess: (tx) => { setCompletedTx(tx); setShowReceipt(isAuthenticated); setStep('success'); },
      onError: setSubmitError,
    });
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    saveDraft({ title: `${selectedCategory.replace(/_/g, ' ')} - AY ${assessmentYear}`, category: selectedCategory, beneficiaryTin: payerAndRecipients.beneficiaryTin, remarks: remarks || undefined, items });
    navigate('/drafts');
  };

  const stepNumber = step === 'chooser' || step === 'taxpayer' ? 1 : step === 'form' ? 2 : step === 'preview' ? 3 : step === 'channel' ? 4 : 5;
  return {
    user, isAuthenticated, beneficiaries, addBeneficiary, frequentCategories, step, stepNumber, setStep,
    selectedCategory, handleSelectCategory, liabilityMode, setLiabilityMode, selectedTaxpayers, setSelectedTaxpayers,
    selectedTaxpayerTin, setSelectedTaxpayerTin, assessmentYear, setAssessmentYear, selectedHeadId, setSelectedHeadId,
    amountInput, setAmountInput, amountError, setAmountError, beneficiaryError, setBeneficiaryError, formBannerError, submitError,
    remarks, setRemarks, isForBeneficiary, setIsForBeneficiary, beneficiaryTin, setBeneficiaryTin, paymentChannel, setPaymentChannel,
    items, editingIndex, totalAmount, hasValidatedTotal, payerAndRecipients, completedTx, showReceipt, setShowReceipt,
    handleAddItem: handleAddOrUpdateItem, handleEditItem, handleCancelEdit, handleRemoveItem,
    handleProceedToPreview, handleConfirmPayment, handleSaveDraft,
    resetWalkIn: () => { submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setSubmitError(''); setItems([]); setAmountInput(''); setRemarks(''); setEditingIndex(null); setStep('chooser'); },
    goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
