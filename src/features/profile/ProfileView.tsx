import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Phone, MapPin, FileCheck, ArrowLeft, LogIn, Link2Off } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppStateView, AppToast } from '../../design-system/feedback';
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
  const [showUnavailable, setShowUnavailable] = useState(false);

  const resolved = resolveTaxpayerProfile(user, isAuthenticated, PUBLIC_PREVIEW);

  if (!resolved) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-14 px-6">
        <div className="max-w-2xl mx-auto" data-testid="profile-auth-gate">
          <AppStateView
            variant="empty"
            title={isBn ? 'প্রোফাইল দেখতে সাইন ইন করুন।' : 'Sign in to view your profile.'}
            description={
              isBn
                ? '২৪-ক্ষেত্রের করদাতা প্রোফাইল ও ই-টিআইএন তথ্য সাইন-ইন ছাড়া প্রদর্শন করা হয় না।'
                : 'Your 24-field taxpayer profile and masked TIN details are isolated behind authenticated sign-in.'
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {!PUBLIC_PREVIEW && (
                  <AppButton actionType="primary" startIcon={<LogIn size={16} />} onClick={() => navigate('/login?returnTo=/profile')}>
                    {t('signIn')}
                  </AppButton>
                )}
                <AppButton actionType="secondary" surface="outlined" onClick={() => navigate('/')}>
                  {t('home')}
                </AppButton>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const { profile, isSampleIdentity, registrationNotLinked } = resolved;
  const canReveal = isAuthenticated && !PUBLIC_PREVIEW;
  const byGroup = (group: ProfileGroupKey) => PROFILE_24_FIELD_MANIFEST.filter((f) => f.group === group);

  const handleCopySuccess = (fieldLabel: string) => {
    setToastMessage(isBn ? `${fieldLabel} কপি হয়েছে` : `Copied ${fieldLabel} to clipboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<ArrowLeft size={16} />} onClick={() => goBack('/dashboard')}>
              {t('back')}
            </AppButton>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <User className="text-teal-700 dark:text-teal-400" size={26} />
                {isBn ? 'করদাতার প্রোফাইল (২৪ ক্ষেত্র)' : 'Taxpayer Profile (24 Fields)'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'ইউআই প্রদর্শনীর জন্য ২৪-ক্ষেত্রের করদাতা প্রোফাইল।' : '24-field taxpayer profile structured per approved specification.'}
              </p>
            </div>
          </div>
        </div>

        <ProfileSummaryCard
          profile={profile}
          summaryFields={byGroup('summary')}
          isSampleIdentity={isSampleIdentity}
          onPrintCertificate={() => setShowCertModal(true)}
        />

        {registrationNotLinked && (
          <div
            data-testid="registration-not-linked"
            role="status"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <Link2Off size={16} className="text-teal-700 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {isBn ? 'নিবন্ধনের রেকর্ড সংযুক্ত নেই' : 'Registration record not linked'}
                </p>
                <p className="text-slate-500">
                  {isBn
                    ? 'শুধু অ্যাকাউন্টে সংরক্ষিত তথ্য দেখানো হচ্ছে; কোনো অন্য করদাতার সনদ তথ্য যুক্ত হয়নি।'
                    : 'Only account-backed metadata is shown. No registration fixture from other taxpayers is merged.'}
                </p>
              </div>
            </div>
            <AppButton
              actionType="secondary"
              surface="outlined"
              size="small"
              aria-expanded={showUnavailable}
              onClick={() => setShowUnavailable((v) => !v)}
            >
              {showUnavailable
                ? isBn ? 'অনুপলব্ধ নিবন্ধন তথ্য লুকান' : 'Hide unavailable registration fields'
                : isBn ? 'অনুপলব্ধ নিবন্ধন তথ্য দেখুন' : 'Show unavailable registration fields'}
            </AppButton>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileGroupCard groupKey="identity" titleEn="Identity Details" titleBn="পরিচয় বিবরণ" icon={<Shield size={20} />} fields={byGroup('identity')} profile={profile} canReveal={canReveal} profileContext onCopySuccess={handleCopySuccess} />
          <ProfileGroupCard groupKey="personal" titleEn="Personal Information" titleBn="ব্যক্তিগত তথ্য" icon={<User size={20} />} fields={byGroup('personal')} profile={profile} canReveal={canReveal} profileContext hideUnavailableRegistration={registrationNotLinked && !showUnavailable} onCopySuccess={handleCopySuccess} />
          <ProfileGroupCard groupKey="contact" titleEn="Contact & Addresses" titleBn="যোগাযোগ ও ঠিকানা" icon={<Phone size={20} />} fields={byGroup('contact')} profile={profile} canReveal={canReveal} profileContext hideUnavailableRegistration={registrationNotLinked && !showUnavailable} onCopySuccess={handleCopySuccess} />
          <ProfileGroupCard groupKey="jurisdiction" titleEn="Tax Jurisdiction" titleBn="কর এখতিয়ার" icon={<MapPin size={20} />} fields={byGroup('jurisdiction')} profile={profile} canReveal={canReveal} profileContext hideUnavailableRegistration={registrationNotLinked && !showUnavailable} onCopySuccess={handleCopySuccess} />
          <ProfileGroupCard groupKey="certificate" titleEn="Certificate Details" titleBn="সনদ বিবরণ" icon={<FileCheck size={20} />} fields={byGroup('certificate')} profile={profile} canReveal={canReveal} profileContext hideUnavailableRegistration={registrationNotLinked && !showUnavailable} onCopySuccess={handleCopySuccess} className="lg:col-span-2" />
        </div>
      </div>

      <ProfileCertificateDialog open={showCertModal} onClose={() => setShowCertModal(false)} profile={profile} canReveal={canReveal} />
      <AppToast open={Boolean(toastMessage)} onClose={() => setToastMessage(null)} message={toastMessage} severity="success" />
    </div>
  );
};
