import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { TAX_HEADS } from '../../shared/mockData';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import {
  calculateItemsTotal,
  INITIAL_ALL_TAX_ITEMS,
  validateAndBuildTaxItem,
} from './allTaxLogic';
import type { ActivePaymentChannel } from './paymentChannels';

export function useAllTaxPaymentFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, beneficiaries, addTransaction, saveDraft } = useApp();

  const [step, setStep] = useState<'chooser' | 'form' | 'preview' | 'success'>('chooser');
  const [selectedCategory, setSelectedCategory] = useState<TaxHeadCategory>('tax_with_return');
  const [assessmentYear, setAssessmentYear] = useState('2025-2026');
  const [selectedHeadId, setSelectedHeadId] = useState(TAX_HEADS[0].id);
  const [amountInput, setAmountInput] = useState<string>('15000');
  const [amountError, setAmountError] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');
  const [formBannerError, setFormBannerError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isForBeneficiary, setIsForBeneficiary] = useState(false);
  const [beneficiaryTin, setBeneficiaryTin] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<ActivePaymentChannel>('bKash');
  const [items, setItems] = useState<PaymentLineItem[]>(INITIAL_ALL_TAX_ITEMS);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const totalAmount = calculateItemsTotal(items);

  const handleAddItem = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const result = validateAndBuildTaxItem({ selectedHeadId, amountInput, assessmentYear, remarks });
    if (!result.ok) {
      if (result.reason === 'missing_head') return;
      setAmountError(
        result.reason === 'min' ? t('amountMinError', { amount: '100' }) : t('amountInvalidError')
      );
      return;
    }
    setAmountError('');
    setFormBannerError('');
    setItems((prev) => [...prev, result.item]);
    setAmountInput('10000');
    setRemarks('');
  };

  const handleRemoveItem = (index: number) => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToPreview = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    if (isForBeneficiary && !beneficiaryTin) {
      setBeneficiaryError(t('selectBeneficiaryError'));
      return;
    }
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
    const selectedBeneficiary = beneficiaries.find((b) => b.tin === beneficiaryTin);
    const tx = addTransaction({
      taxpayerTin: user.tin,
      taxpayerName: user.name,
      beneficiaryTin: isForBeneficiary ? beneficiaryTin : undefined,
      beneficiaryName: isForBeneficiary
        ? selectedBeneficiary?.name || 'Third-Party Beneficiary'
        : undefined,
      category: selectedCategory,
      items,
      totalAmount,
      paymentChannel,
      status: 'Completed',
    });
    setCompletedTx(tx);
    setStep('success');
  };

  const handleSaveDraft = () => {
    if (!isRestrictedOperationAllowed('draft_write')) return;
    saveDraft({
      title: `${selectedCategory === 'tax_with_return' ? 'Tax with Return' : 'Other Tax'} - AY ${assessmentYear}`,
      category: selectedCategory,
      items,
    });
    navigate('/dashboard');
  };

  const stepNumber = step === 'chooser' ? 1 : step === 'form' ? 2 : step === 'preview' ? 3 : 4;

  return {
    user,
    beneficiaries,
    step,
    stepNumber,
    setStep,
    selectedCategory,
    setSelectedCategory,
    assessmentYear,
    setAssessmentYear,
    selectedHeadId,
    setSelectedHeadId,
    amountInput,
    setAmountInput,
    amountError,
    setAmountError,
    beneficiaryError,
    setBeneficiaryError,
    formBannerError,
    remarks,
    setRemarks,
    isForBeneficiary,
    setIsForBeneficiary,
    beneficiaryTin,
    setBeneficiaryTin,
    paymentChannel,
    setPaymentChannel,
    items,
    totalAmount,
    completedTx,
    setCompletedTx,
    handleAddItem,
    handleRemoveItem,
    handleProceedToPreview,
    handleConfirmPayment,
    handleSaveDraft,
    goDashboard: () => navigate('/dashboard'),
  };
}
