import React from 'react';
import { X } from 'lucide-react';
import { AppIconButton } from '../buttons';

interface AppBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full h-full" onClick={onClose} />
      <div
        className={`absolute bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] ${className}`}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1" />
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
          <h3 id="app-sheet-title" className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <AppIconButton size="small" aria-label="Close sheet" onClick={onClose}>
            <X size={18} />
          </AppIconButton>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
