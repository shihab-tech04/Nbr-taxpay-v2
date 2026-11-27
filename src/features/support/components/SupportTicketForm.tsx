import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextArea, AppTextField } from '../../../design-system/forms';
import type { SupportTicket } from '../../../types/tax';

type SupportCategory = SupportTicket['category'];

interface SupportTicketFormProps {
  subject: string;
  category: SupportCategory;
  message: string;
  errors: { subject?: string; message?: string };
  onChangeSubject: (val: string) => void;
  onChangeCategory: (val: SupportCategory) => void;
  onChangeMessage: (val: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  subject,
  category,
  message,
  errors,
  onChangeSubject,
  onChangeCategory,
  onChangeMessage,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
    >
      <h3 className="text-base font-bold">Create Support Ticket</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTextField
          label={t('supportSubjectLabel')}
          value={subject}
          onChange={(e) => onChangeSubject(e.target.value)}
          placeholder={t('supportSubjectPlaceholder')}
          error={Boolean(errors.subject)}
          helperText={errors.subject || t('supportSubjectHelper')}
          required
        />
        <AppSelectField
          label={t('supportCategoryLabel')}
          value={category}
          onChange={(e) => onChangeCategory(e.target.value as SupportCategory)}
          helperText={t('supportCategoryHelper')}
          options={[
            { value: 'Payment Issue', label: t('catPaymentIssue') },
            { value: 'Tax Assessment', label: t('catTaxAssessment') },
            { value: 'Technical', label: t('catTechnical') },
            { value: 'Other', label: t('catOther') },
          ]}
        />
      </div>
      <AppTextArea
        label={t('supportMessageLabel')}
        value={message}
        onChange={(e) => onChangeMessage(e.target.value)}
        rows={3}
        placeholder={t('supportMessagePlaceholder')}
        error={Boolean(errors.message)}
        helperText={errors.message || t('supportMessageHelper')}
        required
      />
      <div className="flex justify-end gap-3">
        <AppButton type="button" actionType="secondary" size="small" onClick={onCancel}>
          {t('cancel')}
        </AppButton>
        <AppButton type="submit" actionType="primary" size="small" previewRestricted>
          {t('save')}
        </AppButton>
      </div>
    </form>
  );
};
