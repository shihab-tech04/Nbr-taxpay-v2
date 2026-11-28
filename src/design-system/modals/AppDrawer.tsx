import React, { useId } from 'react';
import { Drawer } from '@mui/material';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';
import { useModalFocusRestore } from './useModalHooks';

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
  closeLabel = 'Close drawer',
  id,
}) => {
  const generatedId = useId();
  const titleId = id ? `${id}-title` : `drawer-title-${generatedId}`;

  useModalFocusRestore(open);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
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
          <div>
            <h3 id={titleId} className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <AppIconButton size="small" aria-label={closeLabel} onClick={onClose}>
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
