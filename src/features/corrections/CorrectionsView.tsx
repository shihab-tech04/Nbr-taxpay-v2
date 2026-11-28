import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../shared/AppContext';
import { FileText, Plus } from 'lucide-react';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppTextField, AppSelectField, AppTextArea } from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';
import { AppTable, type AppColumn } from '../../design-system/tables';
import { AppDialog } from '../../design-system/modals';
import type { CorrectionRequest } from '../../types/tax';

export const CorrectionsView: React.FC = () => {
  const { t } = useTranslation();
  const { corrections, addCorrection, transactions } = useApp();

  const [challanNumber, setChallanNumber] = useState('');
  const [reason, setReason] = useState('Incorrect Assessment Year');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ challanNumber?: string; description?: string }>({});

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isRestrictedOperationAllowed('correction_write')) return;
    const nextErrors: { challanNumber?: string; description?: string } = {};
    if (!challanNumber.trim()) {
      nextErrors.challanNumber = t('requiredChallanError');
    }
    if (!description.trim()) {
      nextErrors.description = t('requiredCorrectionExplanationError');
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const trimmedChallan = challanNumber.trim();
    const tx = transactions.find((tr) => tr.challanNumber === trimmedChallan);
    addCorrection({
      transactionId: tx ? tx.id : 'tx-custom',
      challanNumber: trimmedChallan,
      reason,
      description: description.trim(),
    });
    setChallanNumber('');
    setDescription('');
    setShowModal(false);
  };

  const columns: AppColumn<CorrectionRequest>[] = [
    {
      key: 'challanNumber',
      header: 'Challan Number & Reason',
      sortable: true,
      cell: (c) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{c.challanNumber}</div>
          <div className="text-[11px] text-teal-700">{c.reason}</div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (c) => <span className="text-slate-600 dark:text-slate-300">{c.description}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (c) => <span className="font-mono">{c.createdAt}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => (
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
          {c.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-teal-700" size={28} /> {t('corrections')}
            </h1>
            <p className="text-xs text-slate-500">Apply for challan corrections and track NBR administrative review status.</p>
          </div>
          <AppButton
            actionType="primary"
            size="small"
            previewRestricted
            startIcon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
            sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
          >
            {t('submitCorrection')}
          </AppButton>
        </div>

        <AppDialog
          open={showModal}
          onClose={() => {
            setErrors({});
            setShowModal(false);
          }}
          title={t('submitCorrection')}
          actions={
            <div className="flex justify-end gap-3 w-full">
              <AppButton
                type="button"
                actionType="secondary"
                size="small"
                onClick={() => {
                  setErrors({});
                  setShowModal(false);
                }}
              >
                {t('cancel')}
              </AppButton>
              <AppButton
                type="button"
                actionType="primary"
                size="small"
                previewRestricted
                onClick={() => handleSubmit()}
              >
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
                  htmlInput: {
                    maxLength: 32,
                    className: 'font-mono',
                  },
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

        <AppTable
          columns={columns}
          data={corrections}
          keyExtractor={(c) => c.id}
          emptyMessage="No correction applications found."
        />
      </div>
    </div>
  );
};
