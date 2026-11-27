import React from 'react';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchor?: 'left' | 'right';
  className?: string;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  className = '',
}) => {
  if (!open) return null;

  const positionClass = anchor === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-drawer-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 flex"
    >
      <div className="flex-1" onClick={onClose} />
      <div
        className={`w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col ${positionClass} ${className}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 id="app-drawer-title" className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <AppIconButton size="small" aria-label="Close drawer" onClick={onClose}>
            <X size={18} />
          </AppIconButton>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
