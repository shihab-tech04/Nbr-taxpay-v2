import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppSearchField, validateBangladeshPhone, validateTin } from '../../design-system/forms';
import { AppConfirmDialog, AppDialog } from '../../design-system/modals';
import { AppToast } from '../../design-system/feedback';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { Beneficiary } from '../../types/tax';
import { BeneficiariesTable } from './components/BeneficiariesTable';
import { BeneficiaryForm } from './components/BeneficiaryForm';

type RelationshipType = Beneficiary['relationship'];

export const BeneficiariesView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const { beneficiaries, addBeneficiary, deleteBeneficiary } = useApp();

  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [tin, setTin] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Father');
  const [phone, setPhone] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; tin?: string; phone?: string }>({});

  const normalizedQuery = search.trim().toLowerCase();
  const filteredBeneficiaries = beneficiaries.filter((b) =>
    !normalizedQuery ||
    b.name.toLowerCase().includes(normalizedQuery) ||
    b.tin.includes(normalizedQuery) ||
    b.relationship.toLowerCase().includes(normalizedQuery) ||
    b.phone.includes(normalizedQuery)
  );

  const isDirty = Boolean(name.trim() || tin.trim() || phone.trim());

  const resetAndCloseAddModal = () => {
    setName('');
    setTin('');
    setPhone('');
    setErrors({});
    setShowAddModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    const nextErrors: { name?: string; tin?: string; phone?: string } = {};

    if (!name.trim()) nextErrors.name = t('requiredNameError');
    if (!validateTin(tin).valid) nextErrors.tin = t('invalidTinError');
    if (!validateBangladeshPhone(phone)) nextErrors.phone = t('invalidPhoneError');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addBeneficiary({ name: name.trim(), tin: tin.trim(), relationship, phone: phone.trim() });
    setToastMsg(isBn ? 'নতুন বেনিফিশিয়ারি যোগ করা হয়েছে' : 'Beneficiary added successfully');
    resetAndCloseAddModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-teal-700" size={28} /> {t('beneficiaries')}
            </h1>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'সহায়তাপ্রাপ্ত কর প্রদানের জন্য পরিবারের সদস্য ও ক্লায়েন্টের টিআইএন পরিচালনা করুন।'
                : 'Manage family members and client TIN mappings for facilitated tax payments.'}
            </p>
          </div>
          <AppButton
            actionType="primary"
            size="small"
            previewRestricted
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
          >
            {t('addBeneficiary')}
          </AppButton>
        </div>

        <div className="max-w-sm">
          <AppSearchField
            label={isBn ? 'বেনিফিশিয়ারি খুঁজুন' : 'Search Beneficiaries'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder={isBn ? 'নাম, টিআইএন বা সম্পর্ক লিখুন...' : 'Filter by name, TIN, relationship...'}
            clearAriaLabel={t('clearSearch')}
          />
        </div>

        <AppDialog
          open={showAddModal}
          onClose={resetAndCloseAddModal}
          title={t('addBeneficiary')}
          maxWidth="md"
          responsiveBottomSheet
          isDirty={isDirty}
          id="add-beneficiary-dialog"
          actions={
            <div className="flex justify-end gap-3 w-full">
              <AppButton type="button" actionType="secondary" size="small" onClick={resetAndCloseAddModal}>
                {t('cancel')}
              </AppButton>
              <AppButton type="submit" form="beneficiary-form" actionType="primary" size="small" previewRestricted>
                {t('save')}
              </AppButton>
            </div>
          }
        >
          <BeneficiaryForm
            formId="beneficiary-form"
            name={name}
            tin={tin}
            relationship={relationship}
            phone={phone}
            errors={errors}
            onChangeName={(val) => {
              setName(val);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            onChangeTin={(val) => {
              setTin(val);
              if (errors.tin) setErrors((p) => ({ ...p, tin: undefined }));
            }}
            onChangeRelationship={setRelationship}
            onChangePhone={(val) => {
              setPhone(val);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            onSubmit={handleSubmit}
          />
        </AppDialog>

        <BeneficiariesTable
          beneficiaries={filteredBeneficiaries}
          onRequestDelete={(b) => {
            if (!isRestrictedOperationAllowed('beneficiary_write')) return;
            setDeleteTarget(b);
          }}
        />
      </div>

      <AppConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        intent="destructive"
        title={isBn ? 'বেনিফিশিয়ারি মুছে ফেলবেন?' : 'Delete Beneficiary?'}
        message={
          isBn
            ? `আপনি কি নিশ্চিতভাবে "${deleteTarget?.name ?? ''}" কে তালিকা থেকে মুছে ফেলতে চান?`
            : `Remove "${deleteTarget?.name ?? ''}" from your saved beneficiaries?`
        }
        confirmLabel={t('delete')}
        onConfirm={() => {
          if (!deleteTarget || !isRestrictedOperationAllowed('beneficiary_write')) return;
          deleteBeneficiary(deleteTarget.id);
          setToastMsg(isBn ? 'বেনিফিশিয়ারি মুছে ফেলা হয়েছে' : 'Beneficiary removed');
        }}
      />

      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
