import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Bell, Check, FileEdit, FileWarning, Receipt } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import type { AppNotification } from '../../types/tax';

interface NotificationItemCardProps {
  item: AppNotification;
  onMarkRead: (id: string) => void;
  onOpenTarget: (item: AppNotification) => void;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  onMarkRead,
  onOpenTarget,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const isUnread = !item.readAt;

  const KindIcon =
    item.kind === 'payment'
      ? Receipt
      : item.kind === 'draft'
      ? FileEdit
      : item.kind === 'correction'
      ? FileWarning
      : Bell;

  return (
    <article
      data-testid={`notification-card-${item.id}`}
      className={`rounded-2xl border p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
        isUnread
          ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isUnread
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <KindIcon size={18} />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white break-words">
              {isBn ? item.titleBn : item.titleEn}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isUnread
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isUnread ? t('unreadBadge') : t('readBadge')}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 break-words">
            {isBn ? item.bodyBn : item.bodyEn}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>{new Date(item.createdAt).toLocaleString()}</span>
            {item.assessmentYear && <span>AY {item.assessmentYear}</span>}
            {typeof item.amount === 'number' && <span>৳ {item.amount.toLocaleString()}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {isUnread && (
          <AppButton
            actionType="secondary"
            surface="outlined"
            size="small"
            startIcon={<Check size={14} />}
            onClick={() => onMarkRead(item.id)}
          >
            {t('markAsRead')}
          </AppButton>
        )}
        {item.targetRoute && (
          <AppButton
            actionType="primary"
            size="small"
            endIcon={<ArrowUpRight size={14} />}
            onClick={() => onOpenTarget(item)}
          >
            {t('openNotificationTarget')}
          </AppButton>
        )}
      </div>
    </article>
  );
};
