import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { AppButton } from '../buttons';

interface DirtyCloseBannerProps {
  message?: string;
  onConfirmDiscard: () => void;
  onCancelDiscard: () => void;
}

export const DirtyCloseBanner: React.FC<DirtyCloseBannerProps> = ({
  message,
  onConfirmDiscard,
  onCancelDiscard,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const defaultMsg = isBn
    ? 'আপনার অসংরক্ষিত পরিবর্তন রয়েছে। আপনি কি নিশ্চিতভাবে বন্ধ করতে চান?'
    : 'You have unsaved changes. Discard unfinished work and close?';

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
      <div className="flex items-center justify-end gap-2 shrink-0">
        <AppButton actionType="secondary" size="small" onClick={onCancelDiscard}>
          {isBn ? 'সম্পাদনা চালিয়ে যান' : 'Keep editing'}
        </AppButton>
        <AppButton
          actionType="primary"
          intent="destructive"
          size="small"
          onClick={onConfirmDiscard}
        >
          {isBn ? 'বাতিল করুন' : 'Discard'}
        </AppButton>
      </div>
    </div>
  );
};
