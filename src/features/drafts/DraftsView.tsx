import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { FileText, Play, Trash2 } from 'lucide-react';
import { AppButton, AppIconButton } from '../../design-system/buttons';

export const DraftsView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { drafts, deleteDraft } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-teal-700" size={28} /> {t('drafts')}
          </h1>
          <p className="text-xs text-slate-500">Resume saved tax filing drafts and complete payments.</p>
        </div>

        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-500 text-xs">
              No saved payment drafts found.
            </div>
          ) : (
            drafts.map(d => (
              <div key={d.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base mb-1">{d.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">Last updated: {d.updatedAt} · Items: {d.items.length}</p>
                </div>
                <div className="flex items-center gap-3">
                  <AppButton
                    tone="primary"
                    size="small"
                    previewRestricted
                    startIcon={<Play size={14} />}
                    onClick={() => navigate('/all-taxes')}
                    sx={{ borderRadius: '12px', px: 2 }}
                  >
                    Resume
                  </AppButton>
                  <AppIconButton
                    tone="danger"
                    size="small"
                    previewRestricted
                    aria-label={`Delete draft ${d.title}`}
                    onClick={() => deleteDraft(d.id)}
                  >
                    <Trash2 size={16} />
                  </AppIconButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
