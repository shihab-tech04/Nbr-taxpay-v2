import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { Gift, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import {
  AppNumberField,
  AppTextField,
  AppSelectField,
  AppCurrencyField,
  AppTextArea,
  parseCurrencyAmount,
  validateCurrencyAmount,
  validateTin,
} from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';

export const GiftTaxView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, addTransaction } = useApp();

  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [donorTin, setDonorTin] = useState(user.tin);
  const [donorName, setDonorName] = useState(user.name);
  const [doneeTin, setDoneeTin] = useState('992384102938');
  const [doneeName, setDoneeName] = useState('Mrs. Fatema Begum');
  const [relationship, setRelationship] = useState('Mother');

  const [giftAmountInput, setGiftAmountInput] = useState<string>('500000');
  const [description, setDescription] = useState('Residential land transfer as family gift');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [errors, setErrors] = useState<{
    donorTin?: string;
    donorName?: string;
    doneeTin?: string;
    doneeName?: string;
    giftAmount?: string;
    description?: string;
  }>({});

  const giftAmount = parseCurrencyAmount(giftAmountInput) ?? 0;
  const taxRate = 0.05; // 5% standard gift tax for non-exempt
  const calculatedTax = Math.round(giftAmount * taxRate);

  const handleNext = () => {
    if (stage === 1) {
      const nextErrors: typeof errors = {};
      if (!validateTin(donorTin).valid) {
        nextErrors.donorTin = t('invalidTinError');
      }
      if (!donorName.trim()) {
        nextErrors.donorName = t('requiredDonorNameError');
      }
      if (!validateTin(doneeTin).valid) {
        nextErrors.doneeTin = t('invalidTinError');
      }
      if (!doneeName.trim()) {
        nextErrors.doneeName = t('requiredDoneeNameError');
      }
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
      setErrors({});
      setStage(2);
    } else if (stage === 2) {
      const nextErrors: typeof errors = {};
      const amountCheck = validateCurrencyAmount(giftAmountInput, {
        minAmount: 1000,
        decimalScale: 2,
        required: true,
      });
      if (!amountCheck.valid) {
        nextErrors.giftAmount =
          amountCheck.reason === 'min' || amountCheck.reason === 'required'
            ? t('amountMinError', { amount: '1,000' })
            : t('amountInvalidError');
      }
      if (!description.trim()) {
        nextErrors.description = t('requiredGiftDescriptionError');
      }
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
      setErrors({});
      setStage(3);
    }
  };

  const handlePay = () => {
    const tx = addTransaction({
      taxpayerTin: donorTin,
      taxpayerName: donorName,
      beneficiaryTin: doneeTin,
      beneficiaryName: doneeName,
      category: 'gift_tax',
      items: [
        {
          headId: 'h6',
          headCode: '0130',
          headNameEn: `Gift Tax (দানকর) - Donee: ${doneeName} (${relationship})`,
          headNameBn: `দানকর - ${doneeName}`,
          assessmentYear: '2025-2026',
          amount: calculatedTax,
          remarks: description
        }
      ],
      totalAmount: calculatedTax,
      paymentChannel: 'bKash',
      status: 'Completed'
    });
    setCompletedTx(tx);
    setStage(4);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="text-teal-700" size={28} /> {t('giftTax')}
            </h1>
            <p className="text-xs text-slate-500">4-Stage structured gift tax declaration and payment with donor/donee mapping.</p>
          </div>
          <div className="text-xs font-semibold text-teal-700 font-mono">
            Stage {stage} of 4
          </div>
        </div>

        {stage === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Stage 1: Donor & Donee Information</h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Donor (Payer & Credit Receiver)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AppNumberField
                      label={t('giftDonorTin')}
                      maxLength={12}
                      value={donorTin}
                      onChange={e => {
                        setDonorTin(e.target.value);
                        if (errors.donorTin) setErrors(prev => ({ ...prev, donorTin: undefined }));
                      }}
                      placeholder={t('tinPlaceholder')}
                      error={Boolean(errors.donorTin)}
                      helperText={errors.donorTin || t('tinHelperText')}
                      required
                    />
                  </div>
                  <div>
                    <AppTextField
                      label={t('donorName')}
                      value={donorName}
                      onChange={e => {
                        setDonorName(e.target.value);
                        if (errors.donorName) setErrors(prev => ({ ...prev, donorName: undefined }));
                      }}
                      placeholder={t('donorNamePlaceholder')}
                      error={Boolean(errors.donorName)}
                      helperText={errors.donorName || t('donorNameHelper')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Donee (Recipient)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <AppNumberField
                      label={t('giftDoneeTin')}
                      maxLength={12}
                      value={doneeTin}
                      onChange={e => {
                        setDoneeTin(e.target.value);
                        if (errors.doneeTin) setErrors(prev => ({ ...prev, doneeTin: undefined }));
                      }}
                      placeholder={t('tinPlaceholder')}
                      error={Boolean(errors.doneeTin)}
                      helperText={errors.doneeTin || t('tinHelperText')}
                      required
                    />
                  </div>
                  <div>
                    <AppTextField
                      label={t('doneeName')}
                      value={doneeName}
                      onChange={e => {
                        setDoneeName(e.target.value);
                        if (errors.doneeName) setErrors(prev => ({ ...prev, doneeName: undefined }));
                      }}
                      placeholder={t('doneeNamePlaceholder')}
                      error={Boolean(errors.doneeName)}
                      helperText={errors.doneeName || t('doneeNameHelper')}
                      required
                    />
                  </div>
                  <div>
                    <AppSelectField
                      label={t('relationship')}
                      value={relationship}
                      onChange={e => setRelationship(e.target.value)}
                      helperText={t('relationshipHelper')}
                      options={[
                        { value: 'Father', label: t('father') },
                        { value: 'Mother', label: t('mother') },
                        { value: 'Spouse', label: t('spouse') },
                        { value: 'Son', label: t('son') },
                        { value: 'Daughter', label: t('daughter') },
                        { value: 'Siblings', label: t('siblings') },
                        { value: 'Others', label: t('others') }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <AppButton
              type="button"
              tone="primary"
              size="large"
              fullWidth
              previewRestricted
              endIcon={<ArrowRight size={16} />}
              onClick={handleNext}
              sx={{ fontSize: '0.75rem' }}
            >
              Proceed to Gift Details
            </AppButton>
          </div>
        )}

        {stage === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Stage 2: Gift & Valuation Information</h3>

            <div className="space-y-4">
              <div>
                <AppCurrencyField
                  label={t('giftAmountBdt')}
                  value={giftAmountInput}
                  minAmount={1000}
                  decimalScale={2}
                  onChange={e => {
                    setGiftAmountInput(e.target.value);
                    if (errors.giftAmount) setErrors(prev => ({ ...prev, giftAmount: undefined }));
                  }}
                  error={Boolean(errors.giftAmount)}
                  helperText={errors.giftAmount || t('amountMinHelper', { amount: '1,000' })}
                  required
                />
              </div>

              <div>
                <AppTextArea
                  label={t('giftDescription')}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  placeholder={t('giftDescriptionPlaceholder')}
                  error={Boolean(errors.description)}
                  helperText={errors.description || t('giftDescriptionHelper')}
                  rows={3}
                  required
                />
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-800 dark:text-teal-200 font-medium">Calculated Gift Tax (5%)</span>
                  <div className="text-2xl font-bold font-mono text-teal-900 dark:text-teal-100">
                    ৳ {calculatedTax.toLocaleString()}
                  </div>
                </div>
                <ShieldCheck className="text-teal-600" size={32} />
              </div>
            </div>

            <div className="flex gap-4">
              <AppButton
                type="button"
                tone="secondary"
                onClick={() => setStage(1)}
                sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
              >
                {t('back')}
              </AppButton>
              <AppButton
                type="button"
                tone="primary"
                previewRestricted
                endIcon={<ArrowRight size={16} />}
                onClick={handleNext}
                sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
              >
                Proceed to Preview
              </AppButton>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Stage 3: Final Payment Preview</h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Donor:</span>
                <strong>{donorName} (TIN: {donorTin})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Donee:</span>
                <strong>{doneeName} (TIN: {doneeTin} - {relationship})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Gift Amount:</span>
                <strong>৳ {giftAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans font-semibold">Total Gift Tax Taxable:</span>
                <strong className="text-teal-700 text-base font-bold">৳ {calculatedTax.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex gap-4">
              <AppButton
                tone="secondary"
                onClick={() => setStage(2)}
                sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
              >
                {t('back')}
              </AppButton>
              <AppButton
                tone="confirm"
                previewRestricted
                endIcon={<CheckCircle size={16} />}
                onClick={handlePay}
                sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}
              >
                {t('confirmPayment')}
              </AppButton>
            </div>
          </div>
        )}

        {stage === 4 && completedTx && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-bold">Gift Tax Paid Successfully!</h2>
            <p className="text-xs text-slate-500">Challan successfully generated for donor {donorName} and donee {doneeName}.</p>

            <div className="flex justify-center gap-4 pt-4">
              <AppButton
                tone="primary"
                onClick={() => setCompletedTx(completedTx)}
                sx={{ borderRadius: '12px', px: 3, py: 1.5, fontSize: '0.75rem' }}
              >
                View Official Receipt
              </AppButton>
              <AppButton
                tone="secondary"
                onClick={() => navigate('/dashboard')}
                sx={{ borderRadius: '12px', px: 3, py: 1.5, fontSize: '0.75rem' }}
              >
                Return to Dashboard
              </AppButton>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal
        open={Boolean(completedTx && stage === 4)}
        onClose={() => navigate('/dashboard')}
        transaction={completedTx}
      />
    </div>
  );
};
