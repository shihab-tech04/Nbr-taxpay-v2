import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Plus, Trash2, Users } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppNumberField, AppTextField, validateTin } from '../../../design-system/forms';
import { AppCheckbox, AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import type { Beneficiary } from '../../../types/tax';

export interface SelectedTaxpayerEntry {
  tin: string;
  name: string;
  source: 'self' | 'beneficiary' | 'one_time';
}

interface AllTaxTaxpayerStepProps {
  isAuthenticated: boolean;
  userTin: string;
  userName: string;
  liabilityMode: 'own' | 'facilitation';
  beneficiaries: readonly Beneficiary[];
  selectedTaxpayers: readonly SelectedTaxpayerEntry[];
  onChangeLiabilityMode: (mode: 'own' | 'facilitation') => void;
  onChangeSelectedTaxpayers: (next: SelectedTaxpayerEntry[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const AllTaxTaxpayerStep: React.FC<AllTaxTaxpayerStepProps> = ({
  isAuthenticated,
  userTin,
  userName,
  liabilityMode,
  beneficiaries,
  selectedTaxpayers,
  onChangeLiabilityMode,
  onChangeSelectedTaxpayers,
  onBack,
  onNext,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [manualTin, setManualTin] = useState('');
  const [manualName, setManualName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleBeneficiary = (b: Beneficiary, checked: boolean) => {
    setErrorMsg('');
    if (checked) {
      if (!selectedTaxpayers.some((tp) => tp.tin === b.tin)) {
        onChangeSelectedTaxpayers([...selectedTaxpayers, { tin: b.tin, name: b.name, source: 'beneficiary' }]);
      }
    } else {
      onChangeSelectedTaxpayers(selectedTaxpayers.filter((tp) => tp.tin !== b.tin));
    }
  };

  const handleAddOneTime = () => {
    const cleanTin = manualTin.trim();
    const tinCheck = validateTin(cleanTin);
    if (!tinCheck.valid) {
      setErrorMsg(t('invalidTinError'));
      return;
    }
    const cleanName = manualName.trim() || `Taxpayer ${cleanTin}`;
    if (liabilityMode === 'own') {
      onChangeSelectedTaxpayers([{ tin: cleanTin, name: cleanName, source: 'one_time' }]);
    } else if (!selectedTaxpayers.some((tp) => tp.tin === cleanTin)) {
      onChangeSelectedTaxpayers([...selectedTaxpayers, { tin: cleanTin, name: cleanName, source: 'one_time' }]);
    }
    setManualTin('');
    setManualName('');
    setErrorMsg('');
  };

  const handleContinue = () => {
    if (selectedTaxpayers.length === 0) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে অন্তত একজন করদাতা নির্ধারণ করুন।' : 'Add or select at least one taxpayer TIN before continuing.');
      return;
    }
    if (liabilityMode === 'own' && selectedTaxpayers.length > 1) {
      setErrorMsg(isBn ? 'নিজস্ব দায় পরিশোধে কেবল ১ জন করদাতা অনুমোদিত।' : 'Own liability mode permits only 1 taxpayer.');
      return;
    }
    setErrorMsg('');
    onNext();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Users className="text-teal-700" size={20} />
          <h3 className="text-lg font-bold">{isBn ? 'ধাপ ১: করদাতা ও টিআইএন নির্বাচন' : 'Taxpayer & TIN Selection'}</h3>
        </div>
        <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<ArrowLeft size={14} />} onClick={onBack}>
          {isBn ? 'বিভাগ পরিবর্তন' : 'Change Category'}
        </AppButton>
      </div>

      {errorMsg && <div role="alert" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs text-rose-700">{errorMsg}</div>}

      <AppRadioGroup
        label={isBn ? 'পরিশোধের ধরণ' : 'Payment Liability Scope'}
        value={liabilityMode}
        onChange={(_, val) => onChangeLiabilityMode(val as 'own' | 'facilitation')}
        columns={2}
      >
        <AppRadioCard
          value="own"
          title={isBn ? 'নিজস্ব কর দায় (১ জন)' : 'Own Liability (1 Taxpayer)'}
          description={isAuthenticated ? `${userName} (${userTin})` : isBn ? 'ওয়াক-ইন একক টিআইএন' : 'Single walk-in taxpayer TIN'}
        />
        <AppRadioCard
          value="facilitation"
          title={isBn ? 'সহায়তা ও সম্মিলিত (একাধিক করদাতা)' : 'Facilitation / Multi-Taxpayer'}
          description={isBn ? 'সংরক্ষিত বেনিফিশিয়ারি ও এককালীন টিআইএন যোগ করুন' : 'Combine saved beneficiaries or multiple one-time TINs'}
        />
      </AppRadioGroup>

      {isAuthenticated && liabilityMode === 'facilitation' && beneficiaries.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{isBn ? 'সংরক্ষিত বেনিফিশিয়ারি নির্বাচন করুন:' : 'Saved Beneficiaries:'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {beneficiaries.map((b) => (
              <AppCheckbox
                key={b.id}
                checked={selectedTaxpayers.some((tp) => tp.tin === b.tin)}
                onChange={(_, checked) => handleToggleBeneficiary(b, checked)}
                label={`${b.name} (${b.tin})`}
              />
            ))}
          </div>
        </div>
      )}

      {(!isAuthenticated || liabilityMode === 'facilitation') && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {isBn ? '১২-অঙ্কের টিআইএন যোগ করুন (এককালীন বা ওয়াক-ইন)' : 'Set / Add 12-Digit Taxpayer TIN'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <AppNumberField label={t('taxpayerTin')} maxLength={12} value={manualTin} onChange={(e) => setManualTin(e.target.value)} placeholder={t('tinPlaceholder')} />
            <AppTextField label={t('name')} value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder={isBn ? 'করদাতার নাম' : 'Taxpayer Name'} />
            <AppButton actionType="secondary" surface="soft" startIcon={<Plus size={15} />} onClick={handleAddOneTime} sx={{ mt: { sm: 0.5 }, height: 48 }}>
              {isBn ? 'টিআইএন যোগ করুন' : 'Use / Add TIN'}
            </AppButton>
          </div>
        </div>
      )}

      {selectedTaxpayers.length > 0 && (
        <div data-testid="selected-taxpayers-list" className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {isBn ? `নির্বাচিত করদাতা (${selectedTaxpayers.length})` : `Active Taxpayer(s) (${selectedTaxpayers.length})`}
          </p>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {selectedTaxpayers.map((tp) => (
              <div key={tp.tin} className="flex items-center justify-between px-4 py-2.5 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white">{tp.name}</strong>
                  <span className="ml-2 font-mono text-slate-500">TIN: {tp.tin}</span>
                </div>
                {!(liabilityMode === 'own' && isAuthenticated && tp.tin === userTin) && (
                  <AppIconButton size="small" intent="destructive" aria-label={`Remove taxpayer ${tp.tin}`} onClick={() => onChangeSelectedTaxpayers(selectedTaxpayers.filter((x) => x.tin !== tp.tin))}>
                    <Trash2 size={14} />
                  </AppIconButton>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <AppButton actionType="primary" endIcon={<ArrowRight size={16} />} onClick={handleContinue}>
          {isBn ? 'কর খাতে এগোতে ক্লিক করুন' : 'Continue to Payment Head'}
        </AppButton>
      </div>
    </div>
  );
};
