import React, { useId } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@mui/material';
import { ArrowLeft, X } from 'lucide-react';
import { AppIconButton } from '../buttons';
import { AppBottomSheet } from './AppBottomSheet';
import { DirtyCloseBanner } from './DirtyCloseBanner';
import { useDirtyCloseGuard, useModalFocusRestore } from './useModalHooks';

export interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  disablePortal?: boolean;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  isDirty?: boolean;
  confirmCloseMessage?: string;
  onBack?: () => void;
  backLabel?: string;
  showClose?: boolean;
  closeLabel?: string;
  dividers?: boolean;
  responsiveBottomSheet?: boolean;
  id?: string;
}

export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  className = '',
  disablePortal = false,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  isDirty = false,
  confirmCloseMessage,
  onBack,
  backLabel = 'Go back',
  showClose = true,
  closeLabel = 'Close dialog',
  dividers = false,
  responsiveBottomSheet = false,
  id,
}) => {
  const generatedId = useId();
  const titleId = id ? `${id}-title` : `dialog-title-${generatedId}`;
  const isMobileViewport = useMediaQuery('(max-width:639.95px)', { noSsr: true });
  const useSheet = responsiveBottomSheet && isMobileViewport && !disablePortal;

  useModalFocusRestore(open && !useSheet);

  const { showDiscardPrompt, requestClose, confirmDiscard, cancelDiscard } =
    useDirtyCloseGuard(open, isDirty, onClose, {
      disableBackdropClick,
      disableEscapeKeyDown,
    });

  if (useSheet) {
    return (
      <AppBottomSheet
        open={open}
        onClose={onClose}
        title={title}
        subtitle={subtitle}
        actions={actions}
        className={className}
        disablePortal={disablePortal}
        disableEscapeKeyDown={disableEscapeKeyDown}
        disableBackdropClick={disableBackdropClick}
        isDirty={isDirty}
        confirmCloseMessage={confirmCloseMessage}
        onBack={onBack}
        backLabel={backLabel}
        showClose={showClose}
        closeLabel={closeLabel}
        id={id}
      >
        {children}
      </AppBottomSheet>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => requestClose(reason)}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disablePortal={disablePortal}
      aria-labelledby={title ? titleId : undefined}
      slotProps={{
        paper: {
          className: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden ${className}`,
        },
      }}
    >
      {title && (
        <DialogTitle
          id={titleId}
          className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <AppIconButton size="small" aria-label={backLabel} onClick={onBack}>
                <ArrowLeft size={18} />
              </AppIconButton>
            )}
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                {title}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {showClose && (
            <AppIconButton
              size="small"
              aria-label={closeLabel}
              onClick={() => requestClose()}
            >
              <X size={18} />
            </AppIconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent dividers={dividers} className="p-6 overflow-y-auto">
        {showDiscardPrompt && (
          <DirtyCloseBanner
            message={confirmCloseMessage}
            onConfirmDiscard={confirmDiscard}
            onCancelDiscard={cancelDiscard}
          />
        )}
        {children}
      </DialogContent>
      {actions && (
        <DialogActions className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
