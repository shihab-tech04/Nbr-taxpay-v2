import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { FileText, Eye, RotateCcw } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import { AppSearchField } from '../../design-system/forms';

export const HistoryView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { transactions } = useApp();

  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const filtered = transactions.filter(tx => 
    tx.transactionRef.toLowerCase().includes(search.toLowerCase()) ||
    tx.challanNumber.toLowerCase().includes(search.toLowerCase()) ||
    tx.category.toLowerCase().includes(search.toLowerCase())
  );

  const handlePayAgain = (tx: PaymentTransaction) => {
    navigate('/all-taxes');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-teal-700" size={28} /> {t('history')}
            </h1>
            <p className="text-xs text-slate-500">Sample payment records for UI review only.</p>
          </div>
          <div className="w-full md:w-80">
            <AppSearchField
              label={t('searchHistoryLabel')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder={t('searchHistoryPlaceholder')}
              helperText={t('searchHistoryHelper')}
              clearAriaLabel={t('clearSearch')}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-4">Transaction & Challan</th>
                <th className="p-4">Category</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-bold font-mono text-slate-900 dark:text-white">{tx.transactionRef}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
                  </td>
                  <td className="p-4 font-medium capitalize">{tx.category.replace(/_/g, ' ')}</td>
                  <td className="p-4 font-semibold">{tx.paymentChannel}</td>
                  <td className="p-4 font-mono font-bold text-teal-700">৳ {tx.totalAmount.toLocaleString()}</td>
                  <td className="p-4 font-mono">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-lg font-medium inline-flex items-center gap-1"
                    >
                      <Eye size={14} /> Receipt
                    </button>
                    <button
                      onClick={() => handlePayAgain(tx)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium inline-flex items-center gap-1"
                    >
                      <RotateCcw size={14} /> Pay Again
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
