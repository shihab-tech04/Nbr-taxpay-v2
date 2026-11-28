import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppTable, useTableState, type AppColumn } from '../../../design-system/tables';
import type { PaymentTransaction } from '../../../types/tax';

interface RecentPaymentsTableProps {
  transactions: readonly PaymentTransaction[];
  onSelectTx: (tx: PaymentTransaction) => void;
}

export const RecentPaymentsTable: React.FC<RecentPaymentsTableProps> = ({
  transactions,
  onSelectTx,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const columns: AppColumn<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: isBn ? 'রেফারেন্স ও চালান' : 'Ref & Challan',
      sortable: true,
      accessor: (tx) => tx.transactionRef,
      cell: (tx) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white font-mono">{tx.transactionRef}</div>
          <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: isBn ? 'বিভাগ' : 'Category',
      sortable: true,
      accessor: (tx) => tx.category,
      cell: (tx) => (
        <div>
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{tx.category.replace(/_/g, ' ')}</span>
          {tx.beneficiaryName && <div className="text-[11px] text-teal-600 dark:text-teal-400">{isBn ? 'প্রাপক' : 'For'}: {tx.beneficiaryName}</div>}
        </div>
      ),
    },
    {
      key: 'paymentChannel',
      header: isBn ? 'মাধ্যম' : 'Channel',
      sortable: true,
      accessor: (tx) => tx.paymentChannel,
      cell: (tx) => <span className="font-semibold text-slate-700 dark:text-slate-300">{tx.paymentChannel}</span>,
    },
    {
      key: 'totalAmount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (tx) => tx.totalAmount,
      cell: (tx) => <span className="font-mono font-semibold text-slate-900 dark:text-white">৳ {tx.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: t('status'),
      sortable: true,
      accessor: (tx) => tx.status,
      cell: (tx) => (
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium">
          {tx.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: t('actions'),
      align: 'right',
      cell: (tx) => (
        <AppButton
          actionType="secondary"
          size="small"
          startIcon={<Eye size={14} />}
          onClick={() => onSelectTx(tx)}
          sx={(theme) => ({
            minHeight: 30,
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            color: theme.palette.mode === 'dark' ? '#5EEAD4' : 'primary.main',
            borderColor: 'divider',
          })}
        >
          {isBn ? 'রসিদ' : 'Receipt'}
        </AppButton>
      ),
    },
  ];

  const {
    sortState,
    handleSort,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    pagedData,
    totalRows,
  } = useTableState(transactions, {
    columns,
    initialSort: { columnKey: 'createdAt', direction: 'desc' },
    initialRowsPerPage: 5,
  });

  return (
    <AppTable
      columns={columns}
      data={pagedData}
      keyExtractor={(tx) => tx.id}
      sortState={sortState}
      onSort={handleSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      totalRows={totalRows}
      emptyMessage={isBn ? 'কোনো পেমেন্ট কার্যক্রম পাওয়া যায়নি।' : 'No payment activities found.'}
    />
  );
};
