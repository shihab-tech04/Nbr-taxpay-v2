import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentDraft, PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { getHeadsForCategory } from './allTaxCatalogue';
import {
  calculateItemsTotal,
  INITIAL_ALL_TAX_ITEMS,
  rankFrequentPaymentCategories,
  validateAndBuildTaxItem,
  validateCombinedLineAddition,
} from './allTaxLogic';
import type { SelectedTaxpayerEntry } from './components/AllTaxTaxpayerStep';
import type { ActivePaymentChannel } from './paymentChannels';

interface AllTaxRouteState {
  resumeDraft?: PaymentDraft;
  reuseTx?: PaymentTransaction;
}

function buildInitialTaxpayers(
  isAuthenticated: boolean,
  userTin: string,
  userName: string,
  state?: AllTaxRouteState | null
): SelectedTaxpayerEntry[] {
  const fromItems = (state?.resumeDraft?.items ?? state?.reuseTx?.items ?? [])
    .filter((i) => i.taxpayerTin)
    .map((i) => ({ tin: i.taxpayerTin!, name: i.taxpayerName ?? i.taxpayerTin!, source: 'one_time' as const }));
  if (fromItems.length > 0) {
    const unique = new Map<string, SelectedTaxpayerEntry>();
    fromItems.forEach((tp) => unique.set(tp.tin, tp));
    return [...unique.values()];
  }
  if (isAuthenticated && userTin) {
    return [{ tin: userTin, name: userName, source: 'self' }];
  }
  return [];
}

