import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { SharedPayTaxProgressiveModal } from '../../components/payments/SharedPayTaxProgressiveModal';
import { SharedPaymentChannelStep } from '../../components/payments/SharedPaymentChannelStep';
import { SharedPaymentResultStep } from '../../components/payments/SharedPaymentResultStep';
import { TravelDetailsStep } from './components/TravelDetailsStep';
import { TravelPassengerStep } from './components/TravelPassengerStep';
import { TravelTaxPreviewStep } from './components/TravelTaxPreviewStep';
import { TRAVEL_TAX_ECONOMIC_CODE, TRAVEL_TAX_YEAR } from './travelTaxTypes';
import { useTravelTaxFlow } from './useTravelTaxFlow';

export const TravelTaxView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const flow = useTravelTaxFlow();

  const stepLabel =
    flow.step === 'channel'
      ? (isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Channel')
      : flow.step === 'success'
      ? (isBn ? 'সম্পন্ন' : 'Complete')
      : `${isBn ? 'ধাপ' : 'Stage'} ${flow.stage} of 3`;

  const handleModalBack = () => {
    if (flow.step === 'channel') { flow.setStep('stages'); return; }
    if (flow.step === 'stages' && flow.stage > 1) { flow.setStage((flow.stage - 1) as 1 | 2); return; }
    flow.goDashboard();
  };

  const summaryLines =
    flow.breakdown.items.length > 0
      ? flow.breakdown.items.map((p, idx) => ({
          id: p.id,
          label: `#${idx + 1} ${p.passengerName}`,
          meta: `${p.passportMasked} · ${isBn ? `বয়স ${p.ageOnTravelDate}` : `Age ${p.ageOnTravelDate}`}`,
          amountText: `৳ ${p.amount.toLocaleString()}`,
        }))
      : flow.confirmedPassengers.map((p, idx) => ({
          id: p.id,
          label: `#${idx + 1} ${p.passengerName}`,
          meta: `${p.passportMasked} · ${p.passportType}`,
          amountText: isBn ? 'হিসাবাধীন' : 'Pending date',
        }));

  const summaryTotal = flow.completedTx?.totalAmount ?? (flow.breakdown.valid ? flow.breakdown.totalAmount : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-12">
      <SharedPayTaxProgressiveModal
        open
        disablePortal
        onClose={flow.goDashboard}
        onBack={handleModalBack}
        isDirty={flow.step !== 'success' && flow.isDirty}
        icon={<Ship className="text-teal-700" size={20} />}
        title={t('travelTax')}
        subtitle={t('travelTaxModalSubtitle')}
        stepIndicator={stepLabel}
        summaryTitle={t('travelSummaryTitle')}
        summaryMetaBadges={[`${t('travelTaxYearLabel')}: ${TRAVEL_TAX_YEAR}`, `${t('travelEconomicCodeLabel')}: ${TRAVEL_TAX_ECONOMIC_CODE}`]}
        summaryLines={summaryLines}
        summaryEmptyText={isBn ? 'মূল্যায়ন শুরু করতে অন্তত একজন যাত্রী নিশ্চিত করুন।' : 'Confirm at least one passenger to preview assessment totals.'}
        summaryTotalLabel={t('totalPayable')}
        summaryTotalAmount={summaryTotal}
      >
        {flow.step === 'stages' && flow.stage === 1 && (
          <TravelPassengerStep
            confirmedPassengers={flow.confirmedPassengers} draft={flow.draft} entryOpen={flow.entryOpen}
            editingId={flow.editingId} errors={flow.passengerErrors} routeSeedError={flow.routeSeedError}
            isAuthenticated={flow.isAuthenticated} onChangeDraft={(next) => { flow.setDraft(next); flow.setPassengerErrors({}); }}
            onCheckBdPassport={flow.handleCheckBdPassport} onConfirmPassenger={flow.handleConfirmPassenger}
            onOpenAddAnother={flow.handleOpenAddAnother} onCancelEntry={flow.handleCancelEntry}
            onEditConfirmed={flow.handleEditConfirmed} onRemoveConfirmed={flow.handleRemoveConfirmed}
            onSaveDraft={flow.handleSaveDraft} onProceed={flow.handleProceedFromPassengers}
          />
        )}
        {flow.step === 'stages' && flow.stage === 2 && (
          <TravelDetailsStep
            passengers={flow.confirmedPassengers} details={flow.details} errors={flow.detailsErrors}
            isAuthenticated={flow.isAuthenticated} onChangeDetails={(next) => { flow.setDetails(next); flow.setDetailsErrors({}); }}
            onBack={() => flow.setStage(1)} onSaveDraft={flow.handleSaveDraft} onProceed={flow.handleProceedFromDetails}
          />
        )}
        {flow.step === 'stages' && flow.stage === 3 && (
          <TravelTaxPreviewStep
            passengers={flow.breakdown.items} details={flow.details} totalAmount={flow.breakdown.totalAmount}
            receiptMobile={flow.receiptMobile} mobileError={flow.mobileError} submitError={flow.submitError}
            isAuthenticated={flow.isAuthenticated}
            onChangeReceiptMobile={(val) => { flow.setReceiptMobile(val); if (flow.mobileError) flow.setMobileError(''); }}
            onEditPassengers={() => flow.setStage(1)} onEditDetails={() => flow.setStage(2)}
            onSaveDraft={flow.handleSaveDraft} onProceed={flow.handleProceedFromPreview}
          />
        )}
        {flow.step === 'channel' && (
          <SharedPaymentChannelStep
            testId="travel-tax-channel-step" paymentChannel={flow.paymentChannel} totalAmount={flow.breakdown.totalAmount}
            itemCount={flow.breakdown.items.length}
            itemCountLabel={isBn ? `${flow.breakdown.items.length} জন যাত্রীর ভ্রমণ কর পরিশোধের মাধ্যম বেছে নিন।` : `Select an illustrative payment channel for ${flow.breakdown.items.length} confirmed passenger(s).`}
            onChangeChannel={flow.setPaymentChannel} onBack={() => flow.setStep('stages')} onConfirmPayment={flow.handleConfirmChannelPayment}
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
