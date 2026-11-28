import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import {
  AppAutocomplete,
  AppCurrencyField,
  AppSelectField,
  AppTextArea,
  type AppAutocompleteOption,
} from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import type { Beneficiary, PaymentLineItem, TaxHeadCategory } from '../../../types/tax';
import { getAllTaxCategorySpec, getHeadsForCategory } from '../allTaxCatalogue';
import { AllTaxItemsTable } from './AllTaxItemsTable';
import type { SelectedTaxpayerEntry } from './AllTaxTaxpayerStep';

interface AllTaxFormStepProps {
  selectedCategory: TaxHeadCategory;
  assessmentYear: string;
  selectedHeadId: string;
  amountInput: string;
  amountError: string;
  beneficiaryError: string;
  formBannerError: string;
  remarks: string;
  isAuthenticated?: boolean;
  isForBeneficiary: boolean;
  beneficiaryTin: string;
  beneficiaries: readonly Beneficiary[];
  activeTaxpayers?: readonly SelectedTaxpayerEntry[];
  selectedTaxpayerTin?: string;
  items: readonly PaymentLineItem[];
  totalAmount: number;
  onChangeCategory: () => void;
  onBackToTaxpayers?: () => void;
  onToggleBeneficiary: (checked: boolean) => void;
  onChangeBeneficiaryTin: (tin: string) => void;
  onChangeSelectedTaxpayerTin?: (tin: string) => void;
  onChangeAssessmentYear: (ay: string) => void;
  onChangeSelectedHeadId: (headId: string) => void;
  onChangeAmountInput: (amount: string) => void;
  onChangeRemarks: (remarks: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSaveDraft: () => void;
  onProceedToPreview: () => void;
}

export const AllTaxFormStep: React.FC<AllTaxFormStepProps> = (props) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [browseAllHeads, setBrowseAllHeads] = useState(props.selectedCategory === 'other_tax');
  const categorySpec = getAllTaxCategorySpec(props.selectedCategory);
  const isAuth = props.isAuthenticated ?? true;

  const headOptions = useMemo<AppAutocompleteOption[]>(() => {
    const heads = getHeadsForCategory(props.selectedCategory, browseAllHeads);
    return heads.map((h) => ({
      value: h.id,
      label: `[${h.code}] ${isBn ? h.nameBn : h.nameEn}`,
      group: getAllTaxCategorySpec(h.category).titleEn,
      keywords: [h.code, h.nameEn, h.nameBn],
    }));
  }, [browseAllHeads, isBn, props.selectedCategory]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold">{isBn ? 'কর খাত ও পরিমাণ নির্ধারণ' : 'Configure Tax Payment Heads'}</h3>
          <p className="text-xs text-slate-500">{isBn ? categorySpec.titleBn : categorySpec.titleEn}</p>
        </div>
        <div className="flex items-center gap-2">
          {props.onBackToTaxpayers && (
            <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<ArrowLeft size={14} />} onClick={props.onBackToTaxpayers}>
              {isBn ? 'করদাতা পরিবর্তন' : 'Edit Taxpayers'}
            </AppButton>
          )}
          <AppButton actionType="secondary" surface="ghost" size="small" onClick={props.onChangeCategory}>
            {isBn ? 'বিভাগ পরিবর্তন' : 'Change Category'}
          </AppButton>
        </div>
      </div>

      {props.formBannerError && (
        <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
          {props.formBannerError}
        </div>
      )}

      {props.activeTaxpayers && props.activeTaxpayers.length > 0 && props.onChangeSelectedTaxpayerTin ? (
        <AppSelectField
          label={isBn ? 'খাতের জন্য করদাতা' : 'Taxpayer for this Line Item'}
          value={props.selectedTaxpayerTin ?? props.activeTaxpayers[0].tin}
          onChange={(e) => props.onChangeSelectedTaxpayerTin!(e.target.value)}
          options={props.activeTaxpayers.map((tp) => ({ value: tp.tin, label: `${tp.name} (TIN: ${tp.tin})` }))}
        />
      ) : (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
          <AppCheckbox checked={props.isForBeneficiary} onChange={(_, checked) => props.onToggleBeneficiary(checked)} label="Facilitate payment on behalf of a beneficiary (Family member / Client)" />
          {props.isForBeneficiary && (
            <AppSelectField
              label={t('selectBeneficiary')}
              value={props.beneficiaryTin}
              onChange={(e) => props.onChangeBeneficiaryTin(e.target.value)}
              error={Boolean(props.beneficiaryError)}
              helperText={props.beneficiaryError || t('selectBeneficiaryHelper')}
              options={[
                { value: '', label: t('selectBeneficiaryOption') },
                ...props.beneficiaries.map((b) => ({ value: b.tin, label: `${b.name} (TIN: ${b.tin} - ${b.relationship})` })),
              ]}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelectField
          label={t('assessmentYear')}
          value={props.assessmentYear}
          onChange={(e) => props.onChangeAssessmentYear(e.target.value)}
          helperText={t('assessmentYearHelper')}
          options={[{ value: '2025-2026', label: '2025-2026' }, { value: '2026-2027', label: '2026-2027' }, { value: '2024-2025', label: '2024-2025' }]}
        />
        <AppCurrencyField
          label={t('amountBdt')}
          value={props.amountInput}
          minAmount={100}
          decimalScale={2}
          onChange={(e) => props.onChangeAmountInput(e.target.value)}
          error={Boolean(props.amountError)}
          helperText={props.amountError || t('amountMinHelper', { amount: '100' })}
          required
        />
        <div className="md:col-span-2 space-y-2">
          <AppAutocomplete
            label={t('taxHead')}
            value={props.selectedHeadId || null}
            onChange={(val) => props.onChangeSelectedHeadId(val)}
            options={headOptions}
            helperText={t('taxHeadHelper')}
            disableClearable
          />
          {props.selectedCategory !== 'other_tax' && (
            <AppCheckbox
              checked={browseAllHeads}
              onChange={(_, checked) => setBrowseAllHeads(checked)}
              label={isBn ? 'অন্যান্য বিভাগের কর খাতসহ সব খাত দেখুন (সম্মিলিত পেমেন্ট)' : 'Show heads across all categories for combined payment'}
            />
          )}
        </div>
        <div className="md:col-span-2">
          <AppTextArea
            label={t('remarksOptional')}
            value={props.remarks}
            rows={3}
            onChange={(e) => props.onChangeRemarks(e.target.value)}
            placeholder={isBn ? 'বাংলা বা ইংরেজিতে চালানের মন্তব্য লিখুন...' : 'Enter multiline challan note in EN/BN...'}
            helperText={t('remarksHelper')}
          />
        </div>
      </div>

      <AppButton type="button" actionType="secondary" surface="soft" fullWidth previewRestricted startIcon={<Plus size={16} />} onClick={props.onAddItem} sx={{ borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
        {t('addHead')}
      </AppButton>

      <AllTaxItemsTable items={props.items} totalAmount={props.totalAmount} onRemoveItem={props.onRemoveItem} />

      <div className="flex flex-wrap gap-3 pt-4">
        {isAuth && (
          <AppButton actionType="secondary" previewRestricted onClick={props.onSaveDraft} sx={{ flex: '1 1 160px', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
            {t('saveDraft')}
          </AppButton>
        )}
        <AppButton actionType="primary" previewRestricted endIcon={<ArrowRight size={16} />} onClick={props.onProceedToPreview} sx={{ flex: '2 1 240px', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
          {t('proceedToPreview')}
        </AppButton>
      </div>
    </div>
  );
};
