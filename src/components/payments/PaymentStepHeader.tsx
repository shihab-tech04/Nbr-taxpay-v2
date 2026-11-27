import React from 'react';

interface PaymentStepHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  stepIndicator?: string;
}

export const PaymentStepHeader: React.FC<PaymentStepHeaderProps> = ({
  title,
  subtitle,
  stepIndicator,
}) => (
  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2">{title}</h1>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
    {stepIndicator && (
      <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400 font-mono">
        <span>{stepIndicator}</span>
      </div>
    )}
  </div>
);
