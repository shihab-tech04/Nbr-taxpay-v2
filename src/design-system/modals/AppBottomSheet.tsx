import React from 'react';
import { Drawer } from '@mui/material';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';

export interface AppBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  disablePortal?: boolean;
}

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  className = '',
  disablePortal = false,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disablePortal={disablePortal}
      slotProps={{
        paper: {
          className: `w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] ${className}`,
        },
      }}
    >
      <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1" />
      {title && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <AppIconButton size="small" aria-label="Close sheet" onClick={onClose}>
            <X size={18} />
          </AppIconButton>
        </div>
      )}
      <div className="p-6 overflow-y-auto flex-1">{children}</div>
      {actions && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          {actions}
        </div>
      )}
    </Drawer>
  );
};
