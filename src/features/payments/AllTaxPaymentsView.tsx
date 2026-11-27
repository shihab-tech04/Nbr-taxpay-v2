import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { TAX_HEADS } from '../../shared/mockData';
import { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { 
  Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle 
} from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import {
  AppSelectField,
  AppCurrencyField,
  AppTextField,
  validateCurrencyAmount,
} from '../../design-system/forms';

export const AllTaxPaymentsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, beneficiaries, addTransaction, saveDraft } = useApp();

  const [step, setStep] = useState<'chooser' | 'form' | 'preview' | 'success'>('chooser');
  const [selectedCategory, setSelectedCategory] = useState<TaxHeadCategory>('tax_with_return');
  const [assessmentYear, setAssessmentYear] = useState('2025-2026');
  const [selectedHeadId, setSelectedHeadId] = useState(TAX_HEADS[0].id);
  const [amountInput, setAmountInput] = useState<string>('15000');
  const [amountError, setAmountError] = useState<string>('');
  const [beneficiaryError, setBeneficiaryError] = useState<string>('');
  const [formBannerError, setFormBannerError] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const [isForBeneficiary, setIsForBeneficiary] = useState(false);
  const [beneficiaryTin, setBeneficiaryTin] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Visa/Mastercard' | 'CityBank'>('bKash');

  const [items, setItems] = useState<PaymentLineItem[]>([
    {
      headId: TAX_HEADS[0].id,
      headCode: TAX_HEADS[0].code,
      headNameEn: TAX_HEADS[0].nameEn,
      headNameBn: TAX_HEADS[0].nameBn,
      assessmentYear: '2025-2026',
      amount: 15000,
      remarks: 'Annual return submission'
    }
  ]);

  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const handleAddItem = () => {
    const head = TAX_HEADS.find(h => h.id === selectedHeadId);
    const amountCheck = validateCurrencyAmount(amountInput, {
      minAmount: 100,
      decimalScale: 2,
      required: true,
    });

    if (!amountCheck.valid || amountCheck.numericValue === null) {
      setAmountError(
        amountCheck.reason === 'min' || amountCheck.reason === 'required'
          ? t('amountMinError', { amount: '100' })
          : t('amountInvalidError')
      );
      return;
    }

    if (!head) return;

    const validatedAmount = amountCheck.numericValue;
    setAmountError('');
    setFormBannerError('');
    setItems(prev => [
      ...prev,
      {
        headId: head.id,
        headCode: head.code,
        headNameEn: head.nameEn,
        headNameBn: head.nameBn,
        assessmentYear,
        amount: validatedAmount,
        remarks
      }
    ]);
    setAmountInput('10000');
    setRemarks('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

  const handleProceedToPreview = () => {
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
    const selectedBeneficiary = beneficiaries.find(b => b.tin === beneficiaryTin);
    const tx = addTransaction({
      taxpayerTin: user.tin,
      taxpayerName: user.name,
      beneficiaryTin: isForBeneficiary ? beneficiaryTin : undefined,
      beneficiaryName: isForBeneficiary ? selectedBeneficiary?.name || 'Third-Party Beneficiary' : undefined,
      category: selectedCategory,
      items,
      totalAmount,
      paymentChannel,
      status: 'Completed'
    });
    setCompletedTx(tx);
    setStep('success');
  };

  const handleSaveDraft = () => {
    saveDraft({
      title: `${selectedCategory === 'tax_with_return' ? 'Tax with Return' : 'Other Tax'} - AY ${assessmentYear}`,
      category: selectedCategory,
      items
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">All Tax Payments (সকল কর প্রদান)</h1>
            <p className="text-xs text-slate-500">File Income Tax with Return, Advance Tax, or Other Tax Heads</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span>Step {step === 'chooser' ? 1 : step === 'form' ? 2 : step === 'preview' ? 3 : 4} of 4</span>
          </div>
        </div>

        {step === 'chooser' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Select Tax Payment Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => { setSelectedCategory('tax_with_return'); setStep('form'); }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedCategory === 'tax_with_return' ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold mb-4">01</div>
                <h4 className="font-bold text-lg mb-2">{t('taxWithReturn')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mandatory annual tax submission along with your income tax return for individuals and companies.
                </p>
              </div>

              <div 
                onClick={() => { setSelectedCategory('other_tax'); setStep('form'); }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedCategory === 'other_tax' ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold mb-4">02</div>
                <h4 className="font-bold text-lg mb-2">{t('otherTax')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Advance Income Tax (AIT), Source Tax (TDS), Capital Gains, and property transfer tax heads.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold">Configure Tax Line Items</h3>
              <button 
                onClick={() => setStep('chooser')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Change Category
              </button>
            </div>

            {formBannerError && (
              <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                {formBannerError}
              </div>
            )}

            {/* Payer vs Beneficiary Selection */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input 
                  type="checkbox" 
                  checked={isForBeneficiary} 
                  onChange={e => {
                    setIsForBeneficiary(e.target.checked);
                    if (!e.target.checked) setBeneficiaryError('');
                  }}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600" 
                />
                <span>Facilitate payment on behalf of a beneficiary (Family member / Client)</span>
              </label>

              {isForBeneficiary && (
                <div className="pt-2">
                  <AppSelectField
                    label={t('selectBeneficiary')}
                    value={beneficiaryTin}
                    onChange={e => {
                      setBeneficiaryTin(e.target.value);
                      if (beneficiaryError) setBeneficiaryError('');
                    }}
                    error={Boolean(beneficiaryError)}
                    helperText={beneficiaryError || t('selectBeneficiaryHelper')}
                    options={[
                      { value: '', label: t('selectBeneficiaryOption') },
                      ...beneficiaries.map(b => ({
                        value: b.tin,
                        label: `${b.name} (TIN: ${b.tin} - ${b.relationship})`
                      }))
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Assessment Year & Head selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AppSelectField
                  label={t('assessmentYear')}
                  value={assessmentYear}
                  onChange={e => setAssessmentYear(e.target.value)}
                  helperText={t('assessmentYearHelper')}
                  options={[
                    { value: '2025-2026', label: '2025-2026' },
                    { value: '2026-2027', label: '2026-2027' },
                    { value: '2024-2025', label: '2024-2025' }
                  ]}
                />
              </div>

              <div>
                <AppSelectField
                  label={t('taxHead')}
                  value={selectedHeadId}
                  onChange={e => setSelectedHeadId(e.target.value)}
                  helperText={t('taxHeadHelper')}
                  options={TAX_HEADS
                    .filter(h => h.category === selectedCategory || selectedCategory === 'other_tax')
                    .map(h => ({
                      value: h.id,
                      label: `[${h.code}] ${i18n.language === 'bn' ? h.nameBn : h.nameEn}`
                    }))}
                />
              </div>

              <div>
                <AppCurrencyField
                  label={t('amountBdt')}
                  value={amountInput}
                  minAmount={100}
                  decimalScale={2}
                  onChange={e => {
                    setAmountInput(e.target.value);
                    if (amountError) setAmountError('');
                  }}
                  error={Boolean(amountError)}
                  helperText={amountError || t('amountMinHelper', { amount: '100' })}
                  required
                />
              </div>

              <div>
                <AppTextField
                  label={t('remarksOptional')}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={t('remarksPlaceholder')}
                  helperText={t('remarksHelper')}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} /> {t('addHead')}
            </button>

            {/* Current Items Table */}
            {items.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Configured Line Items ({items.length})</h4>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-3">Tax Head</th>
                        <th className="p-3">AY</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="font-medium">{item.headNameEn}</div>
                            <div className="text-[11px] text-slate-500 font-mono">Code: {item.headCode}</div>
                          </td>
                          <td className="p-3 font-mono">{item.assessmentYear}</td>
                          <td className="p-3 text-right font-mono font-semibold">৳ {item.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleRemoveItem(idx)} className="text-rose-600 hover:text-rose-800">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold">
                      <tr>
                        <td colSpan={2} className="p-3 text-right">{t('totalPayable')}:</td>
                        <td className="p-3 text-right font-mono text-teal-700 text-sm">৳ {totalAmount.toLocaleString()}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSaveDraft}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('saveDraft')}
              </button>
              <button
                onClick={handleProceedToPreview}
                className="w-2/3 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {t('proceedToPreview')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Final Payment Preview & Gateway Selection</h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Taxpayer TIN:</span>
                <strong className="font-mono">{user.tin} ({user.name})</strong>
              </div>
              {isForBeneficiary && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary TIN:</span>
                  <strong className="font-mono">{beneficiaryTin}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="capitalize font-semibold">{selectedCategory.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Channel Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Select Payment Gateway / Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(['bKash', 'Nagad', 'Rocket', 'Visa/Mastercard', 'CityBank'] as const).map(channel => (
                  <div
                    key={channel}
                    onClick={() => setPaymentChannel(channel)}
                    className={`p-4 rounded-xl border-2 cursor-pointer text-center font-semibold text-xs transition-all ${paymentChannel === channel ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200' : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'}`}
                  >
                    {channel}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Total Amount to Settle</span>
                <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-100">৳ {totalAmount.toLocaleString()}</div>
              </div>
              <ShieldCheck className="text-emerald-600" size={32} />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('form')}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('back')}
              </button>
              <button
                onClick={handleConfirmPayment}
                className="w-2/3 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                {t('confirmPayment')} <CheckCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'success' && completedTx && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('paymentSuccess')}</h2>
              <p className="text-xs text-slate-500">Challan successfully generated and verified via NBR gateway.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <strong>{completedTx.transactionRef}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Challan Number:</span>
                <strong>{completedTx.challanNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Ref:</span>
                <strong>{completedTx.bankRef}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <strong className="text-teal-700">৳ {completedTx.totalAmount.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCompletedTx(completedTx)}
                className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                View Official Receipt
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal
        open={Boolean(completedTx && step === 'success')}
        onClose={() => navigate('/dashboard')}
        transaction={completedTx}
      />
    </div>
  );
};
