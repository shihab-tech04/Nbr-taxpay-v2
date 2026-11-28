import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppNumberField, AppSelectField, AppTextField } from '../../../design-system/forms';
import type { Beneficiary } from '../../../types/tax';

type RelationshipType = Beneficiary['relationship'];

interface BeneficiaryFormProps {
  formId?: string;
  name: string;
  tin: string;
  relationship: RelationshipType;
  phone: string;
  errors: { name?: string; tin?: string; phone?: string };
  onChangeName: (val: string) => void;
  onChangeTin: (val: string) => void;
  onChangeRelationship: (val: RelationshipType) => void;
  onChangePhone: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({
  formId = 'beneficiary-form',
  name,
  tin,
  relationship,
  phone,
  errors,
  onChangeName,
  onChangeTin,
  onChangeRelationship,
  onChangePhone,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTextField
          label={t('name')}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder={t('beneficiaryNamePlaceholder')}
          error={Boolean(errors.name)}
          helperText={errors.name || t('beneficiaryNameHelper')}
          required
        />
        <AppNumberField
          label={t('twelveDigitTin')}
          maxLength={12}
          value={tin}
          onChange={(e) => onChangeTin(e.target.value)}
          placeholder={t('tinPlaceholder')}
          error={Boolean(errors.tin)}
          helperText={errors.tin || t('tinHelperText')}
          required
        />
        <AppSelectField
          label={t('relationship')}
          value={relationship}
          onChange={(e) => onChangeRelationship(e.target.value as RelationshipType)}
          helperText={t('relationshipHelper')}
          options={[
            { value: 'Father', label: t('father') },
            { value: 'Mother', label: t('mother') },
            { value: 'Siblings', label: t('siblings') },
            { value: 'Son', label: t('son') },
            { value: 'Daughter', label: t('daughter') },
            { value: 'Spouse', label: t('spouse') },
            { value: 'Friends', label: t('friends') },
            { value: 'Clients', label: t('clients') },
            { value: 'Others', label: t('others') },
          ]}
        />
        <AppTextField
          label={t('phone')}
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder={t('phonePlaceholder')}
          error={Boolean(errors.phone)}
          helperText={errors.phone || t('phoneHelper')}
          slotProps={{
            htmlInput: {
              inputMode: 'tel',
              maxLength: 15,
              autoComplete: 'tel',
            },
          }}
          required
        />
      </div>
    </form>
  );
};
