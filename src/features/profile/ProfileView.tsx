import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Phone, MapPin, FileCheck, ArrowLeft, Lock } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppToast } from '../../design-system/feedback';
import { useAppNavigation } from '../../design-system/navigation';
import { useSession } from '../../shared/SessionContext';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { PROFILE_24_FIELD_MANIFEST, type ProfileGroupKey } from './profileTypes';
import { resolveTaxpayerProfile } from './profileUtils';
import { ProfileSummaryCard } from './components/ProfileSummaryCard';
import { ProfileGroupCard } from './components/ProfileGroupCard';
import { ProfileCertificateDialog } from './components/ProfileCertificateDialog';

export const ProfileView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const { user, isAuthenticated } = useSession();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  const canReveal = isAuthenticated && !PUBLIC_PREVIEW;
  const { profile, isSampleIdentity } = resolveTaxpayerProfile(user, isAuthenticated, PUBLIC_PREVIEW);

  const byGroup = (group: ProfileGroupKey) =>
    PROFILE_24_FIELD_MANIFEST.filter((f) => f.group === group);

  const handleCopySuccess = (fieldLabel: string) => {
    setToastMessage(isBn ? `${fieldLabel} কপি হয়েছে` : `Copied ${fieldLabel} to clipboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <AppButton
              actionType="secondary"
              surface="outlined"
              size="small"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => goBack('/dashboard')}
            >
              {t('back')}
            </AppButton>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <User className="text-teal-700 dark:text-teal-400" size={26} />
                {isBn ? 'করদাতার প্রোফাইল (২৪ ক্ষেত্র)' : 'Taxpayer Profile (24 Fields)'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'ইউআই প্রদর্শনীর জন্য ২৪-ক্ষেত্রের করদাতা প্রোফাইল।'
                  : '24-field taxpayer profile structured per approved specification.'}
              </p>
            </div>
          </div>
        </div>

        {!canReveal && (
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Lock size={15} className="text-teal-700 shrink-0" />
              <span>
                {isBn
                  ? 'সংবেদনশীল ক্ষেত্রসমূহ ডিফল্টভাবে গোপন রাখা হয়েছে। উন্মোচন ও কপি করতে সাইন ইন করুন।'
                  : 'Sensitive fields stay masked by default. Sign in to enable eye reveal and copy.'}
              </span>
            </div>
            {!PUBLIC_PREVIEW && (
              <AppButton actionType="secondary" size="small" onClick={() => navigate('/login?returnTo=/profile')}>
                {t('signIn')}
              </AppButton>
            )}
          </div>
        )}

        <ProfileSummaryCard
          profile={profile}
          summaryFields={byGroup('summary')}
          isSampleIdentity={isSampleIdentity}
          onPrintCertificate={() => setShowCertModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileGroupCard
            titleEn="Identity Details"
            titleBn="পরিচয় বিবরণ"
            icon={<Shield size={20} />}
            fields={byGroup('identity')}
            profile={profile}
            canReveal={canReveal}
            onCopySuccess={handleCopySuccess}
          />
          <ProfileGroupCard
            titleEn="Personal Information"
            titleBn="ব্যক্তিগত তথ্য"
            icon={<User size={20} />}
            fields={byGroup('personal')}
            profile={profile}
            canReveal={canReveal}
            onCopySuccess={handleCopySuccess}
          />
          <ProfileGroupCard
            titleEn="Contact & Addresses"
            titleBn="যোগাযোগ ও ঠিকানা"
            icon={<Phone size={20} />}
            fields={byGroup('contact')}
            profile={profile}
            canReveal={canReveal}
            onCopySuccess={handleCopySuccess}
          />
          <ProfileGroupCard
            titleEn="Tax Jurisdiction"
            titleBn="কর এখতিয়ার"
            icon={<MapPin size={20} />}
            fields={byGroup('jurisdiction')}
            profile={profile}
            canReveal={canReveal}
            onCopySuccess={handleCopySuccess}
          />
          <ProfileGroupCard
            titleEn="Certificate Details"
            titleBn="সনদ বিবরণ"
            icon={<FileCheck size={20} />}
            fields={byGroup('certificate')}
            profile={profile}
            canReveal={canReveal}
            onCopySuccess={handleCopySuccess}
            className="lg:col-span-2"
          />
        </div>
      </div>

      <ProfileCertificateDialog
        open={showCertModal}
        onClose={() => setShowCertModal(false)}
        profile={profile}
        canReveal={canReveal}
      />

      <AppToast
        open={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
        severity="success"
      />
    </div>
  );
};
