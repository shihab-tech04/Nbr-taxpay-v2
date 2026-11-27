import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { Gift, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import { AppNumberField, AppTextField, AppSelectField, AppCurrencyField, AppTextArea } from '../../design-system/forms';

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
  
  const [giftAmount, setGiftAmount] = useState<number>(500000);
  const [description, setDescription] = useState('Residential land transfer as family gift');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const taxRate = 0.05; // 5% standard gift tax for non-exempt
  const calculatedTax = Math.round(giftAmount * taxRate);

  const handleNext = () => {
    if (stage === 1) {
      if (!donorTin || !doneeTin) {
        alert('Please enter both Donor and Donee TINs.');
        return;
      }
      setStage(2);
    } else if (stage === 2) {
      if (giftAmount <= 0) {
        alert('Please enter a valid gift amount.');
        return;
      }
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
          headNameEn: `Gift Tax (दानকর) - Donee: ${doneeName} (${relationship})`,
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
                      onChange={e => setDonorTin(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <AppTextField
                      label="Donor Name"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
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
                      onChange={e => setDoneeTin(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <AppTextField
                      label="Donee Name"
                      value={doneeName}
                      onChange={e => setDoneeName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <AppSelectField
                      label={t('relationship')}
                      value={relationship}
                      onChange={e => setRelationship(e.target.value)}
                      options={[
                        { value: 'Father', label: 'Father' },
                        { value: 'Mother', label: 'Mother' },
                        { value: 'Spouse', label: 'Spouse' },
                        { value: 'Son', label: 'Son' },
                        { value: 'Daughter', label: 'Daughter' },
                        { value: 'Siblings', label: 'Siblings' },
                        { value: 'Others', label: 'Others' }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              Proceed to Gift Details <ArrowRight size={16} />
            </button>
          </div>
        )}

        {stage === 2 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Stage 2: Gift & Valuation Information</h3>

            <div className="space-y-4">
              <div>
                <AppCurrencyField
                  label={`${t('giftAmount')} (BDT)`}
                  value={giftAmount}
                  onChange={e => setGiftAmount(Number(e.target.value))}
                  inputProps={{ min: 1000 }}
                />
              </div>

              <div>
                <AppTextArea
                  label={t('giftDescription')}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
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
              <button
                onClick={() => setStage(1)}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                {t('back')}
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 py-3 bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                Proceed to Preview <ArrowRight size={16} />
              </button>
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
              <button
                onClick={() => setStage(2)}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                {t('back')}
              </button>
              <button
                onClick={handlePay}
                className="w-2/3 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                {t('confirmPayment')} <CheckCircle size={16} />
              </button>
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
              <button
                onClick={() => setCompletedTx(completedTx)}
                className="px-6 py-3 bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                View Official Receipt
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                Return to Dashboard
              </button>
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
