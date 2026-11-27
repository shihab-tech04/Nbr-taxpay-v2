import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../shared/AppContext';
import { Users, Plus, Trash2 } from 'lucide-react';
import {
  AppTextField,
  AppNumberField,
  AppSelectField,
  validateTin,
  validateBangladeshPhone,
} from '../../design-system/forms';
import { Beneficiary } from '../../types/tax';

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
    const nextErrors: { name?: string; tin?: string; phone?: string } = {};

    if (!name.trim()) {
      nextErrors.name = t('requiredNameError');
    }
    if (!validateTin(tin).valid) {
      nextErrors.tin = t('invalidTinError');
    }
    if (!validateBangladeshPhone(phone)) {
      nextErrors.phone = t('invalidPhoneError');
    }

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
            <p className="text-xs text-slate-500">Manage family members and client TIN mappings for facilitated tax payments.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={16} /> {t('addBeneficiary')}
          </button>
        </div>

        {showAddModal && (
          <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold">{t('addBeneficiary')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <AppTextField
                  label={t('name')}
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder={t('beneficiaryNamePlaceholder')}
                  error={Boolean(errors.name)}
                  helperText={errors.name || t('beneficiaryNameHelper')}
                  required
                />
              </div>
              <div>
                <AppNumberField
                  label={t('twelveDigitTin')}
                  maxLength={12}
                  value={tin}
                  onChange={e => {
                    setTin(e.target.value);
                    if (errors.tin) setErrors(prev => ({ ...prev, tin: undefined }));
                  }}
                  placeholder={t('tinPlaceholder')}
                  error={Boolean(errors.tin)}
                  helperText={errors.tin || t('tinHelperText')}
                  required
                />
              </div>
              <div>
                <AppSelectField
                  label={t('relationship')}
                  value={relationship}
                  onChange={e => setRelationship(e.target.value as RelationshipType)}
                  helperText={t('relationshipHelper')}
                  options={[
                    { value: 'Father', label: t('father') },
                    { value: 'Mother', label: t('mother') },
                    { value: 'Siblings', label: t('siblings') },
                    { value: 'Son', label: t('son') },
                    { value: 'Daughter', label: t('daughter') },
                    { value: 'Spouse', label: t('spouse') },
                    { value: 'Friends', label: t('friends') },
                    { value: 'Clients', label: t('clients') },
                    { value: 'Others', label: t('others') }
                  ]}
                />
              </div>
              <div>
                <AppTextField
                  label={t('phone')}
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder={t('phonePlaceholder')}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone || t('phoneHelper')}
                  slotProps={{
                    htmlInput: {
                      inputMode: 'tel',
                      maxLength: 15,
                      autoComplete: 'tel'
                    }
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setShowAddModal(false);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
              >
                {t('save')}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-4">Name & TIN</th>
                <th className="p-4">Relationship</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Added Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {beneficiaries.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
                    <div className="text-[11px] text-teal-700 font-mono">TIN: {b.tin}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-medium">
                      {b.relationship}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{b.phone}</td>
                  <td className="p-4 font-mono">{b.createdAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteBeneficiary(b.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
