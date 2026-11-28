import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Printer, ShieldAlert } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppDialog } from '../../../design-system/modals';
import { maskProfileTin } from '../profileUtils';
import type { TaxpayerProfile24 } from '../profileTypes';

interface ProfileCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  profile: TaxpayerProfile24;
  canReveal: boolean;
}

export const ProfileCertificateDialog: React.FC<ProfileCertificateDialogProps> = ({
  open,
  onClose,
  profile,
  canReveal,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      responsiveBottomSheet
      id="sample-etin-certificate-dialog"
      title={
        <div className="flex items-center gap-2.5">
          <Award className="text-teal-700 dark:text-teal-400" size={20} />
          <span>
            {isBn
              ? 'নমুনা ই-টিআইএন সনদ প্রিভিউ'
              : 'Sample e-TIN Certificate Preview'}
          </span>
        </div>
      }
      actions={
        <div className="flex items-center justify-between w-full">
          <AppButton actionType="secondary" size="small" onClick={onClose}>
            {t('back')}
          </AppButton>
          <AppButton
            actionType="primary"
            size="small"
            startIcon={<Printer size={16} />}
            onClick={() => window.print()}
          >
            {isBn ? 'প্রিন্ট' : 'Print'}
          </AppButton>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
          <span>
            {isBn
              ? 'শুধুমাত্র ইউআই প্রিভিউ। এটি এনবিআর-এর সরকারি বা আইনি সনদ নয়।'
              : 'Sample UI preview only — not an official or legally valid NBR certificate.'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-500 block">{t('name')}</span>
            <strong className="text-slate-900 dark:text-white">{profile.taxpayerName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">{t('taxpayerTin')}</span>
            <strong className="font-mono text-slate-900 dark:text-white">
              {canReveal ? profile.tin : maskProfileTin(profile.tin)}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">{isBn ? 'কর সার্কেল ও অঞ্চল' : 'Circle & Zone'}</span>
            <strong className="text-slate-900 dark:text-white">
              {profile.taxesCircle} · {profile.taxesZone}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">{isBn ? 'প্রদানকারী কর্মকর্তা' : 'Issuing Officer'}</span>
            <strong className="text-slate-900 dark:text-white">{profile.issuingOfficer}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">{isBn ? 'সনদ জারির তারিখ' : 'Issued On'}</span>
            <strong className="font-mono text-slate-900 dark:text-white">{profile.certificateIssuedOn}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">{isBn ? 'কর অফিস' : 'Tax Office'}</span>
            <strong className="text-slate-900 dark:text-white">{profile.taxOfficeAddress}</strong>
          </div>
        </div>
      </div>
    </AppDialog>
  );
};
