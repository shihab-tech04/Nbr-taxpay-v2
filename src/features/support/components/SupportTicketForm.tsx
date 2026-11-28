import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppSelectField, AppTextArea, AppTextField } from '../../../design-system/forms';
import type { SupportTicket } from '../../../types/tax';

type SupportCategory = SupportTicket['category'];

interface SupportTicketFormProps {
  formId?: string;
  subject: string;
  category: SupportCategory;
  message: string;
  errors: { subject?: string; message?: string };
  onChangeSubject: (val: string) => void;
  onChangeCategory: (val: SupportCategory) => void;
  onChangeMessage: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  formId = 'support-ticket-form',
  subject,
  category,
  message,
  errors,
  onChangeSubject,
  onChangeCategory,
  onChangeMessage,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
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
    </form>
  );
};
