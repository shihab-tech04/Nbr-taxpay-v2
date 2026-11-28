import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { getHeadsForCategory } from './allTaxCatalogue';
import { resolveInitialAllTaxState, type AllTaxRouteState } from './allTaxFlowUtils';
import {
  calculateItemsTotal,
  rankFrequentPaymentCategories,
  reconcileItemsWithTaxpayers,
  validateAndBuildTaxItem,
  validateCombinedLineAddition,
} from './allTaxLogic';
import type { SelectedTaxpayerEntry } from './components/AllTaxTaxpayerStep';
import type { ActivePaymentChannel } from './paymentChannels';

export function useAllTaxPaymentFlow() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? null) as AllTaxRouteState | null;
  const { user, isAuthenticated, activeScope, beneficiaries, addBeneficiary, transactions, addTransaction, saveDraft } = useApp();

  const init = resolveInitialAllTaxState({
    routeState, activeScope, isAuthenticated, userTin: user.tin, userName: user.name, isBn,
  });

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
  const [remarks, setRemarks] = useState(routeState?.resumeDraft?.remarks ?? '');
  const [isForBeneficiary, setIsForBeneficiary] = useState(
    Boolean(routeState?.selectedBeneficiary || routeState?.resumeDraft?.beneficiaryTin || routeState?.reuseTx?.beneficiaryTin)
  );
  const [beneficiaryTin, setBeneficiaryTin] = useState(
    routeState?.selectedBeneficiary?.tin ?? routeState?.resumeDraft?.beneficiaryTin ?? routeState?.reuseTx?.beneficiaryTin ?? ''
  );
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [items, setItems] = useState<PaymentLineItem[]>(init.initialReconciled.validItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const submitLockRef = useRef(false);

  const frequentCategories = useMemo(() => rankFrequentPaymentCategories(transactions, isAuthenticated, 5), [transactions, isAuthenticated]);
  const totalAmount = calculateItemsTotal(items);

  const applyTaxpayerReconciliation = (nextTaxpayers: SelectedTaxpayerEntry[], nextMode: 'own' | 'facilitation') => {
    const rec = reconcileItemsWithTaxpayers(items, nextTaxpayers, nextMode);
    if (rec.removedCount > 0) {
      setItems(rec.validItems);
      setEditingIndex(null);
      setFormBannerError(isBn ? `করদাতা পরিবর্তনের ফলে ${rec.removedCount}টি অসঙ্গত খাত বাদ দেওয়া হয়েছে।` : `Removed ${rec.removedCount} allocation(s) belonging to deselected taxpayers.`);
    }
  };

  const setLiabilityMode = (mode: 'own' | 'facilitation') => {
    setLiabilityModeState(mode);
    const nextTaxpayers = mode === 'own' && isAuthenticated && user.tin ? [{ tin: user.tin, name: user.name, source: 'self' as const }] : selectedTaxpayers;
    if (mode === 'own' && isAuthenticated && user.tin) {
      setSelectedTaxpayersState(nextTaxpayers);
      setSelectedTaxpayerTin(user.tin);
    }
    applyTaxpayerReconciliation(nextTaxpayers, mode);
  };

  const setSelectedTaxpayers = (next: SelectedTaxpayerEntry[]) => {
    setSelectedTaxpayersState(next);
    if (next.length > 0 && !next.some((tp) => tp.tin === selectedTaxpayerTin)) setSelectedTaxpayerTin(next[0].tin);
    applyTaxpayerReconciliation(next, liabilityMode);
  };

  const handleSelectCategory = (cat: TaxHeadCategory) => {
    if (cat !== selectedCategory && items.length > 0 && cat !== 'other_tax') {
      const catMatches = items.filter((item) => item.category === cat);
      if (catMatches.length !== items.length) { setItems(catMatches); setEditingIndex(null); }
    }
    setSelectedCategory(cat);
    const firstHead = getHeadsForCategory(cat)[0];
    if (firstHead) setSelectedHeadId(firstHead.id);
    if (selectedTaxpayers.length === 0 && isAuthenticated && user.tin) {
      setSelectedTaxpayersState([{ tin: user.tin, name: user.name, source: 'self' }]);
      setSelectedTaxpayerTin(user.tin);
    }
    setStep('taxpayer');
  };

  const handleAddOrUpdateItem = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const activeTp = selectedTaxpayers.find((tp) => tp.tin === selectedTaxpayerTin) ?? selectedTaxpayers[0];
    const result = validateAndBuildTaxItem({ selectedHeadId, amountInput, assessmentYear, remarks, taxpayerTin: activeTp?.tin, taxpayerName: activeTp?.name });
    if (!result.ok) {
      if (result.reason !== 'missing_head') setAmountError(result.reason === 'min' ? t('amountMinError', { amount: '100' }) : t('amountInvalidError'));
      return;
    }
    const baseItems = editingIndex !== null ? items.filter((_, idx) => idx !== editingIndex) : items;
    const ruleCheck = validateCombinedLineAddition(baseItems, result.item, activeTp?.tin || user.tin || 'WALKIN');
    if (!ruleCheck.ok) {
      setFormBannerError(
        ruleCheck.reason === 'duplicate_line'
          ? (isBn ? 'একই করদাতা, কর খাত ও কর বর্ষ ইতিমধ্যে যুক্ত আছে।' : 'This taxpayer, tax head, and assessment year is already in your challan.')
          : ruleCheck.reason === 'return_single_ay_per_taxpayer'
          ? (isBn ? 'একই করদাতার রিটার্নসহ করের জন্য কেবল ১টি কর বর্ষ অনুমোদিত।' : 'Tax with Return permits only one Assessment Year per taxpayer.')
          : (isBn ? 'একই করদাতার জন্য রিটার্নসহ কর ও অন্যান্য খাত একসাথে যোগ করা যাবে না।' : 'Cannot mix Tax with Return and non-Return heads for the same taxpayer (allowed across different taxpayers).')
      );
      return;
    }
    setAmountError(''); setFormBannerError('');
    setItems(editingIndex !== null ? items.map((existing, idx) => (idx === editingIndex ? result.item : existing)) : [...items, result.item]);
    setEditingIndex(null); setAmountInput(''); setRemarks('');
  };

  const handleEditItem = (idx: number) => {
    const target = items[idx];
    if (!target) return;
    setEditingIndex(idx);
    if (target.taxpayerTin) setSelectedTaxpayerTin(target.taxpayerTin);
    setSelectedHeadId(target.headId); setAssessmentYear(target.assessmentYear);
    setAmountInput(String(target.amount)); setRemarks(target.remarks ?? '');
    setAmountError(''); setFormBannerError('');
  };

  const handleCancelEdit = () => { setEditingIndex(null); setAmountInput(''); setRemarks(''); setAmountError(''); setFormBannerError(''); };

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
    setBeneficiaryError(''); setFormBannerError(''); setStep('preview');
  };

  const handleConfirmPayment = () => {
    if (!isRestrictedOperationAllowed('payment_submit') || submitLockRef.current) return;
    const rec = reconcileItemsWithTaxpayers(items, selectedTaxpayers, liabilityMode);
    if (rec.removedCount > 0 || rec.validItems.length === 0) { setItems(rec.validItems); setStep('form'); setFormBannerError(isBn ? 'জমা দেওয়ার আগে অসঙ্গত খাত বাদ দেওয়া হয়েছে।' : 'Orphan allocations rejected before submission.'); return; }
    submitLockRef.current = true;
    const primaryTp = selectedTaxpayers[0];
    const extraTp = selectedTaxpayers.find((tp) => tp.source === 'beneficiary');
    const tx = addTransaction({
      taxpayerTin: isAuthenticated ? user.tin : primaryTp?.tin ?? '', taxpayerName: isAuthenticated ? user.name : primaryTp?.name ?? 'Walk-In Taxpayer',
      ownerScope: activeScope, originMode: isAuthenticated ? 'signed_in' : 'walk_in',
      beneficiaryTin: extraTp?.tin ?? (isForBeneficiary ? beneficiaryTin : undefined),
      beneficiaryName: extraTp?.name ?? (isForBeneficiary ? beneficiaries.find((b) => b.tin === beneficiaryTin)?.name : undefined),
      category: selectedCategory, items: rec.validItems, totalAmount: calculateItemsTotal(rec.validItems), paymentChannel, status: 'Completed',
    });
    setCompletedTx(tx); setShowReceipt(isAuthenticated); setStep('success');
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    saveDraft({ title: `${selectedCategory.replace(/_/g, ' ')} - AY ${assessmentYear}`, category: selectedCategory, beneficiaryTin: beneficiaryTin || undefined, remarks: remarks || undefined, items });
    navigate('/drafts');
  };

  const stepNumber = step === 'chooser' || step === 'taxpayer' ? 1 : step === 'form' ? 2 : step === 'preview' ? 3 : step === 'channel' ? 4 : 5;
  return {
    user, isAuthenticated, beneficiaries, addBeneficiary, frequentCategories, step, stepNumber, setStep,
    selectedCategory, handleSelectCategory, liabilityMode, setLiabilityMode, selectedTaxpayers, setSelectedTaxpayers,
    selectedTaxpayerTin, setSelectedTaxpayerTin, assessmentYear, setAssessmentYear, selectedHeadId, setSelectedHeadId,
    amountInput, setAmountInput, amountError, setAmountError, beneficiaryError, setBeneficiaryError, formBannerError,
    remarks, setRemarks, isForBeneficiary, setIsForBeneficiary, beneficiaryTin, setBeneficiaryTin, paymentChannel, setPaymentChannel,
    items, editingIndex, totalAmount, completedTx, showReceipt, setShowReceipt,
    handleAddItem: handleAddOrUpdateItem, handleEditItem, handleCancelEdit, handleRemoveItem,
    handleProceedToPreview, handleConfirmPayment, handleSaveDraft,
    resetWalkIn: () => { submitLockRef.current = false; setCompletedTx(null); setShowReceipt(false); setItems([]); setAmountInput(''); setRemarks(''); setEditingIndex(null); setStep('chooser'); },
    goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
