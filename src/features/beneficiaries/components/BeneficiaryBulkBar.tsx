import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderInput, Trash2, X } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppAutocomplete } from '../../../design-system/forms';
import { AppConfirmDialog, AppDialog } from '../../../design-system/modals';
import type { BeneficiaryList } from '../../../types/tax';

interface BeneficiaryBulkBarProps {
  selectedCount: number;
  lists: readonly BeneficiaryList[];
  onClearSelection: () => void;
  onConfirmMove: (targetListId?: string) => void;
  onConfirmDelete: () => void;
}

export const BeneficiaryBulkBar: React.FC<BeneficiaryBulkBarProps> = ({
  selectedCount,
  lists,
  onClearSelection,
  onConfirmMove,
  onConfirmDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string>('');

  if (selectedCount === 0) return null;

  const listOptions = [
    { value: '', label: isBn ? 'তালিকাবিহীন' : 'Unassigned' },
    ...lists.map((l) => ({ value: l.id, label: l.name })),
  ];

  return (
    <>
      <div
        data-testid="beneficiary-bulk-bar"
        className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs"
      >
        <div className="flex items-center gap-2 font-semibold text-teal-900 dark:text-teal-200">
          <span>{t('bulkSelectedCount', { count: selectedCount })}</span>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<X size={13} />} onClick={onClearSelection}>
            {t('cancel')}
          </AppButton>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton
            actionType="secondary"
            surface="soft"
            size="small"
            previewRestricted
            data-testid="beneficiary-bulk-move-btn"
            startIcon={<FolderInput size={14} />}
            onClick={() => { setTargetListId(lists[0]?.id ?? ''); setMoveOpen(true); }}
          >
            {t('bulkMoveAction')}
          </AppButton>
          <AppButton
            actionType="secondary"
            intent="destructive"
            size="small"
            previewRestricted
            data-testid="beneficiary-bulk-delete-btn"
            startIcon={<Trash2 size={14} />}
            onClick={() => setDeleteOpen(true)}
          >
            {t('bulkDeleteAction')}
          </AppButton>
        </div>
      </div>

      <AppDialog
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        title={isBn ? 'নির্বাচিত প্রাপকদের তালিকায় সরান' : 'Move Selected Beneficiaries'}
        maxWidth="xs"
        id="bulk-move-beneficiary-dialog"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {isBn ? `${selectedCount} জন নির্বাচিত বেনিফিশিয়ারির জন্য নতুন তালিকা বেছে নিন:` : `Choose destination list for ${selectedCount} selected beneficiary(ies):`}
          </p>
          <AppAutocomplete
            label={isBn ? 'গন্তব্য তালিকা' : 'Destination List'}
            value={targetListId}
            disableClearable
            options={listOptions}
            onChange={(val) => setTargetListId(val)}
          />
          <div className="flex justify-end gap-2">
            <AppButton actionType="secondary" size="small" onClick={() => setMoveOpen(false)}>{t('cancel')}</AppButton>
            <AppButton
              actionType="primary"
              size="small"
              previewRestricted
              onClick={() => { onConfirmMove(targetListId || undefined); setMoveOpen(false); }}
            >
              {t('bulkMoveAction')}
            </AppButton>
          </div>
        </div>
      </AppDialog>

      <AppConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        intent="destructive"
        title={isBn ? 'নির্বাচিত বেনিফিশিয়ারি মুছে ফেলবেন?' : 'Delete Selected Beneficiaries?'}
        message={
          isBn
            ? `${selectedCount} জন বেনিফিশিয়ারি তালিকা থেকে মুছে ফেলা হবে। পূর্বের পেমেন্ট রেকর্ড সংরক্ষিত থাকবে।`
            : `Remove ${selectedCount} selected beneficiary(ies)? Historical payment records will remain preserved.`
        }
        confirmLabel={t('delete')}
        onConfirm={() => { onConfirmDelete(); setDeleteOpen(false); }}
      />
    </>
  );
};
