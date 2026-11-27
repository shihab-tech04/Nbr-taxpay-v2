import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppNumberField, AppSelectField, AppTextField } from '../../../design-system/forms';
import type { GiftFormErrors } from '../giftTaxLogic';

interface GiftTaxPartiesStepProps {
  donorTin: string;
  donorName: string;
  doneeTin: string;
  doneeName: string;
  relationship: string;
  errors: GiftFormErrors;
  onChangeDonorTin: (val: string) => void;
  onChangeDonorName: (val: string) => void;
  onChangeDoneeTin: (val: string) => void;
  onChangeDoneeName: (val: string) => void;
  onChangeRelationship: (val: string) => void;
  onNext: () => void;
}

export const GiftTaxPartiesStep: React.FC<GiftTaxPartiesStepProps> = ({
  donorTin,
  donorName,
  doneeTin,
  doneeName,
  relationship,
  errors,
  onChangeDonorTin,
  onChangeDonorName,
  onChangeDoneeTin,
  onChangeDoneeName,
  onChangeRelationship,
  onNext,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <h3 className="text-lg font-bold">Stage 1: Donor & Donee Information</h3>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Donor (Payer & Credit Receiver)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppNumberField
              label={t('giftDonorTin')}
              maxLength={12}
              value={donorTin}
              onChange={(e) => onChangeDonorTin(e.target.value)}
              placeholder={t('tinPlaceholder')}
              error={Boolean(errors.donorTin)}
              helperText={errors.donorTin || t('tinHelperText')}
              required
            />
            <AppTextField
              label={t('donorName')}
              value={donorName}
              onChange={(e) => onChangeDonorName(e.target.value)}
              placeholder={t('donorNamePlaceholder')}
              error={Boolean(errors.donorName)}
              helperText={errors.donorName || t('donorNameHelper')}
              required
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Donee (Recipient)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AppNumberField
              label={t('giftDoneeTin')}
              maxLength={12}
              value={doneeTin}
              onChange={(e) => onChangeDoneeTin(e.target.value)}
              placeholder={t('tinPlaceholder')}
              error={Boolean(errors.doneeTin)}
              helperText={errors.doneeTin || t('tinHelperText')}
              required
            />
            <AppTextField
              label={t('doneeName')}
              value={doneeName}
              onChange={(e) => onChangeDoneeName(e.target.value)}
              placeholder={t('doneeNamePlaceholder')}
              error={Boolean(errors.doneeName)}
              helperText={errors.doneeName || t('doneeNameHelper')}
              required
            />
            <AppSelectField
              label={t('relationship')}
              value={relationship}
              onChange={(e) => onChangeRelationship(e.target.value)}
              helperText={t('relationshipHelper')}
              options={[
                { value: 'Father', label: t('father') },
                { value: 'Mother', label: t('mother') },
                { value: 'Spouse', label: t('spouse') },
                { value: 'Son', label: t('son') },
                { value: 'Daughter', label: t('daughter') },
                { value: 'Siblings', label: t('siblings') },
                { value: 'Others', label: t('others') },
              ]}
            />
          </div>
        </div>
      </div>

      <AppButton
        type="button"
        actionType="primary"
        size="large"
        fullWidth
        previewRestricted
        endIcon={<ArrowRight size={16} />}
        onClick={onNext}
        sx={{ fontSize: '0.75rem' }}
      >
        Proceed to Gift Details
      </AppButton>
    </div>
  );
};
