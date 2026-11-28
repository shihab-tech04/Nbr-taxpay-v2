import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppNumberField, AppSelectField, AppTextField, validateTin } from '../../../design-system/forms';
import { lookupTinIdentity } from '../../../shared/accountSession';
import type { Beneficiary, BeneficiaryList } from '../../../types/tax';
import { APPROVED_RELATIONSHIPS, RELATIONSHIP_I18N, type BeneficiaryFormErrors } from '../beneficiaryLogic';

interface BeneficiaryFormProps {
  formId?: string;
  name: string;
  tin: string;
  relationship: Beneficiary['relationship'];
  relationshipNote: string;
  listId: string;
  lists: readonly BeneficiaryList[];
  phone: string;
  errors: BeneficiaryFormErrors;
  onChangeName: (val: string) => void;
  onChangeTin: (val: string) => void;
  onChangeRelationship: (val: Beneficiary['relationship']) => void;
  onChangeRelationshipNote: (val: string) => void;
  onChangeListId: (val: string) => void;
  onChangePhone: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({
  formId = 'beneficiary-form',
  name, tin, relationship, relationshipNote, listId, lists, phone, errors,
  onChangeName, onChangeTin, onChangeRelationship, onChangeRelationshipNote, onChangeListId, onChangePhone, onSubmit,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const tinMatch = validateTin(tin).valid ? lookupTinIdentity(tin) : null;

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTextField
          label={t('beneficiaryNameOptional')}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder={t('beneficiaryNamePlaceholder')}
          error={Boolean(errors.name)}
          helperText={errors.name || t('beneficiaryNameOptionalHelper')}
        />
        <AppNumberField
          label={t('twelveDigitTin')}
          maxLength={12}
          value={tin}
          onChange={(e) => onChangeTin(e.target.value)}
          placeholder={t('tinPlaceholder')}
          error={Boolean(errors.tin)}
          helperText={errors.tin || (tinMatch ? `${isBn ? 'ডিরেক্টরি তথ্য:' : 'Directory hint:'} ${tinMatch.maskedNameHint}` : t('tinHelperText'))}
          required
        />
        <AppSelectField
          label={t('relationship')}
          value={relationship}
          required
          error={Boolean(errors.relationship)}
          helperText={errors.relationship || t('relationshipHelper')}
          onChange={(e) => onChangeRelationship(e.target.value as Beneficiary['relationship'])}
          options={APPROVED_RELATIONSHIPS.map((rel) => ({ value: rel, label: t(RELATIONSHIP_I18N[rel]) }))}
        />
        {relationship === 'Others' && (
          <AppTextField
            label={isBn ? 'কাস্টম সম্পর্ক উল্লেখ করুন' : 'Custom Relationship Tag'}
            value={relationshipNote}
            onChange={(e) => onChangeRelationshipNote(e.target.value)}
            placeholder={isBn ? 'যেমন: ব্যবসায়িক অংশীদার' : 'e.g. Business Partner'}
            error={Boolean(errors.relationshipNote)}
            helperText={errors.relationshipNote || (isBn ? '১–৮০ অক্ষরের মধ্যে লিখুন।' : 'Required (1–80 characters).')}
            required
          />
        )}
        <AppSelectField
          label={isBn ? 'তালিকা / গ্রুপ' : 'List / Group'}
          value={listId}
          onChange={(e) => onChangeListId(e.target.value)}
          options={[
            { value: '', label: isBn ? 'তালিকাবিহীন' : 'Unassigned' },
            ...lists.map((l) => ({ value: l.id, label: l.name })),
          ]}
        />
        <AppTextField
          label={t('phone')}
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder={t('phonePlaceholder')}
          error={Boolean(errors.phone)}
          helperText={errors.phone || (isBn ? 'ঐচ্ছিক (01XXXXXXXXX)।' : 'Optional (01XXXXXXXXX).')}
          slotProps={{ htmlInput: { inputMode: 'tel', maxLength: 15, autoComplete: 'tel' } }}
        />
      </div>
    </form>
  );
};
