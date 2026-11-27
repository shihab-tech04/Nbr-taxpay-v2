import React from 'react';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className = '',
}) => {
  if (!open) return null;

  const widthClass =
    maxWidth === 'sm'
      ? 'max-w-sm'
      : maxWidth === 'lg'
      ? 'max-w-3xl'
      : maxWidth === 'xl'
      ? 'max-w-5xl'
      : 'max-w-lg';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full ${widthClass} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] ${className}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 id="app-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <AppIconButton
            size="small"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={18} />
          </AppIconButton>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
