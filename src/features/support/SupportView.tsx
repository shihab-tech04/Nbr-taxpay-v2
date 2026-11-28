import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { HelpCircle, PhoneCall, Plus } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppDialog } from '../../design-system/modals';
import { AppToast } from '../../design-system/feedback';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { SupportTicket } from '../../types/tax';
import { SupportContextBanner } from './components/SupportContextBanner';
import { SupportFaqList } from './components/SupportFaqList';
import { SupportTicketForm } from './components/SupportTicketForm';

type SupportCategory = SupportTicket['category'];

export const SupportView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { addSupportTicket } = useApp();

  const contract = searchParams.get('contract');
  const queryCategory = searchParams.get('category');
  const isBn = i18n.language === 'bn';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportCategory>(
    contract === 'incident' ? 'Technical' : 'Payment Issue'
  );
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(() => contract === 'incident');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  const isDirty = Boolean(subject.trim() || message.trim());

  const resetAndClose = () => {
    setSubject('');
    setMessage('');
    setErrors({});
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('support_ticket_write')) return;
    const nextErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) nextErrors.subject = t('requiredSubjectError');
    if (!message.trim()) nextErrors.message = t('requiredMessageError');
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addSupportTicket({ subject: subject.trim(), category, message: message.trim() });
    setToastMsg(isBn ? 'সহায়তা টিকেট জমা হয়েছে' : 'Support ticket submitted');
    resetAndClose();
  };

  const modalTitle =
    contract === 'incident'
      ? isBn
        ? 'সমস্যা রিপোর্ট করুন'
        : 'Report an Issue'
      : isBn
      ? 'সহায়তা টিকেট তৈরি করুন'
      : 'Create Support Ticket';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="text-teal-700" size={28} /> {t('support')}
            </h1>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'সহায়তা পান, সচরাচর প্রশ্নাবলী দেখুন এবং এনবিআর হেল্পলাইনে যোগাযোগ করুন।'
                : 'Get assistance, view FAQs, and contact NBR helpline support.'}
            </p>
          </div>
          <AppButton
            actionType="primary"
            size="small"
            previewRestricted
            startIcon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
            sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
          >
            {contract === 'incident'
              ? isBn
                ? 'সমস্যা রিপোর্ট করুন'
                : 'Report an Issue'
              : isBn
              ? 'সহায়তা টিকেট খুলুন'
              : 'Open Support Ticket'}
          </AppButton>
        </div>

        <SupportContextBanner contract={contract} queryCategory={queryCategory} isBn={isBn} />

        <div className="p-6 bg-teal-700 text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">NBR National Call Center Helpline</h3>
            <p className="text-xs text-teal-100">
              {t('needHelp')}
            </p>
          </div>
          <div className="px-6 py-3 bg-white text-teal-900 rounded-xl font-bold text-lg flex items-center gap-2 font-mono shadow-sm">
            <PhoneCall size={20} /> 16555
          </div>
        </div>

        <AppDialog
          open={showModal}
          onClose={resetAndClose}
          title={modalTitle}
          maxWidth="md"
          responsiveBottomSheet
          isDirty={isDirty}
          id="support-ticket-dialog"
          actions={
            <div className="flex justify-end gap-3 w-full">
              <AppButton type="button" actionType="secondary" size="small" onClick={resetAndClose}>
                {t('cancel')}
              </AppButton>
              <AppButton type="submit" form="support-ticket-form" actionType="primary" size="small" previewRestricted>
                {t('save')}
              </AppButton>
            </div>
          }
        >
          <SupportTicketForm
            formId="support-ticket-form"
            subject={subject}
            category={category}
            message={message}
            errors={errors}
            onChangeSubject={(val) => {
              setSubject(val);
              if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
            }}
            onChangeCategory={setCategory}
            onChangeMessage={(val) => {
              setMessage(val);
              if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
            }}
            onSubmit={handleSubmit}
          />
        </AppDialog>

        <SupportFaqList />
      </div>

      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
