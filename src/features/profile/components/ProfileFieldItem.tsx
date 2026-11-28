import React from 'react';
import { useTranslation } from 'react-i18next';
import { MaskedProfileValue } from './MaskedProfileValue';
import type { ProfileFieldMeta } from '../profileTypes';

interface ProfileFieldItemProps {
  meta: ProfileFieldMeta;
  value: string;
  identityKey: string;
  canReveal?: boolean;
  onCopySuccess?: (label: string) => void;
}

export const ProfileFieldItem: React.FC<ProfileFieldItemProps> = ({
  meta,
  value,
  identityKey,
  canReveal = false,
  onCopySuccess,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const label = isBn ? meta.labelBn : meta.labelEn;

  return (
    <div
      data-testid={`profile-field-${meta.key}`}
      data-source={meta.source}
      className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-colors"
    >
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
        {label}
      </span>
      <MaskedProfileValue
        meta={meta}
        value={value}
        identityKey={identityKey}
        canReveal={canReveal}
        onCopySuccess={onCopySuccess}
      />
    </div>
  );
};
