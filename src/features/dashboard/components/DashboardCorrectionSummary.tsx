import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileEdit } from 'lucide-react';
import type { CorrectionRequest } from '../../../types/tax';
import { AppButton } from '../../../design-system/buttons';

interface DashboardCorrectionSummaryProps {
  corrections: CorrectionRequest[];
}

export const DashboardCorrectionSummary: React.FC<DashboardCorrectionSummaryProps> = ({ corrections }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();

  const activeCount = corrections.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const latest = corrections[0];

  return (
    <div
      data-testid="dashboard-correction-summary"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileEdit className="text-teal-700" size={18} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('correctionRequestsSummary')}</h3>
        </div>
        <p className="text-xs text-slate-500">
          {isBn
            ? `মোট ${corrections.length}টি আবেদন (${activeCount}টি পর্যালোচনাধীন)।`
            : `${corrections.length} total request(s) · ${activeCount} pending administrative review.`}
          {latest ? ` ${isBn ? 'সর্বশেষ:' : 'Latest:'} ${latest.ticketNumber || latest.challanNumber} (${latest.status})` : ''}
        </p>
      </div>
      <AppButton
        actionType="secondary"
        surface="outlined"
        size="small"
        endIcon={<ArrowRight size={14} />}
        onClick={() => navigate('/corrections')}
      >
        {t('viewCorrectionRequests')}
      </AppButton>
    </div>
  );
};
