import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { readScopedDomainData } from '../../shared/scopedDomainStorage';
import { Award, CheckCircle, FileText, Eye, RotateCcw } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { PaymentTransaction } from '../../types/tax';
import {
  AppDateRangeFilter,
  AppSearchField,
  isDateWithinInclusiveRange,
  type DateRangeFilterValue,
} from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';
import { AppToast } from '../../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';

export const HistoryView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, transactions, isAuthenticated, claimWalkInTransactionDetailed } = useApp();

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRangeFilterValue>({ from: '', to: '' });
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [certTx, setCertTx] = useState<PaymentTransaction | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const claimRef = searchParams.get('claimRef');
  const pendingWalkInTx = useMemo(() => {
    if (!isAuthenticated || !claimRef) return null;
    return readScopedDomainData('walkin').transactions.find((tx) => tx.transactionRef === claimRef) ?? null;
  }, [claimRef, isAuthenticated]);

  const handleExplicitClaim = () => {
    if (!pendingWalkInTx || !user.tin) return;
    const result = claimWalkInTransactionDetailed(pendingWalkInTx, user.tin);
    if (result.ok) {
      setClaimError(null);
      setSearchParams({});
      setToastMsg(isBn ? `${result.transaction.transactionRef} অ্যাকাউন্টে যুক্ত হয়েছে` : `Claimed ${result.transaction.transactionRef} into your account`);
    } else {
      setClaimError(
        result.reason === 'ownership_mismatch'
          ? isBn ? 'এই ওয়াক-ইন লেনদেনটি আপনার যাচাইকৃত টিআইএন বা মোবাইলের সাথে মেলে না।' : 'Claim rejected: walk-in payer ownership does not match your verified account.'
          : result.reason === 'duplicate_claim'
          ? isBn ? 'এই লেনদেনটি ইতিমধ্যে দাবি করা হয়েছে।' : 'Claim rejected: this walk-in transaction was already claimed.'
          : isBn ? 'ভুল, মেয়াদোত্তীর্ণ বা অযাচাইকৃত ওয়াক-ইন রেফারেন্স।' : 'Claim rejected: invalid, stale, or unverified walk-in reference.'
      );
    }
  };

  const normalizedQuery = search.trim().toLowerCase();
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      !normalizedQuery ||
      tx.transactionRef.toLowerCase().includes(normalizedQuery) ||
      tx.challanNumber.toLowerCase().includes(normalizedQuery) ||
      tx.category.toLowerCase().includes(normalizedQuery);
    return matchesSearch && isDateWithinInclusiveRange(tx.createdAt, dateRange);
  });

  const handlePayAgain = (tx: PaymentTransaction) => {
    const target = tx.category === 'gift_tax' ? '/gift-tax' : tx.category === 'travel_tax' ? '/travel-tax' : '/all-taxes';
    navigate(target, { state: { reuseTx: tx } });
  };

  const columns: AppColumn<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: isBn ? 'লেনদেন ও চালান' : 'Transaction & Challan',
      sortable: true,
      accessor: (tx) => tx.transactionRef,
      cell: (tx) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{tx.transactionRef}</div>
          <div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: isBn ? 'বিভাগ' : 'Category',
      sortable: true,
      accessor: (tx) => tx.category,
      cell: (tx) => <span className="font-medium capitalize">{tx.category.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'paymentChannel',
      header: isBn ? 'মাধ্যম' : 'Channel',
      sortable: true,
      accessor: (tx) => tx.paymentChannel,
      cell: (tx) => <span className="font-semibold">{tx.paymentChannel}</span>,
    },
    {
      key: 'totalAmount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (tx) => tx.totalAmount,
      cell: (tx) => <span className="font-mono font-bold text-teal-700 dark:text-teal-400">৳ {tx.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'createdAt',
      header: isBn ? 'তারিখ' : 'Date',
      sortable: true,
      accessor: (tx) => tx.createdAt,
      cell: (tx) => <span className="font-mono">{new Date(tx.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (tx) => (
        <div className="inline-flex items-center justify-end gap-1.5">
          <AppButton actionType="secondary" size="small" startIcon={<Eye size={14} />} onClick={() => setSelectedTx(tx)}>
            {isBn ? 'রসিদ' : 'Receipt'}
          </AppButton>
          {tx.status === 'Completed' && (
            <AppButton actionType="secondary" surface="soft" size="small" startIcon={<Award size={14} />} onClick={() => setCertTx(tx)}>
              {isBn ? 'সনদ' : 'Certificate'}
            </AppButton>
          )}
          <AppButton actionType="secondary" surface="soft" size="small" startIcon={<RotateCcw size={14} />} onClick={() => handlePayAgain(tx)}>
            {t('payAgain')}
          </AppButton>
        </div>
      ),
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } =
    useTableState(filtered, { columns, initialSort: { columnKey: 'createdAt', direction: 'desc' }, initialRowsPerPage: 10 });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-teal-700" size={28} /> {t('history')}</h1>
            <p className="text-xs text-slate-500">{isBn ? 'ইউআই পর্যালোচনার জন্য নমুনা পেমেন্ট রেকর্ড।' : 'Sample payment records for UI review only.'}</p>
          </div>
          <div className="w-full md:w-80">
            <AppSearchField label={t('searchHistoryLabel')} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder={t('searchHistoryPlaceholder')} helperText={t('searchHistoryHelper')} clearAriaLabel={t('clearSearch')} />
          </div>
        </div>

        {(claimError || (isAuthenticated && Boolean(claimRef) && !pendingWalkInTx)) && (
          <div role="alert" data-testid="walkin-claim-error" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
            <span>
              {claimError ||
                (isBn
                  ? 'ভুল, মেয়াদোত্তীর্ণ বা ইতিমধ্যে দাবিকৃত ওয়াক-ইন রেফারেন্স।'
                  : 'Claim rejected: invalid, stale, or already claimed walk-in reference.')}
            </span>
            <AppButton actionType="secondary" size="small" onClick={() => { setClaimError(null); setSearchParams({}); }}>
              {t('cancel')}
            </AppButton>
          </div>
        )}

        {pendingWalkInTx && (
          <div data-testid="walkin-claim-banner" className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-slate-900 dark:text-white block">
                {isBn ? 'ওয়াক-ইন লেনদেন অ্যাকাউন্টে যুক্ত করবেন?' : `Claim Walk-In Challan ${pendingWalkInTx.transactionRef}?`}
              </strong>
              <span className="text-slate-600 dark:text-slate-300">
                {pendingWalkInTx.challanNumber} · ৳ {pendingWalkInTx.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AppButton actionType="secondary" size="small" onClick={() => setSearchParams({})}>{t('cancel')}</AppButton>
              <AppButton actionType="primary" size="small" startIcon={<CheckCircle size={14} />} onClick={handleExplicitClaim}>
                {isBn ? 'অ্যাকাউন্টে যুক্ত করুন' : 'Claim Payment'}
              </AppButton>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <AppDateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        <AppTable columns={columns} data={pagedData} keyExtractor={(tx) => tx.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।' : 'No payment records found.'} />
      </div>

      <ReceiptModal open={Boolean(selectedTx)} onClose={() => setSelectedTx(null)} transaction={selectedTx} isAuthenticated={isAuthenticated} />
      <PaymentCertificateDialog open={Boolean(certTx)} onClose={() => setCertTx(null)} transaction={certTx} isAuthenticated={isAuthenticated} />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
