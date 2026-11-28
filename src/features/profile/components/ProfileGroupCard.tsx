import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileFieldItem } from './ProfileFieldItem';
import type { ProfileFieldMeta, TaxpayerProfile24 } from '../profileTypes';

interface ProfileGroupCardProps {
  titleEn: string;
  titleBn: string;
  icon: React.ReactNode;
  fields: readonly ProfileFieldMeta[];
  profile: TaxpayerProfile24;
  canReveal?: boolean;
  onCopySuccess?: (label: string) => void;
  className?: string;
}

export const ProfileGroupCard: React.FC<ProfileGroupCardProps> = ({
  titleEn,
  titleBn,
  icon,
  fields,
  profile,
  canReveal = false,
  onCopySuccess,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="text-teal-700 dark:text-teal-400">{icon}</div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {isBn ? titleBn : titleEn}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => (
          <ProfileFieldItem
            key={field.key}
            meta={field}
            value={profile[field.key]}
            canReveal={canReveal}
            onCopySuccess={onCopySuccess}
          />
        ))}
      </div>
    </div>
  );
};
