import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info } from 'lucide-react';
import { AppDialog } from './AppDialog';
import { AppButton } from '../buttons';

export interface AppConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'destructive' | 'default';
  loading?: boolean;
  disablePortal?: boolean;
  id?: string;
}

export const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  intent = 'default',
  loading = false,
  disablePortal = false,
  id,
}) => {
  const { t } = useTranslation();
  const isDestructive = intent === 'destructive';

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      disablePortal={disablePortal}
      id={id ?? 'app-confirm-dialog'}
      title={
        <div className="flex items-center gap-2">
          {isDestructive ? (
            <AlertTriangle className="size-5 text-rose-600" />
          ) : (
            <Info className="size-5 text-teal-600" />
          )}
          <span>{title}</span>
        </div>
      }
      actions={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <AppButton
            actionType="secondary"
            size="small"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel ?? t('cancel')}
          </AppButton>
          <AppButton
            actionType="primary"
            intent={isDestructive ? 'destructive' : 'default'}
            size="small"
            loading={loading}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel ?? (isDestructive ? t('delete') || 'Confirm' : t('confirm') || 'OK')}
          </AppButton>
        </div>
      }
    >
      <div className="text-sm text-slate-600 dark:text-slate-300">
        {message}
      </div>
    </AppDialog>
  );
};
