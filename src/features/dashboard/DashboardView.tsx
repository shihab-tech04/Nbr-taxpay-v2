import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { 
  User, ShieldCheck, FileText, Plane, Gift, 
  ArrowRight, Download, Eye, Plus, CheckCircle 
} from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';

export const DashboardView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, transactions, beneficiaries, drafts } = useApp();

  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const totalPaid = transactions
    .filter(tx => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

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
                  Verified Taxpayer
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                TIN: <strong className="font-mono text-teal-700 dark:text-teal-400">{user.tin}</strong> · {user.circle} · {user.zone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/all-taxes')}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={16} /> New Tax Payment
            </button>
            <button
              onClick={() => navigate('/beneficiaries')}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Manage Beneficiaries ({beneficiaries.length})
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('totalPaidSummary')}</span>
            <div className="text-3xl font-bold font-mono text-teal-700 dark:text-teal-400">
              ৳ {totalPaid.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">Across {transactions.filter(t => t.status === 'Completed').length} verified NBR challans</p>
          </div>

          <div 
            onClick={() => navigate('/drafts')}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 cursor-pointer hover:border-teal-500 transition-colors"
          >
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('activeDraftsCount')}</span>
            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {drafts.length}
            </div>
            <p className="text-[11px] text-slate-500">Saved payment drafts awaiting checkout</p>
          </div>

          <div 
            onClick={() => navigate('/beneficiaries')}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 cursor-pointer hover:border-teal-500 transition-colors"
          >
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('beneficiariesCount')}</span>
            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {beneficiaries.length}
            </div>
            <p className="text-[11px] text-slate-500">Family members & clients mapped securely</p>
          </div>
        </div>

        {/* Recent Payment Activity Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{t('recentActivity')}</h3>
            <button 
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              View All History <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3">Ref & Challan</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Amount (BDT)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white font-mono">{tx.transactionRef}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{tx.category.replace(/_/g, ' ')}</span>
                      {tx.beneficiaryName && <div className="text-[11px] text-teal-600">For: {tx.beneficiaryName}</div>}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{tx.paymentChannel}</td>
                    <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">৳ {tx.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
