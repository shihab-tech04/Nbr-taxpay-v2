import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { SharedPayTaxProgressiveModal } from '../../components/payments/SharedPayTaxProgressiveModal';
import { SharedPaymentChannelStep } from '../../components/payments/SharedPaymentChannelStep';
import { SharedPaymentResultStep } from '../../components/payments/SharedPaymentResultStep';
import { GiftTaxPartiesStep } from './components/GiftTaxPartiesStep';
import { GiftTaxPreviewStep } from './components/GiftTaxPreviewStep';
import { GiftTaxRightRailExtras } from './components/GiftTaxRightRailExtras';
import { GiftTaxValuationStep } from './components/GiftTaxValuationStep';
import { useGiftTaxFlow } from './useGiftTaxFlow';

export const GiftTaxView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const flow = useGiftTaxFlow();

  const bnStageDigits = ['০', '১', '২', '৩'][flow.stage] ?? String(flow.stage);
  const stepLabel =
    flow.step === 'channel'
      ? (isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Channel')
      : flow.step === 'success'
      ? (isBn ? 'সম্পন্ন' : 'Complete')
      : isBn ? `ধাপ ${bnStageDigits} / ৩` : `Stage ${flow.stage} of 3`;

  const handleModalBack = () => {
    if (flow.step === 'channel') { flow.setStep('stages'); return; }
    if (flow.step === 'stages' && flow.stage > 1) { flow.setStage((flow.stage - 1) as 1 | 2); return; }
    flow.goDashboard();
  };

  const summaryLines = flow.hasValidatedEstimate
    ? [
        {
          id: 'gift-value',
          label: isBn ? 'ঘোষিত দানের মূল্য' : 'Declared Gift Value',
          meta: flow.giftDate || undefined,
          amountText: `৳ ${flow.calculation.giftAmount.toLocaleString()}`,
        },
        {
          id: 'gift-tax-est',
          label: isBn ? 'উদাহরণমূলক দানকর' : 'Illustrative Tax Estimate',
          meta: isBn ? 'অব্যাহতি: ৳ ২০,০০০' : 'Allowance: ৳ 20,000',
          amountText: `৳ ${flow.calculation.calculatedTax.toLocaleString()}`,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-12">
      <SharedPayTaxProgressiveModal
        open
        disablePortal
        onClose={flow.goDashboard}
        onBack={flow.step !== 'success' && (flow.step === 'channel' || flow.stage > 1) ? handleModalBack : undefined}
        isDirty={flow.isDirty}
        onSaveDraft={flow.isAuthenticated ? flow.handleSaveDraft : undefined}
        dirtyCancelLabel={isBn ? 'বাতিল' : 'Cancel'}
        icon={<Gift className="text-teal-700" size={20} />}
        title={t('giftTax')}
        subtitle={t('giftTaxModalSubtitle')}
        stepIndicator={stepLabel}
        summaryTitle={t('giftSummaryTitle')}
        summaryMetaBadges={[isBn ? 'খাত 0130 · দানকর' : 'Code 0130 · Gift Tax']}
        summaryCustomContent={
          flow.step !== 'success' ? (
            <GiftTaxRightRailExtras
              donor={flow.donor}
              donee={flow.donee}
              relationship={flow.relationship}
              relationshipTag={flow.relationshipTag}
              undoParty={flow.undoParty}
              onEditParty={flow.handleEditParty}
              onRemoveParty={flow.handleRemoveParty}
              onUndoRemove={flow.handleUndoRemove}
            />
          ) : undefined
        }
        summaryLines={summaryLines}
        summaryEmptyText={isBn ? 'ধাপ ১-এ দাতা ও গ্রহীতা যোগ করুন।' : 'Add Donor & Donee in Stage 1.'}
        summaryTotalLabel={isBn ? 'প্রাক্কলিত দানকর' : 'Estimated Tax'}
        summaryTotalAmount={flow.completedTx?.totalAmount ?? flow.calculation.calculatedTax}
        summaryTotalValidated={flow.hasValidatedEstimate}
        summaryFooterNote={t('giftTaxNonStatutoryDisclaimer')}
      >
        {flow.seedRejected && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {isBn ? 'অনুরোধকৃত দানকর লেনদেন বা খসড়া বর্তমান অ্যাকাউন্টে অনুপলব্ধ।' : 'Requested Gift Tax record or draft is unavailable for this account.'}
          </div>
        )}

        {flow.step === 'stages' && flow.stage === 1 && (
          <GiftTaxPartiesStep
            donor={flow.donor} donee={flow.donee} donorTinInput={flow.donorTinInput} doneeTinInput={flow.doneeTinInput}
            donorLookupResult={flow.donorLookupResult} doneeLookupResult={flow.doneeLookupResult}
            donorLookupError={flow.donorLookupError} doneeLookupError={flow.doneeLookupError}
            relationship={flow.relationship} relationshipTag={flow.relationshipTag} undoParty={flow.undoParty}
            errors={flow.errors} isAuthenticated={flow.isAuthenticated}
            onChangeDonorTin={(v) => { flow.setDonorTinInput(v); flow.setDonorLookupResult(null); flow.setDonorLookupError(''); }}
            onChangeDoneeTin={(v) => { flow.setDoneeTinInput(v); flow.setDoneeLookupResult(null); flow.setDoneeLookupError(''); }}
            onSearchDonor={flow.handleSearchDonor} onSearchDonee={flow.handleSearchDonee}
            onAddDonor={flow.handleAddDonor} onAddDonee={flow.handleAddDonee}
            onEditParty={flow.handleEditParty} onRemoveParty={flow.handleRemoveParty} onUndoRemove={flow.handleUndoRemove}
            onSelectRelationship={flow.handleSelectRelationship} onChangeRelationshipTag={flow.handleChangeRelationshipTag}
            onSaveDraft={flow.handleSaveDraft} onNext={flow.handleProceedStage1}
          />
        )}

        {flow.step === 'stages' && flow.stage === 2 && (
          <GiftTaxValuationStep
            giftAmountInput={flow.giftAmountInput} description={flow.description} giftDate={flow.giftDate} remarks={flow.remarks}
            calculation={flow.calculation} errors={flow.errors} isAuthenticated={flow.isAuthenticated}
            onChangeAmount={(v) => { flow.setGiftAmountInput(v); if (flow.errors.giftAmount) flow.setErrors((p) => ({ ...p, giftAmount: undefined })); }}
            onChangeDescription={(v) => { flow.setDescription(v); if (flow.errors.description) flow.setErrors((p) => ({ ...p, description: undefined })); }}
            onChangeGiftDate={(v) => { flow.setGiftDate(v); if (flow.errors.giftDate) flow.setErrors((p) => ({ ...p, giftDate: undefined })); }}
            onChangeRemarks={(v) => { flow.setRemarks(v); if (flow.errors.remarks) flow.setErrors((p) => ({ ...p, remarks: undefined })); }}
            onSaveDraft={flow.handleSaveDraft} onBack={() => flow.setStage(1)} onNext={flow.handleProceedStage2}
          />
        )}

        {flow.step === 'stages' && flow.stage === 3 && flow.donor && flow.donee && flow.relationship && (
          <GiftTaxPreviewStep
            donor={flow.donor} donee={flow.donee} relationship={flow.relationship} relationshipTag={flow.relationshipTag}
            giftDate={flow.giftDate} description={flow.description} remarks={flow.remarks} calculation={flow.calculation}
            acknowledged={flow.acknowledged} ackError={flow.ackError} submitError={flow.submitError}
            isAuthenticated={flow.isAuthenticated}
            onChangeAcknowledged={(c) => { flow.setAcknowledged(c); if (c) flow.setAckError(''); }}
            onEditParties={() => flow.setStage(1)} onEditValuation={() => flow.setStage(2)}
            onSaveDraft={flow.handleSaveDraft} onBack={() => flow.setStage(2)} onProceed={flow.handleProceedFromPreview}
          />
        )}

        {flow.step === 'channel' && (
          <SharedPaymentChannelStep
            testId="gift-tax-channel-step"
            paymentChannel={flow.paymentChannel}
            totalAmount={flow.calculation.calculatedTax}
            itemCount={1}
            itemCountLabel={isBn ? `দাতা ${flow.donor?.name ?? ''} (পক্ষে) এবং গ্রহীতা ${flow.donee?.name ?? ''} (মাধ্যমে) — পেমেন্ট মাধ্যম নির্বাচন করুন।` : `Select an illustrative payment channel for Donor ${flow.donor?.name ?? ''} (On Behalf Of) via ${flow.donee?.name ?? ''} (Through).`}
            requireAcknowledgement
            acknowledged={flow.acknowledged}
            acknowledgementLabel={isBn ? 'আমি নিশ্চিত করছি যে দাতার নামে কর ক্রেডিট (On Behalf Of) এবং গ্রহীতার (Through) বিবরণ ও উদাহরণমূলক প্রাক্কলন সঠিক।' : 'I confirm Donor credit attribution (On Behalf Of: Donor), Donee details (Through: Donee), and understand this is an illustrative prototype payment.'}
            acknowledgementError={flow.ackError}
            submitError={flow.submitError}
            onChangeAcknowledged={(c) => { flow.setAcknowledged(c); if (c) flow.setAckError(''); }}
            onChangeChannel={flow.setPaymentChannel}
            onBack={() => flow.setStep('stages')}
            onConfirmPayment={flow.handleConfirmChannelPayment}
          />
        )}

        {flow.step === 'success' && flow.completedTx && (
          <SharedPaymentResultStep
            transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated}
            onViewReceipt={() => flow.setShowReceipt(true)} onViewCertificate={() => flow.setCertOpen(true)}
            onSignInToClaim={() => navigate(`/login?returnTo=${encodeURIComponent(`/history?claimRef=${flow.completedTx!.transactionRef}`)}`)}
            onContinueWalkIn={flow.resetWalkIn} onReturnDashboard={flow.goDashboard}
          />
        )}
      </SharedPayTaxProgressiveModal>

      <ReceiptModal open={Boolean(flow.completedTx && flow.step === 'success' && flow.showReceipt && !flow.certOpen)} onClose={() => flow.setShowReceipt(false)} transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated} />
      <PaymentCertificateDialog open={flow.certOpen} onClose={() => flow.setCertOpen(false)} transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated} />
    </div>
  );
};