export function useAllTaxPaymentFlow() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state ?? null) as AllTaxRouteState | null;
  const { user, isAuthenticated, activeScope, beneficiaries, transactions, addTransaction, saveDraft } = useApp();

  const initialSeed = routeState?.resumeDraft ?? routeState?.reuseTx ?? null;
  const [step, setStep] = useState<'chooser' | 'taxpayer' | 'form' | 'preview' | 'success'>(initialSeed ? 'form' : 'chooser');
  const [selectedCategory, setSelectedCategory] = useState<TaxHeadCategory>(initialSeed?.category ?? 'tax_with_return');
  const [liabilityMode, setLiabilityMode] = useState<'own' | 'facilitation'>('own');
  const [selectedTaxpayers, setSelectedTaxpayers] = useState<SelectedTaxpayerEntry[]>(() =>
    buildInitialTaxpayers(isAuthenticated, user.tin, user.name, routeState)
  );
  const [selectedTaxpayerTin, setSelectedTaxpayerTin] = useState<string>(() => selectedTaxpayers[0]?.tin ?? '');
  const [assessmentYear, setAssessmentYear] = useState(initialSeed?.items[0]?.assessmentYear ?? '2025-2026');
  const [selectedHeadId, setSelectedHeadId] = useState(() => getHeadsForCategory(initialSeed?.category ?? 'tax_with_return')[0].id);
  const [amountInput, setAmountInput] = useState<string>('15000');
  const [amountError, setAmountError] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');
  const [formBannerError, setFormBannerError] = useState('');
  const [remarks, setRemarks] = useState(routeState?.resumeDraft?.remarks ?? '');
  const [isForBeneficiary, setIsForBeneficiary] = useState(Boolean(routeState?.resumeDraft?.beneficiaryTin || routeState?.reuseTx?.beneficiaryTin));
  const [beneficiaryTin, setBeneficiaryTin] = useState(routeState?.resumeDraft?.beneficiaryTin ?? routeState?.reuseTx?.beneficiaryTin ?? '');
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [items, setItems] = useState<PaymentLineItem[]>(() => initialSeed?.items ? [...initialSeed.items] : isAuthenticated ? INITIAL_ALL_TAX_ITEMS : []);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const frequentCategories = useMemo(() => rankFrequentPaymentCategories(transactions, isAuthenticated, 5), [transactions, isAuthenticated]);
  const totalAmount = calculateItemsTotal(items);

  const handleSelectCategory = (cat: TaxHeadCategory) => {
    setSelectedCategory(cat);
    const firstHead = getHeadsForCategory(cat)[0];
    if (firstHead) setSelectedHeadId(firstHead.id);
    if (selectedTaxpayers.length === 0 && isAuthenticated && user.tin) {
      setSelectedTaxpayers([{ tin: user.tin, name: user.name, source: 'self' }]);
      setSelectedTaxpayerTin(user.tin);
    }
    setStep('taxpayer');
  };

  const handleAddItem = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const activeTp = selectedTaxpayers.find((tp) => tp.tin === selectedTaxpayerTin) ?? selectedTaxpayers[0];
    const result = validateAndBuildTaxItem({
      selectedHeadId,
      amountInput,
      assessmentYear,
      remarks,
      taxpayerTin: activeTp?.tin,
      taxpayerName: activeTp?.name,
    });
    if (!result.ok) {
      if (result.reason !== 'missing_head') {
        setAmountError(result.reason === 'min' ? t('amountMinError', { amount: '100' }) : t('amountInvalidError'));
      }
      return;
    }
    const ruleCheck = validateCombinedLineAddition(items, result.item, activeTp?.tin || user.tin || 'WALKIN');
    if (!ruleCheck.ok) {
      const msg =
        ruleCheck.reason === 'duplicate_line'
          ? isBn ? 'একই করদাতা, কর খাত ও কর বর্ষ ইতিমধ্যে যুক্ত আছে।' : 'This taxpayer, tax head, and assessment year is already in your challan.'
          : ruleCheck.reason === 'return_single_ay_per_taxpayer'
          ? isBn ? 'একই করদাতার রিটার্নসহ করের জন্য কেবল ১টি কর বর্ষ অনুমোদিত।' : 'Tax with Return permits only one Assessment Year per taxpayer.'
          : isBn ? 'একই করদাতার জন্য রিটার্নসহ কর ও অন্যান্য খাত একসাথে যোগ করা যাবে না।' : 'Cannot mix Tax with Return and non-Return heads for the same taxpayer (allowed across different taxpayers).';
      setFormBannerError(msg);
      return;
    }
    setAmountError('');
    setFormBannerError('');
    setItems((prev) => [...prev, result.item]);
    setAmountInput('10000');
    setRemarks('');
  };

  const handleProceedToPreview = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    if (items.length === 0) {
      setFormBannerError(t('noItemsError'));
      return;
    }
    setBeneficiaryError('');
    setFormBannerError('');
    setStep('preview');
  };

  const handleConfirmPayment = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const primaryTp = selectedTaxpayers[0];
    const extraTp = selectedTaxpayers.find((tp) => tp.source === 'beneficiary');
    const tx = addTransaction({
      taxpayerTin: isAuthenticated ? user.tin : primaryTp?.tin ?? '',
      taxpayerName: isAuthenticated ? user.name : primaryTp?.name ?? 'Walk-In Taxpayer',
      ownerScope: activeScope,
      originMode: isAuthenticated ? 'signed_in' : 'walk_in',
      beneficiaryTin: extraTp?.tin ?? (isForBeneficiary ? beneficiaryTin : undefined),
      beneficiaryName: extraTp?.name ?? (isForBeneficiary ? beneficiaries.find((b) => b.tin === beneficiaryTin)?.name : undefined),
      category: selectedCategory,
      items,
      totalAmount,
      paymentChannel,
      status: 'Completed',
    });
    setCompletedTx(tx);
    setShowReceipt(isAuthenticated);
    setStep('success');
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write') || !isAuthenticated) return;
    saveDraft({
      title: `${selectedCategory.replace(/_/g, ' ')} - AY ${assessmentYear}`,
      category: selectedCategory,
      beneficiaryTin: beneficiaryTin || undefined,
      remarks: remarks || undefined,
      items,
    });
    navigate('/drafts');
  };

  const stepNumber = step === 'chooser' ? 1 : step === 'taxpayer' ? 2 : step === 'form' ? 3 : step === 'preview' ? 4 : 4;

  return {
    user, isAuthenticated, beneficiaries, frequentCategories, step, stepNumber, setStep,
    selectedCategory, handleSelectCategory, liabilityMode, setLiabilityMode,
    selectedTaxpayers, setSelectedTaxpayers, selectedTaxpayerTin, setSelectedTaxpayerTin,
    assessmentYear, setAssessmentYear, selectedHeadId, setSelectedHeadId,
    amountInput, setAmountInput, amountError, setAmountError, beneficiaryError, setBeneficiaryError,
    formBannerError, remarks, setRemarks, isForBeneficiary, setIsForBeneficiary,
    beneficiaryTin, setBeneficiaryTin, paymentChannel, setPaymentChannel, items, totalAmount,
    completedTx, showReceipt, setShowReceipt, handleAddItem,
    handleRemoveItem: (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx)),
    handleProceedToPreview, handleConfirmPayment, handleSaveDraft,
    resetWalkIn: () => { setCompletedTx(null); setShowReceipt(false); setItems([]); setStep('chooser'); },
    goDashboard: () => navigate(isAuthenticated ? '/dashboard' : '/'),
  };
}
