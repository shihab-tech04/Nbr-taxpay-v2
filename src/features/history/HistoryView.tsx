import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { FileText, Eye, RotateCcw } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import {
  AppDateRangeFilter,
  AppSearchField,
  isDateWithinInclusiveRange,
  type DateRangeFilterValue,
} from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';
import { AppTable, type AppColumn } from '../../design-system/tables';

export const HistoryView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { transactions } = useApp();

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRangeFilterValue>({ from: '', to: '' });
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const normalizedQuery = search.trim().toLowerCase();
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      !normalizedQuery ||
      tx.transactionRef.toLowerCase().includes(normalizedQuery) ||
      tx.challanNumber.toLowerCase().includes(normalizedQuery) ||
      tx.category.toLowerCase().includes(normalizedQuery);
    return matchesSearch && isDateWithinInclusiveRange(tx.createdAt, dateRange);
  });

  const handlePayAgain = () => {
    navigate('/all-taxes');
  };

  const columns: AppColumn<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: 'Transaction & Challan',
      sortable: true,
      cell: (tx) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{tx.transactionRef}</div>
          <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      cell: (tx) => <span className="font-medium capitalize">{tx.category.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'paymentChannel',
      header: 'Channel',
      sortable: true,
      cell: (tx) => <span className="font-semibold">{tx.paymentChannel}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      cell: (tx) => <span className="font-mono font-bold text-teal-700">৳ {tx.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (tx) => <span className="font-mono">{new Date(tx.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (tx) => (
        <div className="inline-flex items-center justify-end gap-2">
          <AppButton
            actionType="secondary"
            size="small"
            startIcon={<Eye size={14} />}
            onClick={() => setSelectedTx(tx)}
            sx={{ minHeight: 30, px: 1.5, py: 0.5, borderRadius: '8px', color: 'primary.main', borderColor: 'divider' }}
          >
            Receipt
          </AppButton>
          <AppButton
            actionType="secondary"
            surface="soft"
            size="small"
            startIcon={<RotateCcw size={14} />}
            onClick={handlePayAgain}
            sx={{ minHeight: 30, px: 1.5, py: 0.5, borderRadius: '8px' }}
          >
            Pay Again
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
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
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder={t('searchHistoryPlaceholder')}
              helperText={t('searchHistoryHelper')}
              clearAriaLabel={t('clearSearch')}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <AppDateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        <AppTable
          columns={columns}
          data={filtered}
          keyExtractor={(tx) => tx.id}
          emptyMessage="No payment records found."
        />
      </div>

      <ReceiptModal
        open={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};
