import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { getDhakaTodayYmd, isValidYmd } from '../../design-system/forms';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentTransaction } from '../../types/tax';
import { PaymentStepHeader } from '../../components/payments/PaymentStepHeader';
import { PaymentSuccessCard } from '../../components/payments/PaymentSuccessCard';
import { GiftTaxPartiesStep } from './components/GiftTaxPartiesStep';
import { GiftTaxPreviewStep } from './components/GiftTaxPreviewStep';
import { GiftTaxValuationStep } from './components/GiftTaxValuationStep';
import {
  calculateGiftTaxAmount,
  resolveGiftTaxReuseSeed,
  validateGiftPartiesStep,
  validateGiftValuationStep,
  type GiftFormErrors,
} from './giftTaxLogic';

export const GiftTaxView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, activeScope, transactions, addTransaction } = useApp();
  const [seed] = useState(() =>
    resolveGiftTaxReuseSeed({
      routeState: (location.state ?? null) as { reuseTxRef?: string; reuseTx?: unknown } | null,
      reuseRefParam: searchParams.get('reuseRef'),
      transactions,
      activeScope,
    })
  );

  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [donorTin, setDonorTin] = useState(seed.tx?.taxpayerTin || (isAuthenticated ? user.tin : ''));
  const [donorName, setDonorName] = useState(seed.tx?.taxpayerName || (isAuthenticated ? user.name : ''));
  const [doneeTin, setDoneeTin] = useState(seed.tx?.beneficiaryTin || '992384102938');
  const [doneeName, setDoneeName] = useState(seed.tx?.beneficiaryName || 'Mrs. Fatema Begum');
  const [relationship, setRelationship] = useState('Mother');
  const [giftAmountInput, setGiftAmountInput] = useState<string>(seed.tx ? String(Math.round(seed.tx.totalAmount / 0.05)) : '500000');
  const [giftDate, setGiftDate] = useState<string>(() => getDhakaTodayYmd());
  const [description, setDescription] = useState(seed.tx?.items[0]?.remarks || 'Residential land transfer as family gift');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [certOpen, setCertOpen] = useState(false);
  const [errors, setErrors] = useState<GiftFormErrors>({});

  const { giftAmount, calculatedTax } = calculateGiftTaxAmount(giftAmountInput);

  const handleNext = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    if (stage === 1) {
      const nextErrors = validateGiftPartiesStep(
        { donorTin, donorName, doneeTin, doneeName },
        { invalidTin: t('invalidTinError'), requiredDonorName: t('requiredDonorNameError'), requiredDoneeName: t('requiredDoneeNameError') }
      );
      if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }
      setErrors({}); setStage(2);
    } else if (stage === 2) {
      const nextErrors = validateGiftValuationStep({ giftAmountInput, description, giftDate }, {
        amountMin: t('amountMinError', { amount: '1,000' }), amountInvalid: t('amountInvalidError'), requiredDescription: t('requiredGiftDescriptionError'), requiredGiftDate: t('dateRequiredError'), invalidGiftDate: t('giftDateInvalidError'), futureGiftDate: t('giftDateFutureError'),
      });
      if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }
      setErrors({}); setStage(3);
    }
  };

  const handlePay = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const nextErrors = validateGiftValuationStep({ giftAmountInput, description, giftDate }, valuationMessages);
    if (Object.keys(nextErrors).length > 0 || !isValidYmd(giftDate)) {
      setErrors(
        isValidYmd(giftDate) ? nextErrors : { ...nextErrors, giftDate: valuationMessages.invalidGiftDate }
      );
      setStage(2);
      return;
    }
    const tx = addTransaction({
      taxpayerTin: donorTin,
      taxpayerName: donorName,
      ownerScope: activeScope,
      originMode: isAuthenticated ? 'signed_in' : 'walk_in',
      beneficiaryTin: doneeTin,
      beneficiaryName: doneeName,
      category: 'gift_tax',
      giftDate,
      items: [
        {
          headId: 'h6',
          headCode: '0130',
          headNameEn: `Gift Tax (দানকর) - Donee: ${doneeName} (${relationship})`,
          headNameBn: `দানকর - ${doneeName}`,
          assessmentYear: '2025-2026',
          amount: calculatedTax,
          remarks: description.trim(),
        },
      ],
      totalAmount: calculatedTax,
      paymentChannel: 'bKash',
      status: 'Completed',
    });
    setCompletedTx(tx);
    setStage(4);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <PaymentStepHeader
          title={<><Gift className="text-teal-700" size={28} /> {t('giftTax')}</>}
          subtitle="4-Stage structured gift tax declaration and payment with donor/donee mapping."
          stepIndicator={`Stage ${stage} of 4`}
        />
        {seed.rejected && (
          <div role="alert" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {isBn ? 'অনুরোধকৃত দানকর লেনদেনটি বর্তমান অ্যাকাউন্টের সাথে মেলে না বা অবৈধ।' : 'Requested transaction reference is unavailable or does not belong to the active account.'}
          </div>
        )}

        {stage === 1 && (
          <GiftTaxPartiesStep
            donorTin={donorTin}
            donorName={donorName}
            doneeTin={doneeTin}
            doneeName={doneeName}
            relationship={relationship}
            errors={errors}
            onChangeDonorTin={(val) => { setDonorTin(val); if (errors.donorTin) setErrors((p) => ({ ...p, donorTin: undefined })); }}
            onChangeDonorName={(val) => { setDonorName(val); if (errors.donorName) setErrors((p) => ({ ...p, donorName: undefined })); }}
            onChangeDoneeTin={(val) => { setDoneeTin(val); if (errors.doneeTin) setErrors((p) => ({ ...p, doneeTin: undefined })); }}
            onChangeDoneeName={(val) => { setDoneeName(val); if (errors.doneeName) setErrors((p) => ({ ...p, doneeName: undefined })); }}
            onChangeRelationship={setRelationship}
            onNext={handleNext}
          />
        )}

        {stage === 2 && (
          <GiftTaxValuationStep
            giftAmountInput={giftAmountInput}
            giftDate={giftDate}
            description={description}
            calculatedTax={calculatedTax}
            errors={errors}
            onChangeAmount={(val) => { setGiftAmountInput(val); if (errors.giftAmount) setErrors((p) => ({ ...p, giftAmount: undefined })); }}
            onChangeGiftDate={(val) => { setGiftDate(val); if (errors.giftDate) setErrors((p) => ({ ...p, giftDate: undefined })); }}
            onChangeDescription={(val) => { setDescription(val); if (errors.description) setErrors((p) => ({ ...p, description: undefined })); }}
            onBack={() => setStage(1)}
            onNext={handleNext}
          />
        )}

        {stage === 3 && (
          <GiftTaxPreviewStep
            donorName={donorName}
            donorTin={donorTin}
            doneeName={doneeName}
            doneeTin={doneeTin}
            relationship={relationship}
            giftAmount={giftAmount}
            giftDate={giftDate}
            calculatedTax={calculatedTax}
            onBack={() => setStage(2)}
            onPay={handlePay}
          />
        )}

        {stage === 4 && completedTx && (
          <PaymentSuccessCard
            title="Sample Gift Tax Preview Recorded"
            subtitle={`Illustrative prototype record for donor ${donorName} and donee ${doneeName} (not an official payment or challan).`}
            onViewReceipt={() => setCompletedTx(completedTx)}
            onViewCertificate={() => setCertOpen(true)}
            onReturnDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>

      <ReceiptModal open={Boolean(completedTx && stage === 4 && !certOpen)} onClose={() => navigate('/dashboard')} transaction={completedTx} isAuthenticated={isAuthenticated} />
      <PaymentCertificateDialog open={certOpen} onClose={() => setCertOpen(false)} transaction={completedTx} isAuthenticated={isAuthenticated} />
    </div>
  );
};
