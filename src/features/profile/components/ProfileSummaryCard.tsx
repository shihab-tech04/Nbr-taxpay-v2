import React from 'react';
import { useTranslation } from 'react-i18next';
import { Printer } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import type { ProfileFieldMeta, TaxpayerProfile24 } from '../profileTypes';

interface ProfileSummaryCardProps {
  profile: TaxpayerProfile24;
  summaryFields: readonly ProfileFieldMeta[];
  isSampleIdentity: boolean;
  onPrintCertificate: () => void;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  profile,
  summaryFields,
  isSampleIdentity,
  onPrintCertificate,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg shrink-0">
            {profile.taxpayerName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {profile.taxpayerName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                {isSampleIdentity
                  ? isBn
                    ? 'নমুনা করদাতা'
                    : 'Sample taxpayer'
                  : isBn
                  ? 'সক্রিয় প্রোফাইল'
                  : 'Signed-in profile'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'ইউআই প্রদর্শনীর জন্য ই-টিআইএন করদাতা প্রোফাইল'
                : 'e-TIN Taxpayer Profile (UI Preview)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <AppButton
            actionType="primary"
            size="small"
            startIcon={<Printer size={16} />}
            onClick={onPrintCertificate}
            className="w-full sm:w-auto"
          >
            {isBn ? 'নমুনা সনদ দেখুন' : 'View Sample Certificate'}
          </AppButton>
        </div>
      </div>

      {/* Embedded Account & Registration Summary (sole location for these 4 fields) */}
      <div
        data-testid="profile-summary-bar"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
      >
        {summaryFields.map((field) => (
          <div key={field.key} data-testid={`profile-field-${field.key}`} data-source={field.source}>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              {isBn ? field.labelBn : field.labelEn}
            </span>
            <strong
              className={`text-slate-900 dark:text-slate-100 mt-0.5 block break-words ${
                field.key === 'lastLoginAt'
                  ? 'text-xs font-mono text-slate-700 dark:text-slate-300'
                  : field.key === 'tinType'
                  ? 'text-sm'
                  : 'text-sm font-mono'
              }`}
            >
              {profile[field.key]}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};
