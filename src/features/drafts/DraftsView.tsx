import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { FileText, Play, Trash2 } from 'lucide-react';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton, AppIconButton } from '../../design-system/buttons';
import { AppTable, type AppColumn } from '../../design-system/tables';
import type { PaymentDraft } from '../../types/tax';

export const DraftsView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { drafts, deleteDraft } = useApp();

  const columns: AppColumn<PaymentDraft>[] = [
    {
      key: 'title',
      header: 'Draft Title & Category',
      sortable: true,
      cell: (d) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{d.title}</div>
          <div className="text-[11px] text-teal-700 capitalize">{d.category.replace(/_/g, ' ')}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Configured Items',
      cell: (d) => <span className="font-mono text-slate-600 dark:text-slate-300">{d.items.length} head(s)</span>,
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      cell: (d) => <span className="font-mono text-slate-600 dark:text-slate-300">{d.updatedAt}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
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
            Resume
          </AppButton>
          <AppIconButton
            intent="destructive"
            size="small"
            previewRestricted
            aria-label={`Delete draft ${d.title}`}
            onClick={() => {
              if (!isRestrictedOperationAllowed('draft_write')) return;
              deleteDraft(d.id);
            }}
          >
            <Trash2 size={16} />
          </AppIconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-teal-700" size={28} /> {t('drafts')}
          </h1>
          <p className="text-xs text-slate-500">Resume saved tax filing drafts and complete payments.</p>
        </div>

        <AppTable
          columns={columns}
          data={drafts}
          keyExtractor={(d) => d.id}
          emptyMessage="No saved payment drafts found."
        />
      </div>
    </div>
  );
};
