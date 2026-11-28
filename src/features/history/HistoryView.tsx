import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { readScopedDomainData } from '../../shared/scopedDomainStorage';
import { Award, Eye, FileText, RotateCcw } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { PaymentTransaction } from '../../types/tax';
import { AppDateRangeFilter, AppSearchField, isDateWithinInclusiveRange, type DateRangeFilterValue } from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';
import { AppToast } from '../../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import { HistoryBanners } from './HistoryBanners';

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
  const linkedRef = searchParams.get('ref')?.trim() || '';
  const pendingWalkInTx = useMemo(() => (isAuthenticated && claimRef ? readScopedDomainData('walkin').transactions.find((tx) => tx.transactionRef === claimRef) ?? null : null), [claimRef, isAuthenticated]);
  const linkedRefTx = useMemo(() => (linkedRef ? transactions.find((tx) => tx.transactionRef === linkedRef) ?? null : null), [linkedRef, transactions]);

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

  const normalizedQuery = (search.trim() || linkedRef).toLowerCase();
  const filtered = transactions.filter((tx) => (!normalizedQuery || tx.transactionRef.toLowerCase().includes(normalizedQuery) || tx.challanNumber.toLowerCase().includes(normalizedQuery) || tx.category.toLowerCase().includes(normalizedQuery)) && isDateWithinInclusiveRange(tx.createdAt, dateRange));

  const handlePayAgain = (tx: PaymentTransaction) => navigate(tx.category === 'gift_tax' ? '/gift-tax' : tx.category === 'travel_tax' ? '/travel-tax' : '/all-taxes', { state: { reuseTx: tx } });

  const columns: AppColumn<PaymentTransaction>[] = [
    { key: 'transactionRef', header: isBn ? 'লেনদেন ও চালান' : 'Transaction & Challan', sortable: true, accessor: (tx) => tx.transactionRef, cell: (tx) => <div><div className="font-bold font-mono text-slate-900 dark:text-white">{tx.transactionRef}</div><div className="text-[11px] text-slate-500 font-mono">{tx.challanNumber}</div></div> },
    { key: 'category', header: isBn ? 'বিভাগ' : 'Category', sortable: true, accessor: (tx) => tx.category, cell: (tx) => <span className="font-medium capitalize">{tx.category.replace(/_/g, ' ')}</span> },
    { key: 'paymentChannel', header: isBn ? 'মাধ্যম' : 'Channel', sortable: true, accessor: (tx) => tx.paymentChannel, cell: (tx) => <span className="font-semibold">{tx.paymentChannel === 'Zero-Tax' ? (isBn ? 'শূন্য-কর' : 'Zero-Tax') : tx.paymentChannel}</span> },
    { key: 'totalAmount', header: t('amountBdt'), align: 'right', sortable: true, accessor: (tx) => tx.totalAmount, cell: (tx) => <span className="font-mono font-bold text-teal-700 dark:text-teal-400">৳ {tx.totalAmount.toLocaleString()}</span> },
    { key: 'createdAt', header: isBn ? 'তারিখ' : 'Date', sortable: true, accessor: (tx) => tx.createdAt, cell: (tx) => <span className="font-mono">{new Date(tx.createdAt).toLocaleDateString()}</span> },
    {
      key: 'actions', header: t('actions'), align: 'right',
      cell: (tx) => (
        <div className="inline-flex items-center justify-end gap-1.5">
          <AppButton actionType="secondary" size="small" startIcon={<Eye size={14} />} onClick={() => setSelectedTx(tx)}>{isBn ? 'রসিদ' : 'Receipt'}</AppButton>
          {tx.status === 'Completed' && <AppButton actionType="secondary" surface="soft" size="small" startIcon={<Award size={14} />} onClick={() => setCertTx(tx)}>{isBn ? 'সনদ' : 'Certificate'}</AppButton>}
          <AppButton actionType="secondary" surface="soft" size="small" startIcon={<RotateCcw size={14} />} onClick={() => handlePayAgain(tx)}>{t('payAgain')}</AppButton>
        </div>
      ),
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } = useTableState(filtered, { columns, initialSort: { columnKey: 'createdAt', direction: 'desc' }, initialRowsPerPage: 10 });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-teal-700" size={28} /> {t('history')}</h1>
            <p className="text-xs text-slate-500">{isBn ? 'ইউআই পর্যালোচনার জন্য নমুনা পেমেন্ট রেকর্ড।' : 'Sample payment records for UI review only.'}</p>
          </div>
          <div className="w-full md:w-80"><AppSearchField label={t('searchHistoryLabel')} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder={t('searchHistoryPlaceholder')} helperText={t('searchHistoryHelper')} clearAriaLabel={t('clearSearch')} /></div>
        </div>
        <HistoryBanners linkedRef={linkedRef} linkedRefTx={linkedRefTx} onSelectTx={setSelectedTx} onClearParams={() => setSearchParams({})} claimRef={claimRef} isAuthenticated={isAuthenticated} pendingWalkInTx={pendingWalkInTx} claimError={claimError} onClearClaimError={() => { setClaimError(null); setSearchParams({}); }} onExplicitClaim={handleExplicitClaim} />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"><AppDateRangeFilter value={dateRange} onChange={setDateRange} /></div>
        <AppTable columns={columns} data={pagedData} keyExtractor={(tx) => tx.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।' : 'No payment records found.'} />
      </div>
      <ReceiptModal open={Boolean(selectedTx)} onClose={() => setSelectedTx(null)} transaction={selectedTx} isAuthenticated={isAuthenticated} />
      <PaymentCertificateDialog open={Boolean(certTx)} onClose={() => setCertTx(null)} transaction={certTx} isAuthenticated={isAuthenticated} />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
