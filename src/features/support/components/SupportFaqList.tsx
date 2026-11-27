import React from 'react';
import { useTranslation } from 'react-i18next';

export const SupportFaqList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
      <h3 className="text-lg font-bold">{t('faqTitle')}</h3>
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white">How do I verify my E-Challan?</h4>
          <p className="text-slate-600 dark:text-slate-300">
            Every successful payment generates a verifiable challan number with digital QR code verification on Sohojkor and NBR servers.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white">
            Can I pay taxes on behalf of family members?
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            Yes, use the Beneficiaries module to map family member TINs securely and file payments on their behalf.
          </p>
        </div>
      </div>
    </div>
  );
};
