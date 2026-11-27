import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentStepHeader } from '../../components/payments/PaymentStepHeader';
import { PaymentSuccessCard } from '../../components/payments/PaymentSuccessCard';
import { AllTaxCategoryStep } from './components/AllTaxCategoryStep';
import { AllTaxFormStep } from './components/AllTaxFormStep';
import { AllTaxPreviewStep } from './components/AllTaxPreviewStep';
import { useAllTaxPaymentFlow } from './useAllTaxPaymentFlow';

export const AllTaxPaymentsView: React.FC = () => {
  const { t } = useTranslation();
  const flow = useAllTaxPaymentFlow();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <PaymentStepHeader
          title="All Tax Payments (সকল কর প্রদান)"
          subtitle="File Income Tax with Return, Advance Tax, or Other Tax Heads"
          stepIndicator={`Step ${flow.stepNumber} of 4`}
        />

        {flow.step === 'chooser' && (
          <AllTaxCategoryStep
            selectedCategory={flow.selectedCategory}
            onSelectCategory={(cat) => {
              flow.setSelectedCategory(cat);
              flow.setStep('form');
            }}
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
            isForBeneficiary={flow.isForBeneficiary}
            beneficiaryTin={flow.beneficiaryTin}
            beneficiaries={flow.beneficiaries}
            items={flow.items}
            totalAmount={flow.totalAmount}
            onChangeCategory={() => flow.setStep('chooser')}
            onToggleBeneficiary={(checked) => {
              flow.setIsForBeneficiary(checked);
              if (!checked) flow.setBeneficiaryError('');
            }}
            onChangeBeneficiaryTin={(tin) => {
              flow.setBeneficiaryTin(tin);
              if (flow.beneficiaryError) flow.setBeneficiaryError('');
            }}
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
            userTin={flow.user.tin}
            userName={flow.user.name}
            isForBeneficiary={flow.isForBeneficiary}
            beneficiaryTin={flow.beneficiaryTin}
            selectedCategory={flow.selectedCategory}
            paymentChannel={flow.paymentChannel}
            totalAmount={flow.totalAmount}
            onChangeChannel={flow.setPaymentChannel}
            onBack={() => flow.setStep('form')}
            onConfirmPayment={flow.handleConfirmPayment}
          />
        )}

        {flow.step === 'success' && flow.completedTx && (
          <PaymentSuccessCard
            title={t('paymentSuccess')}
            subtitle="Illustrative prototype record only — no real payment or official NBR gateway verification occurred."
            details={
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <strong>{flow.completedTx.transactionRef}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Challan Number:</span>
                  <strong>{flow.completedTx.challanNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Ref:</span>
                  <strong>{flow.completedTx.bankRef}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <strong className="text-teal-700">
                    ৳ {flow.completedTx.totalAmount.toLocaleString()}
                  </strong>
                </div>
              </div>
            }
            onViewReceipt={() => flow.setCompletedTx(flow.completedTx)}
            onReturnDashboard={flow.goDashboard}
          />
        )}
      </div>

      <ReceiptModal
        open={Boolean(flow.completedTx && flow.step === 'success')}
        onClose={flow.goDashboard}
        transaction={flow.completedTx}
      />
    </div>
  );
};
