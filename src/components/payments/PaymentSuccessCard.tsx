import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';

interface PaymentSuccessCardProps {
  title: string;
  subtitle: string;
  details?: React.ReactNode;
  onViewReceipt: () => void;
  onReturnDashboard: () => void;
}

export const PaymentSuccessCard: React.FC<PaymentSuccessCardProps> = ({
  title,
  subtitle,
  details,
  onViewReceipt,
  onReturnDashboard,
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
      <CheckCircle size={36} />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>

    {details}

    <div className="flex justify-center gap-4 pt-4">
      <AppButton
        actionType="primary"
        onClick={onViewReceipt}
        sx={{ borderRadius: '12px', px: 3, py: 1.5, fontSize: '0.75rem' }}
      >
        View Sample Receipt
      </AppButton>
      <AppButton
        actionType="secondary"
        onClick={onReturnDashboard}
        sx={{ borderRadius: '12px', px: 3, py: 1.5, fontSize: '0.75rem' }}
      >
        Return to Dashboard
      </AppButton>
    </div>
  </div>
);
