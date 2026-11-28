import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppCardButton } from '../../../design-system/buttons';

interface DashboardMetricsProps {
  totalPaid: number;
  completedChallansCount: number;
  draftsCount: number;
  beneficiariesCount: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalPaid,
  completedChallansCount,
  draftsCount,
  beneficiariesCount,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('totalPaidSummary')}</span>
        <div className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 font-mono">
          ৳ {totalPaid.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-500">Across {completedChallansCount} sample challans</p>
      </div>

      <AppCardButton
        onClick={() => navigate('/drafts')}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 hover:border-teal-500 transition-colors"
      >
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('activeDraftsCount')}</span>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
          {draftsCount}
        </div>
        <p className="text-[11px] text-slate-500">Pending payment drafts ready to complete</p>
      </AppCardButton>

      <AppCardButton
        onClick={() => navigate('/beneficiaries')}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 hover:border-teal-500 transition-colors"
      >
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('beneficiariesCount')}</span>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
          {beneficiariesCount}
        </div>
        <p className="text-[11px] text-slate-500">Illustrative family and client records</p>
      </AppCardButton>
    </div>
  );
};
