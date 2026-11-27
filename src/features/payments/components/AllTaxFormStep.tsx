import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppCurrencyField, AppSelectField, AppTextField } from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import { TAX_HEADS } from '../../../shared/mockData';
import type { Beneficiary, PaymentLineItem, TaxHeadCategory } from '../../../types/tax';
import { AllTaxItemsTable } from './AllTaxItemsTable';

interface AllTaxFormStepProps {
  selectedCategory: TaxHeadCategory;
  assessmentYear: string;
  selectedHeadId: string;
  amountInput: string;
  amountError: string;
  beneficiaryError: string;
  formBannerError: string;
  remarks: string;
  isForBeneficiary: boolean;
  beneficiaryTin: string;
  beneficiaries: readonly Beneficiary[];
  items: readonly PaymentLineItem[];
  totalAmount: number;
  onChangeCategory: () => void;
  onToggleBeneficiary: (checked: boolean) => void;
  onChangeBeneficiaryTin: (tin: string) => void;
  onChangeAssessmentYear: (ay: string) => void;
  onChangeSelectedHeadId: (headId: string) => void;
  onChangeAmountInput: (amount: string) => void;
  onChangeRemarks: (remarks: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSaveDraft: () => void;
  onProceedToPreview: () => void;
}

export const AllTaxFormStep: React.FC<AllTaxFormStepProps> = ({
  selectedCategory,
  assessmentYear,
  selectedHeadId,
  amountInput,
  amountError,
  beneficiaryError,
  formBannerError,
  remarks,
  isForBeneficiary,
  beneficiaryTin,
  beneficiaries,
  items,
  totalAmount,
  onChangeCategory,
  onToggleBeneficiary,
  onChangeBeneficiaryTin,
  onChangeAssessmentYear,
  onChangeSelectedHeadId,
  onChangeAmountInput,
  onChangeRemarks,
  onAddItem,
  onRemoveItem,
  onSaveDraft,
  onProceedToPreview,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <h3 className="text-lg font-bold">Configure Tax Line Items</h3>
        <AppButton
          actionType="secondary"
          surface="ghost"
          size="small"
          onClick={onChangeCategory}
          sx={{ color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
        >
          Change Category
        </AppButton>
      </div>

      {formBannerError && (
        <div
          role="alert"
          className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300"
        >
          {formBannerError}
        </div>
      )}

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
        <AppCheckbox
          checked={isForBeneficiary}
          onChange={(_, checked) => onToggleBeneficiary(checked)}
          label="Facilitate payment on behalf of a beneficiary (Family member / Client)"
        />

        {isForBeneficiary && (
          <div className="pt-2">
            <AppSelectField
              label={t('selectBeneficiary')}
              value={beneficiaryTin}
              onChange={(e) => onChangeBeneficiaryTin(e.target.value)}
              error={Boolean(beneficiaryError)}
              helperText={beneficiaryError || t('selectBeneficiaryHelper')}
              options={[
                { value: '', label: t('selectBeneficiaryOption') },
                ...beneficiaries.map((b) => ({
                  value: b.tin,
                  label: `${b.name} (TIN: ${b.tin} - ${b.relationship})`,
                })),
              ]}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelectField
          label={t('assessmentYear')}
          value={assessmentYear}
          onChange={(e) => onChangeAssessmentYear(e.target.value)}
          helperText={t('assessmentYearHelper')}
          options={[
            { value: '2025-2026', label: '2025-2026' },
            { value: '2026-2027', label: '2026-2027' },
            { value: '2024-2025', label: '2024-2025' },
          ]}
        />
        <AppSelectField
          label={t('taxHead')}
          value={selectedHeadId}
          onChange={(e) => onChangeSelectedHeadId(e.target.value)}
          helperText={t('taxHeadHelper')}
          options={TAX_HEADS.filter(
            (h) => h.category === selectedCategory || selectedCategory === 'other_tax'
          ).map((h) => ({
            value: h.id,
            label: `[${h.code}] ${i18n.language === 'bn' ? h.nameBn : h.nameEn}`,
          }))}
        />
        <AppCurrencyField
          label={t('amountBdt')}
          value={amountInput}
          minAmount={100}
          decimalScale={2}
          onChange={(e) => onChangeAmountInput(e.target.value)}
          error={Boolean(amountError)}
          helperText={amountError || t('amountMinHelper', { amount: '100' })}
          required
        />
        <AppTextField
          label={t('remarksOptional')}
          value={remarks}
          onChange={(e) => onChangeRemarks(e.target.value)}
          placeholder={t('remarksPlaceholder')}
          helperText={t('remarksHelper')}
        />
      </div>

      <AppButton
        type="button"
        actionType="secondary"
        surface="soft"
        fullWidth
        previewRestricted
        startIcon={<Plus size={16} />}
        onClick={onAddItem}
        sx={{ borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
      >
        {t('addHead')}
      </AppButton>

      <AllTaxItemsTable items={items} totalAmount={totalAmount} onRemoveItem={onRemoveItem} />

      <div className="flex gap-4 pt-4">
        <AppButton
          actionType="secondary"
          previewRestricted
          onClick={onSaveDraft}
          sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          {t('saveDraft')}
        </AppButton>
        <AppButton
          actionType="primary"
          previewRestricted
          endIcon={<ArrowRight size={16} />}
          onClick={onProceedToPreview}
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          {t('proceedToPreview')}
        </AppButton>
      </div>
    </div>
  );
};
