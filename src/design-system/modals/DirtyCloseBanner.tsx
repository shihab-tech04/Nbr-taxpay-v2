import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { AppButton } from '../buttons';

interface DirtyCloseBannerProps {
  message?: string;
  onConfirmDiscard: () => void;
  onCancelDiscard: () => void;
  onSaveDraft?: () => void;
  saveDraftLabel?: string;
  discardLabel?: string;
  cancelLabel?: string;
}

export const DirtyCloseBanner: React.FC<DirtyCloseBannerProps> = ({
  message,
  onConfirmDiscard,
  onCancelDiscard,
  onSaveDraft,
  saveDraftLabel,
  discardLabel,
  cancelLabel,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const defaultMsg = isBn
    ? 'আপনার অসংরক্ষিত পরিবর্তন রয়েছে। আপনি কি নিশ্চিতভাবে বন্ধ করতে চান?'
    : 'You have unsaved changes. Discard unfinished work and close?';

  const resolvedCancel =
    cancelLabel ?? (onSaveDraft ? (isBn ? 'বাতিল' : 'Cancel') : (isBn ? 'সম্পাদনা চালিয়ে যান' : 'Keep editing'));

  return (
    <div
      role="alert"
      data-testid="modal-dirty-guard"
      className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <span className="font-medium">{message ?? defaultMsg}</span>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
        {onSaveDraft && (
          <AppButton
            actionType="primary"
            size="small"
            data-testid="dirty-guard-save-draft"
            previewRestricted
            onClick={onSaveDraft}
          >
            {saveDraftLabel ?? (isBn ? 'খসড়া সংরক্ষণ' : 'Save Draft')}
          </AppButton>
        )}
        <AppButton
          actionType="primary"
          intent="destructive"
          size="small"
          data-testid="dirty-guard-discard"
          onClick={onConfirmDiscard}
        >
          {discardLabel ?? (isBn ? 'বাতিল করে বন্ধ করুন' : 'Discard')}
        </AppButton>
        <AppButton
          actionType="secondary"
          size="small"
          data-testid="dirty-guard-cancel"
          onClick={onCancelDiscard}
        >
          {resolvedCancel}
        </AppButton>
      </div>
    </div>
  );
};
