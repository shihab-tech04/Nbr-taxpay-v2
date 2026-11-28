import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../shared/AppContext';
import { ArrowRight, Award, Plus, User } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { FirstLoginNoticeDialog } from '../../components/account/FirstLoginNoticeDialog';
import { PaymentTransaction } from '../../types/tax';
import { AppButton } from '../../design-system/buttons';
import { DashboardMetrics } from './components/DashboardMetrics';
import { RecentPaymentsTable } from './components/RecentPaymentsTable';

export const DashboardView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const { user, isAuthenticated, unseenNotices, acknowledgeNotice, transactions, beneficiaries, drafts } = useApp();
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const totalPaid = transactions
    .filter((tx) => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                  Sample taxpayer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                TIN: <strong className="font-mono text-teal-700 dark:text-teal-400">{user.tin}</strong> · {user.circle} · {user.zone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <AppButton
              actionType="secondary"
              surface="outlined"
              size="small"
              startIcon={<User size={16} />}
              onClick={() => navigate('/profile')}
              sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
            >
              {t('profile') || 'View Profile'}
            </AppButton>
            <AppButton
              actionType="primary"
              size="small"
              previewRestricted
              startIcon={<Plus size={16} />}
              onClick={() => navigate('/all-taxes')}
              sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
            >
              New Tax Payment
            </AppButton>
            <AppButton
              actionType="secondary"
              surface="soft"
              size="small"
              onClick={() => navigate('/beneficiaries')}
              sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
            >
              Beneficiaries
            </AppButton>
            <AppButton
              actionType="secondary"
              surface="soft"
              size="small"
              startIcon={<Award size={16} />}
              onClick={() => navigate('/certificates')}
              sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
            >
              {isBn ? 'সনদসমূহ' : 'Certificates'}
            </AppButton>
          </div>
        </div>

        <DashboardMetrics
          totalPaid={totalPaid}
          completedChallansCount={transactions.filter((tx) => tx.status === 'Completed').length}
          draftsCount={drafts.length}
          beneficiariesCount={beneficiaries.length}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Payment Activities</h3>
              <p className="text-xs text-slate-500">Latest completed tax challans and transaction references.</p>
            </div>
            <AppButton
              actionType="secondary"
              surface="ghost"
              size="small"
              endIcon={<ArrowRight size={14} />}
              onClick={() => navigate('/history')}
              sx={{ color: 'primary.main', '&:hover': { bgcolor: 'action.hover', textDecoration: 'underline' } }}
            >
              View All History
            </AppButton>
          </div>

          <RecentPaymentsTable transactions={transactions} onSelectTx={setSelectedTx} />
        </div>
      </div>

      <ReceiptModal
        open={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        isAuthenticated={isAuthenticated}
      />

      <FirstLoginNoticeDialog notices={unseenNotices} onAcknowledge={acknowledgeNotice} />
    </div>
  );
};
