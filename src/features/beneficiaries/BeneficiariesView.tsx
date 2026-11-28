import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { validateBangladeshPhone, validateTin } from '../../design-system/forms';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { Beneficiary } from '../../types/tax';
import { BeneficiariesTable } from './components/BeneficiariesTable';
import { BeneficiaryForm } from './components/BeneficiaryForm';
import { AppDialog } from '../../design-system/modals';

type RelationshipType = Beneficiary['relationship'];

export const BeneficiariesView: React.FC = () => {
  const { t } = useTranslation();
  const { beneficiaries, addBeneficiary, deleteBeneficiary } = useApp();

  const [name, setName] = useState('');
  const [tin, setTin] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Father');
  const [phone, setPhone] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; tin?: string; phone?: string }>({});

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

    setErrors({});
    addBeneficiary({ name: name.trim(), tin: tin.trim(), relationship, phone: phone.trim() });
    setName('');
    setTin('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-teal-700" size={28} /> {t('beneficiaries')}
            </h1>
            <p className="text-xs text-slate-500">
              Manage family members and client TIN mappings for facilitated tax payments.
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

        <AppDialog
          open={showAddModal}
          onClose={() => {
            setErrors({});
            setShowAddModal(false);
          }}
          title={t('addBeneficiary')}
          maxWidth="md"
        >
          <BeneficiaryForm
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
            onCancel={() => {
              setErrors({});
              setShowAddModal(false);
            }}
            onSubmit={handleSubmit}
          />
        </AppDialog>

        <BeneficiariesTable
          beneficiaries={beneficiaries}
          onDelete={(id) => {
            if (!isRestrictedOperationAllowed('beneficiary_write')) return;
            deleteBeneficiary(id);
          }}
        />
      </div>
    </div>
  );
};
