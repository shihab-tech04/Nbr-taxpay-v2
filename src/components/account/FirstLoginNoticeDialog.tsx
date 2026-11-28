import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle } from 'lucide-react';
import type { FirstLoginNotice } from '../../shared/accountSession';
import { AppButton } from '../../design-system/buttons';
import { AppDialog } from '../../design-system/modals';

interface FirstLoginNoticeDialogProps {
  notices: readonly FirstLoginNotice[];
  onAcknowledge: (noticeId: string) => void;
  disablePortal?: boolean;
}

export const FirstLoginNoticeDialog: React.FC<FirstLoginNoticeDialogProps> = ({
  notices,
  onAcknowledge,
  disablePortal = false,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const current = notices[0];

  if (!current) return null;

  return (
    <AppDialog
      open
      disablePortal={disablePortal}
      onClose={() => onAcknowledge(current.id)}
      maxWidth="sm"
      id="first-login-notice-dialog"
      title={
        <div className="flex items-center gap-2.5">
          <Bell className="text-teal-700 dark:text-teal-400 shrink-0" size={20} />
          <span>{isBn ? current.titleBn : current.titleEn}</span>
        </div>
      }
      subtitle={
        isBn
          ? `অপেক্ষমাণ বিজ্ঞপ্তি: ${notices.length}টি · ${current.issuedAt}`
          : `Queued notice (${notices.length} remaining) · ${current.issuedAt}`
      }
      actions={
        <div className="flex items-center justify-end w-full">
          <AppButton
            actionType="primary"
            size="small"
            startIcon={<CheckCircle size={16} />}
            onClick={() => onAcknowledge(current.id)}
          >
            {notices.length > 1
              ? isBn
                ? 'বুঝেছি ও পরবর্তী'
                : 'Acknowledge & Next'
              : isBn
              ? 'বুঝেছি'
              : 'Acknowledge'}
          </AppButton>
        </div>
      }
    >
      <div data-testid="first-login-notice-body" className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
        {isBn ? current.bodyBn : current.bodyEn}
      </div>
    </AppDialog>
  );
};
