import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';

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
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disablePortal={disablePortal}
      aria-labelledby="app-dialog-title"
      slotProps={{
        paper: {
          className: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden ${className}`,
        },
      }}
    >
      {title && (
        <DialogTitle
          id="app-dialog-title"
          className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800"
        >
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <AppIconButton
            size="small"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={18} />
          </AppIconButton>
        </DialogTitle>
      )}
      <DialogContent className="p-6 overflow-y-auto">{children}</DialogContent>
      {actions && (
        <DialogActions className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
