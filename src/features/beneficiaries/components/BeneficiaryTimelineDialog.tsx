import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Eye } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppDateRangeFilter, AppSelectField, isDateWithinInclusiveRange, type DateRangeFilterValue } from '../../../design-system/forms';
import { AppDialog } from '../../../design-system/modals';
import { AppTable, useTableState, type AppColumn } from '../../../design-system/tables';
import type { Beneficiary, PaymentTransaction } from '../../../types/tax';
import { formatBeneficiaryDisplayTag, getBeneficiaryTimelineEntries, type BeneficiaryTimelineEntry } from '../beneficiaryLogic';

interface BeneficiaryTimelineDialogProps {
  beneficiary: Beneficiary | null;
  transactions: readonly PaymentTransaction[];
  ownerScope: string;
  onClose: () => void;
  onViewReceipt: (tx: PaymentTransaction) => void;
  onViewCertificate: (tx: PaymentTransaction) => void;
}

export const BeneficiaryTimelineDialog: React.FC<BeneficiaryTimelineDialogProps> = ({
  beneficiary, transactions, ownerScope, onClose, onViewReceipt, onViewCertificate,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ayFilter, setAyFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRangeFilterValue>({ from: '', to: '' });

  const allEntries = useMemo(
    () => (beneficiary ? getBeneficiaryTimelineEntries(transactions, ownerScope, beneficiary.tin) : []),
    [beneficiary, ownerScope, transactions]
  );

  const filtered = useMemo(() => allEntries.filter((entry) => {
    if (categoryFilter !== 'all' && entry.transaction.category !== categoryFilter) return false;
    if (ayFilter !== 'all' && !entry.assessmentYears.includes(ayFilter)) return false;
    return isDateWithinInclusiveRange(entry.transaction.createdAt, dateRange);
  }), [allEntries, ayFilter, categoryFilter, dateRange]);

  const totalPaid = filtered.reduce((sum, e) => sum + e.allocatedAmount, 0);

  const columns: AppColumn<BeneficiaryTimelineEntry>[] = [
    {
      key: 'date',
      header: isBn ? 'তারিখ ও রেফারেন্স' : 'Date & Ref',
      sortable: true,
      accessor: (e) => e.transaction.createdAt,
      cell: (e) => (
        <div>
          <div className="font-mono font-bold text-slate-900 dark:text-white">{e.transaction.transactionRef}</div>
          <div className="text-[11px] text-slate-500 font-mono">{new Date(e.transaction.createdAt).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      key: 'headSummary',
      header: isBn ? 'কর খাত' : 'Tax Head(s)',
      cell: (e) => <span className="text-xs">{e.headSummary}</span>,
    },
    {
      key: 'allocatedAmount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (e) => e.allocatedAmount,
      cell: (e) => <span className="font-mono font-bold text-teal-700 dark:text-teal-400">৳ {e.allocatedAmount.toLocaleString()}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (e) => (
        <div className="inline-flex gap-1.5">
          <AppButton actionType="secondary" size="small" startIcon={<Eye size={13} />} onClick={() => onViewReceipt(e.transaction)}>
            {isBn ? 'রসিদ' : 'Receipt'}
          </AppButton>
          {e.transaction.status === 'Completed' && (
            <AppButton actionType="secondary" surface="soft" size="small" startIcon={<Award size={13} />} onClick={() => onViewCertificate(e.transaction)}>
              {isBn ? 'সনদ' : 'Certificate'}
            </AppButton>
          )}
        </div>
      ),
    },
  ];

  const { sortState, handleSort, pagedData, pagination, handlePageChange, handleRowsPerPageChange, totalRows } = useTableState(filtered, {
    columns, initialSort: { columnKey: 'date', direction: 'desc' }, initialRowsPerPage: 5,
  });

  if (!beneficiary) return null;
  const tagLabel = formatBeneficiaryDisplayTag(beneficiary, t);
  const ayOptions = [...new Set(allEntries.flatMap((e) => e.assessmentYears))];

  return (
    <AppDialog
      open={Boolean(beneficiary)}
      onClose={onClose}
      title={`${beneficiary.name.trim() || beneficiary.tin} · ${tagLabel}`}
      maxWidth="md"
      responsiveBottomSheet
      id="beneficiary-timeline-dialog"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono">
          <span>TIN: <strong>{beneficiary.tin}</strong></span>
          <span>{isBn ? 'আপনার পরিশোধিত মোট:' : 'Total Paid by Signed-In Payer:'} <strong className="text-teal-700 dark:text-teal-400">৳ {totalPaid.toLocaleString()}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelectField label={isBn ? 'বিভাগ' : 'Category'} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={[
            { value: 'all', label: isBn ? 'সব বিভাগ' : 'All Categories' },
            { value: 'tax_with_return', label: 'Tax with Return' }, { value: 'advance_tax', label: 'Advance Tax' },
            { value: 'gift_tax', label: 'Gift Tax' }, { value: 'other_tax', label: 'Other Tax' },
          ]} />
          <AppSelectField label={t('assessmentYear')} value={ayFilter} onChange={(e) => setAyFilter(e.target.value)} options={[
            { value: 'all', label: isBn ? 'সব কর বর্ষ' : 'All Assessment Years' },
            ...ayOptions.map((ay) => ({ value: ay, label: ay })),
          ]} />
        </div>

        <AppDateRangeFilter value={dateRange} onChange={setDateRange} />

        <AppTable columns={columns} data={pagedData} keyExtractor={(e) => e.transaction.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'এই প্রাপকের জন্য কোনো লেনদেন পাওয়া যায়নি।' : 'No payment records found for this beneficiary under your account.'} />
      </div>
    </AppDialog>
  );
};
