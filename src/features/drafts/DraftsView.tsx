import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Play, Trash2 } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton, AppIconButton } from '../../design-system/buttons';
import { AppConfirmDialog, AppDialog } from '../../design-system/modals';
import { AppToast } from '../../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import type { PaymentDraft } from '../../types/tax';

export const DraftsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { drafts, deleteDraft } = useApp();
  const [deleteTarget, setDeleteTarget] = useState<PaymentDraft | null>(null);
  const [dismissedDraftParam, setDismissedDraftParam] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const linkedDraftId = searchParams.get('draftId')?.trim() || '';
  const linkedDraft = useMemo(
    () => (linkedDraftId ? drafts.find((d) => d.id === linkedDraftId) ?? null : null),
    [drafts, linkedDraftId]
  );

  const resumeDraft = (d: PaymentDraft) => {
    const targetRoute = d.category === 'travel_tax' ? '/travel-tax' : d.category === 'gift_tax' ? '/gift-tax' : '/all-taxes';
    navigate(targetRoute, { state: { draftId: d.id } });
  };

  const columns: AppColumn<PaymentDraft>[] = [
    {
      key: 'title',
      header: isBn ? 'খসড়ার শিরোনাম ও ধরন' : 'Draft Title & Category',
      sortable: true,
      accessor: (d) => d.title,
      cell: (d) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{d.title}</div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400 capitalize">{d.category.replace(/_/g, ' ')}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: isBn ? 'নির্বাচিত খাত' : 'Configured Items',
      sortable: true,
      accessor: (d) => d.items.length,
      cell: (d) => (
        <span className="font-mono text-slate-600 dark:text-slate-300">
          {d.category === 'travel_tax'
            ? `${d.travelDraft?.passengers.length ?? 0} ${isBn ? 'জন যাত্রী' : 'passenger(s)'}`
            : d.category === 'gift_tax'
              ? `${d.giftDraft?.donor?.name ?? '—'} → ${d.giftDraft?.donee?.name ?? '—'}`
              : `${d.items.length} ${isBn ? 'টি খাত' : 'head(s)'}`}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: isBn ? 'সর্বশেষ হালনাগাদ' : 'Last Updated',
      sortable: true,
      accessor: (d) => d.updatedAt,
      cell: (d) => <span className="font-mono text-slate-600 dark:text-slate-300">{d.updatedAt}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (d) => (
        <div className="flex items-center justify-end gap-2">
          <AppButton actionType="primary" size="small" previewRestricted startIcon={<Play size={14} />} onClick={() => resumeDraft(d)} sx={{ borderRadius: '8px', px: 2 }}>
            {isBn ? 'পুনরায় শুরু' : 'Resume'}
          </AppButton>
          <AppIconButton intent="destructive" size="small" previewRestricted aria-label={isBn ? `${d.title} খসড়া মুছুন` : `Delete draft ${d.title}`} onClick={() => { if (isRestrictedOperationAllowed('draft_write')) setDeleteTarget(d); }}>
            <Trash2 size={16} />
          </AppIconButton>
        </div>
      ),
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } = useTableState(drafts, {
    columns, initialSort: { columnKey: 'updatedAt', direction: 'desc' }, initialRowsPerPage: 5,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-teal-700" size={28} /> {t('drafts')}</h1>
          <p className="text-xs text-slate-500">
            {isBn ? 'সংরক্ষিত কর প্রদানের খসড়া পুনরায় শুরু করুন এবং সম্পন্ন করুন।' : 'Resume saved tax filing drafts and complete payments.'}
          </p>
        </div>

        {linkedDraftId && !linkedDraft && (
          <div role="alert" data-testid="drafts-ref-inaccessible" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
            <span>{isBn ? `সংযুক্ত খসড়া (${linkedDraftId}) বর্তমান অ্যাকাউন্টে উপলব্ধ নয় বা মুছে ফেলা হয়েছে।` : `Linked draft (${linkedDraftId}) is unavailable or does not belong to the active account.`}</span>
            <AppButton actionType="secondary" size="small" onClick={() => setSearchParams({})}>{isBn ? 'বন্ধ করুন' : 'Dismiss'}</AppButton>
          </div>
        )}

        <AppTable columns={columns} data={pagedData} keyExtractor={(d) => d.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'কোনো সংরক্ষিত খসড়া পাওয়া যায়নি।' : 'No saved payment drafts found.'} />
      </div>

      <AppDialog
        open={Boolean(linkedDraft && linkedDraftId !== dismissedDraftParam)}
        onClose={() => { setDismissedDraftParam(linkedDraftId); setSearchParams({}); }}
        title={linkedDraft?.title ?? t('drafts')}
        subtitle={linkedDraft ? `${linkedDraft.category.replace(/_/g, ' ')} · ${linkedDraft.updatedAt}` : undefined}
        maxWidth="sm"
        id="draft-detail-dialog"
        actions={
          <div className="flex justify-end gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={() => { setDismissedDraftParam(linkedDraftId); setSearchParams({}); }}>{t('close')}</AppButton>
            {linkedDraft && (
              <AppButton actionType="primary" size="small" previewRestricted startIcon={<Play size={14} />} onClick={() => resumeDraft(linkedDraft)}>
                {isBn ? 'পুনরায় শুরু' : 'Resume'}
              </AppButton>
            )}
          </div>
        }
      >
        {linkedDraft && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono space-y-1">
              <div><strong>ID:</strong> {linkedDraft.id}</div>
              <div><strong>{isBn ? 'সর্বশেষ হালনাগাদ:' : 'Updated:'}</strong> {linkedDraft.updatedAt}</div>
              {linkedDraft.items.map((item, idx) => (
                <div key={`${item.headId}-${idx}`} className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>[{item.headCode}] {isBn ? item.headNameBn : item.headNameEn} ({item.assessmentYear})</span>
                  <strong>৳ {item.amount.toLocaleString()}</strong>
                </div>
              ))}
              {linkedDraft.travelDraft && (
                <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                  {linkedDraft.travelDraft.travelMode} · {linkedDraft.travelDraft.departurePort || '—'} → {linkedDraft.travelDraft.destination || '—'} ({linkedDraft.travelDraft.passengers.length} {isBn ? 'জন' : 'passenger(s)'})
                </div>
              )}
              {linkedDraft.giftDraft && (
                <div className="pt-1 border-t border-slate-200 dark:border-slate-700 space-y-0.5">
                  <div>{isBn ? 'পক্ষে (দাতা):' : 'On Behalf Of (Donor):'} {linkedDraft.giftDraft.donor?.name ?? '—'} → {isBn ? 'মাধ্যমে (গ্রহীতা):' : 'Through (Donee):'} {linkedDraft.giftDraft.donee?.name ?? '—'} ({linkedDraft.giftDraft.relationshipTag || linkedDraft.giftDraft.donee?.relationshipTag || linkedDraft.giftDraft.relationship || linkedDraft.giftDraft.donee?.relationship || '—'})</div>
                  {linkedDraft.giftDraft.giftDate && <div>{t('giftDate')}: {linkedDraft.giftDraft.giftDate}</div>}
                  {linkedDraft.giftDraft.remarks && <div>{t('giftRemarksOptional')}: {linkedDraft.giftDraft.remarks}</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </AppDialog>

      <AppConfirmDialog
        open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} intent="destructive"
        title={isBn ? 'খসড়া মুছে ফেলবেন?' : 'Delete Draft?'}
        message={isBn ? `আপনি কি নিশ্চিতভাবে "${deleteTarget?.title ?? ''}" খসড়াটি মুছে ফেলতে চান?` : `Delete saved draft "${deleteTarget?.title ?? ''}"? This cannot be undone.`}
        confirmLabel={t('delete')}
        onConfirm={() => { if (deleteTarget && isRestrictedOperationAllowed('draft_write')) { deleteDraft(deleteTarget.id); setToastMsg(isBn ? 'খসড়া মুছে ফেলা হয়েছে' : 'Draft deleted'); } }}
      />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
