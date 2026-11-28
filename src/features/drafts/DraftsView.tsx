import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, Play, Trash2 } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton, AppIconButton } from '../../design-system/buttons';
import { AppConfirmDialog } from '../../design-system/modals';
import { AppToast } from '../../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import type { PaymentDraft } from '../../types/tax';

export const DraftsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const { drafts, deleteDraft } = useApp();
  const [deleteTarget, setDeleteTarget] = useState<PaymentDraft | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
          {d.items.length} {isBn ? 'টি খাত' : 'head(s)'}
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
          <AppButton
            actionType="primary"
            size="small"
            previewRestricted
            startIcon={<Play size={14} />}
            onClick={() => navigate('/all-taxes')}
            sx={{ borderRadius: '8px', px: 2 }}
          >
            {isBn ? 'পুনরায় শুরু' : 'Resume'}
          </AppButton>
          <AppIconButton
            intent="destructive"
            size="small"
            previewRestricted
            aria-label={isBn ? `${d.title} খসড়া মুছুন` : `Delete draft ${d.title}`}
            onClick={() => {
              if (!isRestrictedOperationAllowed('draft_write')) return;
              setDeleteTarget(d);
            }}
          >
            <Trash2 size={16} />
          </AppIconButton>
        </div>
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
  } = useTableState(drafts, {
    columns,
    initialSort: { columnKey: 'updatedAt', direction: 'desc' },
    initialRowsPerPage: 5,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-teal-700" size={28} /> {t('drafts')}
          </h1>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'সংরক্ষিত কর প্রদানের খসড়া পুনরায় শুরু করুন এবং সম্পন্ন করুন।'
              : 'Resume saved tax filing drafts and complete payments.'}
          </p>
        </div>

        <AppTable
          columns={columns}
          data={pagedData}
          keyExtractor={(d) => d.id}
          sortState={sortState}
          onSort={handleSort}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalRows={totalRows}
          emptyMessage={isBn ? 'কোনো সংরক্ষিত খসড়া পাওয়া যায়নি।' : 'No saved payment drafts found.'}
        />
      </div>

      <AppConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        intent="destructive"
        title={isBn ? 'খসড়া মুছে ফেলবেন?' : 'Delete Draft?'}
        message={
          isBn
            ? `আপনি কি নিশ্চিতভাবে "${deleteTarget?.title ?? ''}" খসড়াটি মুছে ফেলতে চান?`
            : `Delete saved draft "${deleteTarget?.title ?? ''}"? This cannot be undone.`
        }
        confirmLabel={t('delete')}
        onConfirm={() => {
          if (!deleteTarget || !isRestrictedOperationAllowed('draft_write')) return;
          deleteDraft(deleteTarget.id);
          setToastMsg(isBn ? 'খসড়া মুছে ফেলা হয়েছে' : 'Draft deleted');
        }}
      />

      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
