import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { ArrowRight, Eye, Plus } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import { AppButton } from '../../design-system/buttons';
import { AppTable, type AppColumn } from '../../design-system/tables';
import { DashboardMetrics } from './components/DashboardMetrics';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user, transactions, beneficiaries, drafts } = useApp();

  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const totalPaid = transactions
    .filter((tx) => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  const columns: AppColumn<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: 'Ref & Challan',
      sortable: true,
      cell: (tx) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white font-mono">{tx.transactionRef}</div>
          <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      cell: (tx) => (
        <div>
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{tx.category.replace(/_/g, ' ')}</span>
          {tx.beneficiaryName && <div className="text-[11px] text-teal-600">For: {tx.beneficiaryName}</div>}
        </div>
      ),
    },
    {
      key: 'paymentChannel',
      header: 'Channel',
      sortable: true,
      cell: (tx) => <span className="font-semibold text-slate-700 dark:text-slate-300">{tx.paymentChannel}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Amount (BDT)',
      align: 'right',
      sortable: true,
      cell: (tx) => <span className="font-mono font-semibold text-slate-900 dark:text-white">৳ {tx.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (tx) => (
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
          {tx.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      cell: (tx) => (
        <AppButton
          actionType="secondary"
          size="small"
          startIcon={<Eye size={14} />}
          onClick={() => setSelectedTx(tx)}
          sx={{
            minHeight: 30,
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            color: 'primary.main',
            borderColor: 'divider',
          }}
        >
          Receipt
        </AppButton>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Card Header */}
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
          </div>
        </div>

        {/* Summary Metric Cards */}
        <DashboardMetrics
          totalPaid={totalPaid}
          completedChallansCount={transactions.filter((tx) => tx.status === 'Completed').length}
          draftsCount={drafts.length}
          beneficiariesCount={beneficiaries.length}
        />

        {/* Recent Payment Activity Table */}
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
              sx={{
                color: 'primary.main',
                '&:hover': { bgcolor: 'action.hover', textDecoration: 'underline' },
              }}
            >
              View All History
            </AppButton>
          </div>

          <AppTable
            columns={columns}
            data={transactions}
            keyExtractor={(tx) => tx.id}
            emptyMessage="No payment activities found."
          />
        </div>
      </div>

      <ReceiptModal
        open={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};
