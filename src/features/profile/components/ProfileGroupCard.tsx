import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileFieldItem } from './ProfileFieldItem';
import type { ProfileFieldMeta, ProfileGroupKey, TaxpayerProfile24 } from '../profileTypes';

interface ProfileGroupCardProps {
  groupKey?: ProfileGroupKey;
  titleEn: string;
  titleBn: string;
  icon: React.ReactNode;
  fields: readonly ProfileFieldMeta[];
  profile: TaxpayerProfile24;
  canReveal?: boolean;
  profileContext?: boolean;
  hideUnavailableRegistration?: boolean;
  onCopySuccess?: (label: string) => void;
  className?: string;
}

export const ProfileGroupCard: React.FC<ProfileGroupCardProps> = ({
  groupKey,
  titleEn,
  titleBn,
  icon,
  fields,
  profile,
  canReveal = false,
  profileContext = true,
  hideUnavailableRegistration = false,
  onCopySuccess,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const hasVisible = fields.some((f) => {
    const raw = profile[f.key]?.trim();
    return Boolean(raw && raw !== '—');
  });

  return (
    <div
      data-testid={groupKey ? `profile-group-${groupKey}` : undefined}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="text-teal-700 dark:text-teal-400">{icon}</div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {isBn ? titleBn : titleEn}
        </h3>
      </div>

      {hideUnavailableRegistration && !hasVisible && (
        <p className="text-xs text-slate-500">
          {isBn ? 'যাচাইকৃত নিবন্ধনের তথ্য সংযুক্ত নেই।' : 'No verified registration details linked.'}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => {
          const val = profile[field.key];
          const isUnavailable = !val.trim() || val.trim() === '—';
          return (
            <ProfileFieldItem
              key={`${profile.tin}-${field.key}`}
              meta={field}
              value={val}
              identityKey={profile.tin}
              canReveal={canReveal}
              profileContext={profileContext}
              hiddenUnavailable={hideUnavailableRegistration && isUnavailable}
              onCopySuccess={onCopySuccess}
            />
          );
        })}
      </div>
    </div>
  );
};
