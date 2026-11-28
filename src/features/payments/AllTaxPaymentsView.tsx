import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { PaymentStepHeader } from '../../components/payments/PaymentStepHeader';
import { AllTaxCategoryStep } from './components/AllTaxCategoryStep';
import { AllTaxFormStep } from './components/AllTaxFormStep';
import { AllTaxPreviewStep } from './components/AllTaxPreviewStep';
import { AllTaxResultStep } from './components/AllTaxResultStep';
import { AllTaxTaxpayerStep } from './components/AllTaxTaxpayerStep';
import { useAllTaxPaymentFlow } from './useAllTaxPaymentFlow';

export const AllTaxPaymentsView: React.FC = () => {
  const navigate = useNavigate();
  const flow = useAllTaxPaymentFlow();
  const [certOpen, setCertOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <PaymentStepHeader
          title="All Tax Payments (সকল কর প্রদান)"
          subtitle="File Tax with Return, Advance Tax, Assessed Demand, Penalty, Source Tax, Tribunal, or Other Heads"
          stepIndicator={`Step ${flow.stepNumber} of 4`}
        />

        {flow.step === 'chooser' && (
          <AllTaxCategoryStep
            selectedCategory={flow.selectedCategory}
            frequentCategories={flow.frequentCategories}
            onSelectCategory={flow.handleSelectCategory}
          />
        )}

        {flow.step === 'taxpayer' && (
          <AllTaxTaxpayerStep
            isAuthenticated={flow.isAuthenticated}
            userTin={flow.user.tin}
            userName={flow.user.name}
            liabilityMode={flow.liabilityMode}
            beneficiaries={flow.beneficiaries}
            selectedTaxpayers={flow.selectedTaxpayers}
            onChangeLiabilityMode={(mode) => {
              flow.setLiabilityMode(mode);
              if (mode === 'own' && flow.isAuthenticated && flow.user.tin) {
                flow.setSelectedTaxpayers([{ tin: flow.user.tin, name: flow.user.name, source: 'self' }]);
                flow.setSelectedTaxpayerTin(flow.user.tin);
              }
            }}
            onChangeSelectedTaxpayers={(next) => {
              flow.setSelectedTaxpayers(next);
              if (next.length > 0 && !next.some((tp) => tp.tin === flow.selectedTaxpayerTin)) {
                flow.setSelectedTaxpayerTin(next[0].tin);
              }
            }}
            onBack={() => flow.setStep('chooser')}
            onNext={() => flow.setStep('form')}
          />
        )}

        {flow.step === 'form' && (
          <AllTaxFormStep
            selectedCategory={flow.selectedCategory}
            assessmentYear={flow.assessmentYear}
            selectedHeadId={flow.selectedHeadId}
            amountInput={flow.amountInput}
            amountError={flow.amountError}
            beneficiaryError={flow.beneficiaryError}
            formBannerError={flow.formBannerError}
            remarks={flow.remarks}
            isAuthenticated={flow.isAuthenticated}
            isForBeneficiary={flow.isForBeneficiary}
            beneficiaryTin={flow.beneficiaryTin}
            beneficiaries={flow.beneficiaries}
            activeTaxpayers={flow.selectedTaxpayers}
            selectedTaxpayerTin={flow.selectedTaxpayerTin}
            items={flow.items}
            totalAmount={flow.totalAmount}
            onChangeCategory={() => flow.setStep('chooser')}
            onBackToTaxpayers={() => flow.setStep('taxpayer')}
            onToggleBeneficiary={(checked) => {
              flow.setIsForBeneficiary(checked);
              if (!checked) flow.setBeneficiaryError('');
            }}
            onChangeBeneficiaryTin={(tin) => {
              flow.setBeneficiaryTin(tin);
              if (flow.beneficiaryError) flow.setBeneficiaryError('');
            }}
            onChangeSelectedTaxpayerTin={flow.setSelectedTaxpayerTin}
            onChangeAssessmentYear={flow.setAssessmentYear}
            onChangeSelectedHeadId={flow.setSelectedHeadId}
            onChangeAmountInput={(val) => {
              flow.setAmountInput(val);
              if (flow.amountError) flow.setAmountError('');
            }}
            onChangeRemarks={flow.setRemarks}
            onAddItem={flow.handleAddItem}
            onRemoveItem={flow.handleRemoveItem}
            onSaveDraft={flow.handleSaveDraft}
            onProceedToPreview={flow.handleProceedToPreview}
          />
        )}

        {flow.step === 'preview' && (
          <AllTaxPreviewStep
            userTin={flow.selectedTaxpayers[0]?.tin || flow.user.tin}
            userName={flow.selectedTaxpayers[0]?.name || flow.user.name}
            isForBeneficiary={flow.isForBeneficiary}
            beneficiaryTin={flow.beneficiaryTin}
            selectedCategory={flow.selectedCategory}
            paymentChannel={flow.paymentChannel}
            items={flow.items}
            totalAmount={flow.totalAmount}
            onChangeChannel={flow.setPaymentChannel}
            onBack={() => flow.setStep('form')}
            onConfirmPayment={flow.handleConfirmPayment}
          />
        )}

        {flow.step === 'success' && flow.completedTx && (
          <AllTaxResultStep
            transaction={flow.completedTx}
            isAuthenticated={flow.isAuthenticated}
            onViewReceipt={() => flow.setShowReceipt(true)}
            onViewCertificate={() => setCertOpen(true)}
            onSignInToClaim={() =>
              navigate(`/login?returnTo=${encodeURIComponent(`/history?claimRef=${flow.completedTx!.transactionRef}`)}`)
            }
            onContinueWalkIn={flow.resetWalkIn}
            onReturnDashboard={flow.goDashboard}
          />
        )}
      </div>

      <ReceiptModal
        open={Boolean(flow.completedTx && flow.step === 'success' && flow.showReceipt && !certOpen)}
        onClose={() => flow.setShowReceipt(false)}
        transaction={flow.completedTx}
        isAuthenticated={flow.isAuthenticated}
      />
      <PaymentCertificateDialog
        open={certOpen}
        onClose={() => setCertOpen(false)}
        transaction={flow.completedTx}
        isAuthenticated={flow.isAuthenticated}
      />
    </div>
  );
};
