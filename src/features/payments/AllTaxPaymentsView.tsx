import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { SharedPayTaxProgressiveModal } from '../../components/payments/SharedPayTaxProgressiveModal';
import { getAllTaxCategorySpec } from './allTaxCatalogue';
import { AllTaxCategoryStep } from './components/AllTaxCategoryStep';
import { AllTaxChannelStep } from './components/AllTaxChannelStep';
import { AllTaxFormStep } from './components/AllTaxFormStep';
import { AllTaxPreviewStep } from './components/AllTaxPreviewStep';
import { AllTaxResultStep } from './components/AllTaxResultStep';
import { AllTaxTaxpayerStep } from './components/AllTaxTaxpayerStep';
import { useAllTaxPaymentFlow } from './useAllTaxPaymentFlow';

export const AllTaxPaymentsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const flow = useAllTaxPaymentFlow();
  const [certOpen, setCertOpen] = useState(false);

  const handleModalBack = () => {
    if (flow.step === 'taxpayer') { flow.setStep('chooser'); return; }
    if (flow.step === 'form') { flow.setStep('taxpayer'); return; }
    if (flow.step === 'preview') { flow.setStep('form'); return; }
    if (flow.step === 'channel') { flow.setStep('preview'); return; }
    flow.goDashboard();
  };

  const catSpec = getAllTaxCategorySpec(flow.selectedCategory);
  const summaryLines = flow.items.map((item, idx) => ({
    id: `${item.headId}-${item.taxpayerTin ?? idx}-${item.assessmentYear}`,
    label: `[${item.headCode}] ${isBn ? item.headNameBn : item.headNameEn}`,
    meta: `AY ${item.assessmentYear}${item.taxpayerTin ? ` · ${item.taxpayerName ?? ''} (${item.taxpayerTin})` : ''}`,
    amountText: `৳ ${item.amount.toLocaleString()}`,
  }));

  const stepLabel = flow.step === 'chooser' ? (isBn ? 'বিভাগ নির্বাচন' : 'Category Chooser') : `${isBn ? 'ধাপ' : 'Step'} ${flow.stepNumber} of 5`;
  const isDirty = flow.step !== 'success' && (flow.items.length > 0 || Boolean(flow.amountInput || flow.remarks || (flow.liabilityMode === 'facilitation' && flow.selectedTaxpayers.length > 0)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-12">
      <SharedPayTaxProgressiveModal
        open
        disablePortal
        onClose={flow.goDashboard}
        onBack={flow.step !== 'chooser' && flow.step !== 'success' ? handleModalBack : undefined}
        isDirty={isDirty}
        onSaveDraft={flow.isAuthenticated ? flow.handleSaveDraft : undefined}
        dirtyCancelLabel={isBn ? 'বাতিল' : 'Cancel'}
        icon={<Landmark className="text-teal-700" size={20} />}
        title={isBn ? 'সকল কর প্রদান (Pay Tax)' : 'All Tax Payments (সকল কর প্রদান)'}
        subtitle={isBn ? 'আয়কর, অগ্রিম কর, উৎসে কর, জরিমানা ও অন্যান্য খাত' : 'Return Tax, Advance Tax, Assessed Demand, Penalty, Source Tax & Other Heads'}
        stepIndicator={stepLabel}
        summaryTitle={isBn ? 'তাৎক্ষণিক কর সারাংশ' : 'Live Tax Summary'}
        summaryMetaBadges={[isBn ? catSpec.titleBn : catSpec.titleEn, `${flow.selectedTaxpayers.length} ${isBn ? 'করদাতা' : 'Taxpayer(s)'}`]}
        summaryLines={summaryLines}
        summaryEmptyText={isBn ? 'সারাংশ দেখতে কর খাত ও পরিমাণ যুক্ত করুন।' : 'Add validated tax head allocations to preview your challan total.'}
        summaryTotalLabel={t('totalPayable')}
        summaryTotalAmount={flow.completedTx?.totalAmount ?? flow.totalAmount}
        summaryTotalValidated={flow.hasValidatedTotal}
      >
        {flow.formBannerError && flow.step !== 'form' && (
          <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {flow.formBannerError}
          </div>
        )}
        {flow.step === 'chooser' && (
          <AllTaxCategoryStep selectedCategory={flow.selectedCategory} frequentCategories={flow.frequentCategories} onSelectCategory={flow.handleSelectCategory} />
        )}
        {flow.step === 'taxpayer' && (
          <AllTaxTaxpayerStep
            isAuthenticated={flow.isAuthenticated} userTin={flow.user.tin} userName={flow.user.name}
            liabilityMode={flow.liabilityMode} beneficiaries={flow.beneficiaries} selectedTaxpayers={flow.selectedTaxpayers}
            onChangeLiabilityMode={flow.setLiabilityMode} onChangeSelectedTaxpayers={flow.setSelectedTaxpayers}
            onSaveNewBeneficiary={flow.addBeneficiary} onBack={() => flow.setStep('chooser')} onNext={() => flow.setStep('form')}
          />
        )}
        {flow.step === 'form' && (
          <AllTaxFormStep
            selectedCategory={flow.selectedCategory} assessmentYear={flow.assessmentYear} selectedHeadId={flow.selectedHeadId}
            amountInput={flow.amountInput} amountError={flow.amountError} beneficiaryError={flow.beneficiaryError}
            formBannerError={flow.formBannerError} remarks={flow.remarks} isAuthenticated={flow.isAuthenticated}
            isForBeneficiary={flow.isForBeneficiary} beneficiaryTin={flow.beneficiaryTin} beneficiaries={flow.beneficiaries}
            activeTaxpayers={flow.selectedTaxpayers} selectedTaxpayerTin={flow.selectedTaxpayerTin} items={flow.items}
            editingIndex={flow.editingIndex} totalAmount={flow.totalAmount} onChangeCategory={() => flow.setStep('chooser')}
            onBackToTaxpayers={() => flow.setStep('taxpayer')}
            onToggleBeneficiary={(checked) => { flow.setIsForBeneficiary(checked); if (!checked) flow.setBeneficiaryError(''); }}
            onChangeBeneficiaryTin={(tin) => { flow.setBeneficiaryTin(tin); if (flow.beneficiaryError) flow.setBeneficiaryError(''); }}
            onChangeSelectedTaxpayerTin={flow.setSelectedTaxpayerTin} onChangeAssessmentYear={flow.setAssessmentYear}
            onChangeSelectedHeadId={flow.setSelectedHeadId}
            onChangeAmountInput={(val) => { flow.setAmountInput(val); if (flow.amountError) flow.setAmountError(''); }}
            onChangeRemarks={flow.setRemarks} onAddItem={flow.handleAddItem} onEditItem={flow.handleEditItem}
            onCancelEdit={flow.handleCancelEdit} onRemoveItem={flow.handleRemoveItem}
            onSaveDraft={flow.handleSaveDraft} onProceedToPreview={flow.handleProceedToPreview}
          />
        )}
        {flow.step === 'preview' && (
          <AllTaxPreviewStep
            userTin={flow.payerAndRecipients.payerTin} userName={flow.payerAndRecipients.payerName}
            isForBeneficiary={flow.isForBeneficiary} beneficiaryTin={flow.payerAndRecipients.beneficiaryTin ?? ''}
            recipients={flow.payerAndRecipients.recipients} selectedCategory={flow.selectedCategory}
            items={flow.items} totalAmount={flow.totalAmount} onBack={() => flow.setStep('form')} onProceedToChannel={() => flow.setStep('channel')}
          />
        )}
        {flow.step === 'channel' && (
          <AllTaxChannelStep
            paymentChannel={flow.paymentChannel} totalAmount={flow.totalAmount} itemCount={flow.items.length}
            submitError={flow.submitError} onChangeChannel={flow.setPaymentChannel}
            onBack={() => flow.setStep('preview')} onConfirmPayment={flow.handleConfirmPayment}
          />
        )}
        {flow.step === 'success' && flow.completedTx && (
          <AllTaxResultStep
            transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated}
            onViewReceipt={() => flow.setShowReceipt(true)} onViewCertificate={() => setCertOpen(true)}
            onSignInToClaim={() => navigate(`/login?returnTo=${encodeURIComponent(`/history?claimRef=${flow.completedTx!.transactionRef}`)}`)}
            onContinueWalkIn={flow.resetWalkIn} onReturnDashboard={flow.goDashboard}
          />
        )}
      </SharedPayTaxProgressiveModal>

      <ReceiptModal open={Boolean(flow.completedTx && flow.step === 'success' && flow.showReceipt && !certOpen)} onClose={() => flow.setShowReceipt(false)} transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated} />
      <PaymentCertificateDialog open={certOpen} onClose={() => setCertOpen(false)} transaction={flow.completedTx} isAuthenticated={flow.isAuthenticated} />
    </div>
  );
};
