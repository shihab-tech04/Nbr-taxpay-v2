import React, { useId } from 'react';
import { Drawer } from '@mui/material';
import { ArrowLeft, X } from 'lucide-react';
import { AppIconButton } from '../buttons';
import { DirtyCloseBanner } from './DirtyCloseBanner';
import { useDirtyCloseGuard, useModalFocusRestore } from './useModalHooks';

export interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  anchor?: 'left' | 'right';
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
  id?: string;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  anchor = 'right',
  className = '',
  disablePortal = false,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  isDirty = false,
  confirmCloseMessage,
  onBack,
  backLabel = 'Go back',
  showClose = true,
  closeLabel = 'Close drawer',
  id,
}) => {
  const generatedId = useId();
  const titleId = id ? `${id}-title` : `drawer-title-${generatedId}`;

  useModalFocusRestore(open);

  const { showDiscardPrompt, requestClose, confirmDiscard, cancelDiscard } =
    useDirtyCloseGuard(open, isDirty, onClose, {
      disableBackdropClick,
      disableEscapeKeyDown,
    });

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={(_event, reason) => requestClose(reason)}
      disablePortal={disablePortal}
      aria-labelledby={title ? titleId : undefined}
      slotProps={{
        paper: {
          className: `w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col ${className}`,
        },
      }}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <AppIconButton size="small" aria-label={backLabel} onClick={onBack}>
                <ArrowLeft size={18} />
              </AppIconButton>
            )}
            <div className="min-w-0">
              <h3 id={titleId} className="text-base font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {showClose && (
            <AppIconButton size="small" aria-label={closeLabel} onClick={() => requestClose()}>
              <X size={18} />
            </AppIconButton>
          )}
        </div>
      )}
      <div className="p-6 overflow-y-auto flex-1">
        {showDiscardPrompt && (
          <DirtyCloseBanner
            message={confirmCloseMessage}
            onConfirmDiscard={confirmDiscard}
            onCancelDiscard={cancelDiscard}
          />
        )}
        {children}
      </div>
      {actions && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {actions}
        </div>
      )}
    </Drawer>
  );
};
