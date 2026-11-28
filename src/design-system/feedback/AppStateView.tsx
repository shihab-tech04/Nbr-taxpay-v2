import React from 'react';
import { AlertCircle, CheckCircle2, FileQuestion, RefreshCw } from 'lucide-react';
import { AppButton } from '../buttons';

export type StateViewVariant = 'empty' | 'error' | 'success' | 'loading';

export interface AppStateViewProps {
  variant?: StateViewVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const AppStateView: React.FC<AppStateViewProps> = ({
  variant = 'empty',
  title,
  description,
  icon,
  action,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'error':
        return <AlertCircle className="size-10 text-rose-500 dark:text-rose-400" />;
      case 'success':
        return <CheckCircle2 className="size-10 text-emerald-500 dark:text-emerald-400" />;
      case 'loading':
        return <RefreshCw className="size-10 text-teal-600 animate-spin" />;
      case 'empty':
      default:
        return <FileQuestion className="size-10 text-slate-400 dark:text-slate-500" />;
    }
  };

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-md mx-auto my-6 space-y-4 ${className}`}
    >
      <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800/80 shadow-sm">
        {icon ?? getDefaultIcon()}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {description}
          </p>
        )}
      </div>
      {(action || onRetry) && (
        <div className="pt-2 flex items-center justify-center gap-2">
          {onRetry && (
            <AppButton
              actionType="secondary"
              size="small"
              startIcon={<RefreshCw size={14} />}
              onClick={onRetry}
            >
              {retryLabel}
            </AppButton>
          )}
          {action}
        </div>
      )}
    </div>
  );
};
