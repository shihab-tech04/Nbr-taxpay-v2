import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, FileText, LogIn, MessageSquarePlus, Plus } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { formatCorrectionChanges } from '../../shared/correctionLogic';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { AppButton } from '../../design-system/buttons';
import { AppStateView } from '../../design-system/feedback';
import { AppDateRangeFilter, AppSearchField, AppSelectField, isDateWithinInclusiveRange, type DateRangeFilterValue } from '../../design-system/forms';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import { CorrectionRequestModal } from '../../components/corrections/CorrectionRequestModal';
import type { CorrectionRequest } from '../../types/tax';
import { CorrectionDetailDialog } from './components/CorrectionDetailDialog';
import { UnverifiedInquiriesSection } from './components/UnverifiedInquiriesSection';
import { UnverifiedInquiryDialog } from './components/UnverifiedInquiryDialog';

export const CorrectionsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, corrections, unverifiedInquiries } = useApp();

  const [applyOpen, setApplyOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRequest | null>(null);
  const [dismissedTicketId, setDismissedTicketId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRangeFilterValue>({ from: '', to: '' });

  const linkedTicketId = searchParams.get('ticketId')?.trim() || '';
  const linkedCorrection = useMemo(
    () => (linkedTicketId ? corrections.find((c) => c.id === linkedTicketId || c.ticketNumber === linkedTicketId) ?? null : null),
    [corrections, linkedTicketId]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return corrections.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!isDateWithinInclusiveRange(c.createdAt, dateRange)) return false;
      if (!q) return true;
      return (
        (c.ticketNumber ?? '').toLowerCase().includes(q) ||
        c.challanNumber.toLowerCase().includes(q) ||
        (c.transactionRef ?? '').toLowerCase().includes(q) ||
        formatCorrectionChanges(c, isBn).toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [corrections, dateRange, isBn, search, statusFilter]);

  const columns: AppColumn<CorrectionRequest>[] = [
    {
      key: 'challanNumber', header: isBn ? 'টিকিট ও রেফারেন্স' : 'Ticket & Reference', sortable: true, accessor: (c) => c.ticketNumber || c.challanNumber,
      cell: (c) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{c.ticketNumber || c.id}</div>
          <div className="text-[11px] text-slate-500 font-mono">{c.challanNumber}{c.transactionRef ? ` · ${c.transactionRef}` : ''}</div>
        </div>
      ),
    },
    {
      key: 'reason', header: t('requestedChangesLabel'),
      cell: (c) => (
        <div className="text-xs">
          <div className="font-medium text-teal-700 dark:text-teal-400">{formatCorrectionChanges(c, isBn)}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1">{c.description}</div>
        </div>
      ),
    },
    { key: 'createdAt', header: t('submissionDateLabel'), sortable: true, accessor: (c) => c.createdAt, cell: (c) => <span className="font-mono">{c.createdAt}</span> },
    {
      key: 'status', header: t('status'), sortable: true, accessor: (c) => c.status,
      cell: (c) => <span className="inline-block whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-medium">{c.status}</span>,
    },
    {
      key: 'actions', header: t('actions'), align: 'right',
      cell: (c) => <AppButton actionType="secondary" size="small" className="whitespace-nowrap" startIcon={<Eye size={14} />} onClick={() => setSelectedCorrection(c)}>{t('viewDetailsLabel')}</AppButton>,
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } = useTableState(filtered, {
    columns, initialSort: { columnKey: 'createdAt', direction: 'desc' }, initialRowsPerPage: 5,
  });

  const activeModalCorrection = selectedCorrection || (linkedCorrection && linkedTicketId !== dismissedTicketId ? linkedCorrection : null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-teal-700" size={28} /> {t('corrections')}</h1>
            <p className="text-xs text-slate-500">{isBn ? 'চালান সংশোধনের আবেদন করুন এবং অনুমোদনের অবস্থা দেখুন।' : 'Submit verified challan correction requests and track review status.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<MessageSquarePlus size={15} />} onClick={() => setInquiryOpen(true)}>{t('unverifiedInquiryAction')}</AppButton>
            {isAuthenticated && (
              <AppButton actionType="primary" size="small" previewRestricted startIcon={<Plus size={16} />} onClick={() => setApplyOpen(true)}>{t('applyForCorrection')}</AppButton>
            )}
          </div>
        </div>

        {!isAuthenticated ? (
          <AppStateView
            variant="empty"
            title={isBn ? 'যাচাইকৃত সংশোধনের জন্য সাইন ইন প্রয়োজন' : 'Sign in to submit verified challan corrections'}
            description={isBn ? 'অতিথি বা অজানা রেফারেন্সের জন্য আপনি নিচের অযাচাইকৃত সংশোধন অনুসন্ধান ব্যবহার করতে পারেন।' : 'Verified correction requests only apply to signed-in account challans. Use Unverified Correction Inquiry for guest or unrecognized references.'}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {!PUBLIC_PREVIEW && <AppButton actionType="primary" size="small" startIcon={<LogIn size={15} />} onClick={() => navigate('/login?returnTo=/corrections')}>{t('signIn')}</AppButton>}
                <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<MessageSquarePlus size={15} />} onClick={() => setInquiryOpen(true)}>{t('unverifiedInquiryAction')}</AppButton>
              </div>
            }
          />
        ) : (
          <>
            {linkedTicketId && !linkedCorrection && (
              <div role="alert" data-testid="corrections-ref-inaccessible" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
                <span>{isBn ? `সংযুক্ত আবেদন (${linkedTicketId}) বর্তমান অ্যাকাউন্টে উপলব্ধ নয়।` : `Linked correction request (${linkedTicketId}) is unavailable or belongs to another account.`}</span>
                <AppButton actionType="secondary" size="small" onClick={() => setSearchParams({})}>{t('close')}</AppButton>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppSearchField label={isBn ? 'সংশোধন অনুসন্ধান' : 'Search Corrections'} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder={isBn ? 'টিকিট, চালান বা কারণ...' : 'Ticket, challan ref, or change...'} clearAriaLabel={t('clearSearch')} />
                <AppSelectField label={t('status')} value={statusFilter} onChange={(e) => setStatusFilter(String(e.target.value))} options={[
                  { value: 'all', label: isBn ? 'সকল অবস্থা' : 'All Statuses' },
                  { value: 'Submitted', label: 'Submitted' }, { value: 'Under Review', label: 'Under Review' },
                  { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' },
                ]} />
              </div>
              <AppDateRangeFilter value={dateRange} onChange={setDateRange} />
            </div>

            <div className="hidden md:block">
              <AppTable columns={columns} data={pagedData} keyExtractor={(c) => c.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'কোনো সংশোধন আবেদন পাওয়া যায়নি।' : 'No correction requests found.'} />
            </div>
            <div className="md:hidden space-y-3" data-testid="corrections-mobile-cards">
              {pagedData.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="font-mono">{c.ticketNumber || c.id}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">{c.status}</span>
                  </div>
                  <div className="font-mono text-slate-500">{c.challanNumber} · {c.createdAt}</div>
                  <div className="text-teal-700 dark:text-teal-400 font-medium">{formatCorrectionChanges(c, isBn)}</div>
                  <AppButton actionType="secondary" size="small" fullWidth onClick={() => setSelectedCorrection(c)}>{t('viewDetailsLabel')}</AppButton>
                </div>
              ))}
            </div>
          </>
        )}

        <UnverifiedInquiriesSection inquiries={unverifiedInquiries} />
      </div>

      {isAuthenticated && <CorrectionRequestModal open={applyOpen} onClose={() => setApplyOpen(false)} />}
      <UnverifiedInquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      <CorrectionDetailDialog correction={activeModalCorrection} onClose={() => { setSelectedCorrection(null); if (linkedTicketId) { setDismissedTicketId(linkedTicketId); setSearchParams({}); } }} />
    </div>
  );
};
