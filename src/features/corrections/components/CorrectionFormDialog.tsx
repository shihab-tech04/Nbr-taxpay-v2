import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppTextField, AppSelectField, AppTextArea } from '../../../design-system/forms';
import { AppButton } from '../../../design-system/buttons';
import { AppDialog } from '../../../design-system/modals';

interface CorrectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { challanNumber: string; reason: string; description: string }) => void;
}

export const CorrectionFormDialog: React.FC<CorrectionFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [challanNumber, setChallanNumber] = useState('');
  const [reason, setReason] = useState('Incorrect Assessment Year');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ challanNumber?: string; description?: string }>({});

  const isDirty = Boolean(challanNumber.trim() || description.trim());

  const handleClose = () => {
    setChallanNumber('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextErrors: { challanNumber?: string; description?: string } = {};
    if (!challanNumber.trim()) nextErrors.challanNumber = t('requiredChallanError');
    if (!description.trim()) nextErrors.description = t('requiredCorrectionExplanationError');
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      challanNumber: challanNumber.trim(),
      reason,
      description: description.trim(),
    });
    handleClose();
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={t('submitCorrection')}
      responsiveBottomSheet
      isDirty={isDirty}
      id="correction-form-dialog"
      actions={
        <div className="flex justify-end gap-3 w-full">
          <AppButton type="button" actionType="secondary" size="small" onClick={handleClose}>
            {t('cancel')}
          </AppButton>
          <AppButton type="button" actionType="primary" size="small" previewRestricted onClick={() => handleSubmit()}>
            {t('save')}
          </AppButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppTextField
            label={t('challanNumberLabel')}
            value={challanNumber}
            onChange={(e) => {
              setChallanNumber(e.target.value);
              if (errors.challanNumber) setErrors((prev) => ({ ...prev, challanNumber: undefined }));
            }}
            placeholder={t('challanPlaceholder')}
            error={Boolean(errors.challanNumber)}
            helperText={errors.challanNumber || t('challanHelper')}
            required
            slotProps={{
              htmlInput: { maxLength: 32, className: 'font-mono' },
            }}
          />
          <AppSelectField
            label={t('correctionReasonLabel')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            helperText={t('correctionReasonHelper')}
            options={[
              { value: 'Incorrect Assessment Year', label: t('reasonIncorrectAy') },
              { value: 'Typo in Taxpayer TIN', label: t('reasonTypoTin') },
              { value: 'Incorrect Tax Head Allocation', label: t('reasonIncorrectHead') },
              { value: 'Amount Adjustment', label: t('reasonAmountAdj') },
            ]}
          />
        </div>
        <AppTextArea
          label={t('correctionExplanationLabel')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          rows={3}
          placeholder={t('correctionExplanationPlaceholder')}
          error={Boolean(errors.description)}
          helperText={errors.description || t('correctionExplanationHelper')}
          required
        />
      </form>
    </AppDialog>
  );
};
