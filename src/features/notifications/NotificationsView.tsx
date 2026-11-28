import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, LogIn, RefreshCw } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppSkeleton, AppStateView } from '../../design-system/feedback';
import { useApp } from '../../shared/AppContext';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import type { AppNotification } from '../../types/tax';
import { NotificationItemCard } from './NotificationItemCard';

export const NotificationsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const {
    isAuthenticated,
    notifications,
    unreadNotificationCount,
    notificationsError,
    retryLoadNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return undefined;
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-14 px-6">
        <div className="max-w-2xl mx-auto">
          <AppStateView
            variant="empty"
            title={t('notificationsSignInRequired')}
            description={
              isBn
                ? 'সাইন-ইন না করলে কোনো ব্যক্তিগত বিজ্ঞপ্তি প্রদর্শিত হয় না।'
                : 'Account notifications remain isolated behind TIN authentication.'
            }
            action={
              !PUBLIC_PREVIEW ? (
                <AppButton actionType="primary" startIcon={<LogIn size={16} />} onClick={() => navigate('/login?returnTo=/notifications')}>
                  {t('signIn')}
                </AppButton>
              ) : undefined
            }
          />
        </div>
      </div>
    );
  }

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.readAt) : notifications;

  const handleOpenTarget = (item: AppNotification) => {
    if (!item.readAt) markNotificationRead(item.id);
    if (item.targetRoute) navigate(item.targetRoute);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="text-teal-700" size={26} />
              <span>{t('notifications')}</span>
              {unreadNotificationCount > 0 && (
                <span data-testid="notifications-unread-badge" className="px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-xs font-mono">
                  {unreadNotificationCount}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500">
              {isBn ? 'আপনার অ্যাকাউন্টের পেমেন্ট, খসড়া এবং সংশোধন সংক্রান্ত হালনাগাদ।' : 'Account-isolated payment confirmations, draft reminders, and correction updates.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<RefreshCw size={14} />} onClick={() => { retryLoadNotifications(); setIsLoading(true); }}>
              {t('refreshAction')}
            </AppButton>
            <AppButton
              actionType="secondary"
              surface="soft"
              size="small"
              data-testid="notifications-mark-all"
              disabled={unreadNotificationCount === 0}
              startIcon={<CheckCheck size={14} />}
              onClick={markAllNotificationsRead}
            >
              {t('markAllAsRead')}
            </AppButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filter === 'all' ? (
            <AppButton actionType="primary" size="small" data-testid="notifications-filter-all" onClick={() => setFilter('all')}>
              {t('allNotifications')} ({notifications.length})
            </AppButton>
          ) : (
            <AppButton actionType="secondary" surface="outlined" size="small" data-testid="notifications-filter-all" onClick={() => setFilter('all')}>
              {t('allNotifications')} ({notifications.length})
            </AppButton>
          )}
          {filter === 'unread' ? (
            <AppButton actionType="primary" size="small" data-testid="notifications-filter-unread" onClick={() => setFilter('unread')}>
              {t('unreadNotifications')} ({unreadNotificationCount})
            </AppButton>
          ) : (
            <AppButton actionType="secondary" surface="outlined" size="small" data-testid="notifications-filter-unread" onClick={() => setFilter('unread')}>
              {t('unreadNotifications')} ({unreadNotificationCount})
            </AppButton>
          )}
        </div>

        {notificationsError ? (
          <AppStateView
            variant="error"
            title={t('notificationsLoadErrorTitle')}
            description={t('notificationsLoadErrorDesc')}
            onRetry={() => { retryLoadNotifications(); setIsLoading(true); }}
            retryLabel={t('retryAction')}
          />
        ) : isLoading ? (
          <div data-testid="notifications-loading">
            <AppSkeleton variant="card" count={3} />
          </div>
        ) : filtered.length === 0 ? (
          <AppStateView
            variant="empty"
            title={filter === 'unread' ? t('noUnreadNotificationsTitle') : t('noNotificationsTitle')}
            description={filter === 'unread' ? t('noUnreadNotificationsDesc') : t('noNotificationsDesc')}
          />
        ) : (
          <div className="space-y-3" data-testid="notifications-list">
            {filtered.map((item) => (
              <NotificationItemCard key={item.id} item={item} onMarkRead={markNotificationRead} onOpenTarget={handleOpenTarget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
