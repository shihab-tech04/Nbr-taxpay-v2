import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Plus, Trash2, Users } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppNumberField, AppSelectField, AppTextField, validateTin } from '../../../design-system/forms';
import { AppCheckbox, AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import { lookupTinIdentity } from '../../../shared/accountSession';
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
  onSaveNewBeneficiary?: (b: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
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
  onSaveNewBeneficiary,
  onBack,
  onNext,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [manualTin, setManualTin] = useState('');
  const [manualName, setManualName] = useState('');
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const [relationship, setRelationship] = useState<Beneficiary['relationship']>('Clients');
  const [relationshipNote, setRelationshipNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const tinMatch = useMemo(() => (validateTin(manualTin).valid ? lookupTinIdentity(manualTin) : null), [manualTin]);

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
    if (!validateTin(cleanTin).valid) {
      setErrorMsg(t('invalidTinError'));
      return;
    }
    const cleanName = manualName.trim() || tinMatch?.profile.name || '';
    if (!cleanName) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে করদাতার আইনি নাম লিখুন।' : 'Enter the taxpayer legal name for this TIN.');
      return;
    }
    const cleanNote = relationship === 'Others' ? relationshipNote.trim() : '';
    const shouldSave = isAuthenticated && liabilityMode === 'facilitation' && saveAsBeneficiary && Boolean(onSaveNewBeneficiary);
    if (shouldSave && relationship === 'Others' && (cleanNote.length < 1 || cleanNote.length > 80)) {
      setErrorMsg(isBn ? 'অন্যান্য সম্পর্কের বিবরণ (১–৮০ অক্ষর) লিখুন।' : 'Custom relationship note must be 1–80 characters.');
      return;
    }
    if (shouldSave && !beneficiaries.some((b) => b.tin === cleanTin)) {
      onSaveNewBeneficiary?.({
        name: cleanName,
        tin: cleanTin,
        relationship,
        relationshipNote: cleanNote || undefined,
      });
    }
    const entry: SelectedTaxpayerEntry = { tin: cleanTin, name: cleanName, source: shouldSave ? 'beneficiary' : 'one_time' };
    if (liabilityMode === 'own') {
      onChangeSelectedTaxpayers([entry]);
    } else if (!selectedTaxpayers.some((tp) => tp.tin === cleanTin)) {
      onChangeSelectedTaxpayers([...selectedTaxpayers, entry]);
    }
    setManualTin('');
    setManualName('');
    setSaveAsBeneficiary(false);
    setRelationshipNote('');
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
          <h3 className="text-lg font-bold">{isBn ? 'করদাতা ও টিআইএন নির্বাচন' : 'Taxpayer & TIN Selection'}</h3>
        </div>
        <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<ArrowLeft size={14} />} onClick={onBack}>
          {isBn ? 'বিভাগ পরিবর্তন' : 'Change Category'}
        </AppButton>
      </div>

      {errorMsg && <div role="alert" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs text-rose-700">{errorMsg}</div>}

      <AppRadioGroup label={isBn ? 'পরিশোধের ধরণ' : 'Payment Liability Scope'} value={liabilityMode} onChange={(_, val) => onChangeLiabilityMode(val as 'own' | 'facilitation')} columns={2}>
        <AppRadioCard value="own" title={isBn ? 'নিজস্ব কর দায় (১ জন)' : 'Own Liability (1 Taxpayer)'} description={isAuthenticated ? `${userName} (${userTin})` : isBn ? 'ওয়াক-ইন একক টিআইএন' : 'Single walk-in taxpayer TIN'} />
        <AppRadioCard value="facilitation" title={isBn ? 'সহায়তা ও সম্মিলিত (একাধিক করদাতা)' : 'Facilitation / Multi-Taxpayer'} description={isBn ? 'সংরক্ষিত বেনিফিশিয়ারি ও এককালীন টিআইএন যোগ করুন' : 'Combine saved beneficiaries or multiple one-time TINs'} />
      </AppRadioGroup>

      {isAuthenticated && liabilityMode === 'facilitation' && beneficiaries.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{isBn ? 'সংরক্ষিত বেনিফিশিয়ারি নির্বাচন করুন:' : 'Saved Beneficiaries:'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {beneficiaries.map((b) => (
              <AppCheckbox key={b.id} checked={selectedTaxpayers.some((tp) => tp.tin === b.tin)} onChange={(_, checked) => handleToggleBeneficiary(b, checked)} label={`${b.name} (${b.tin})`} />
            ))}
          </div>
        </div>
      )}

      {(!isAuthenticated || liabilityMode === 'facilitation') && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{isBn ? '১২-অঙ্কের টিআইএন যোগ করুন (এককালীন বা নতুন বেনিফিশিয়ারি)' : 'Set / Add 12-Digit Taxpayer TIN'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <AppNumberField label={t('taxpayerTin')} maxLength={12} value={manualTin} onChange={(e) => setManualTin(e.target.value)} placeholder={t('tinPlaceholder')} helperText={tinMatch ? `${isBn ? 'নমুনা তথ্য:' : 'Directory hint:'} ${tinMatch.maskedNameHint}` : undefined} />
            <AppTextField label={t('name')} value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder={isBn ? 'করদাতার নাম' : 'Taxpayer Name'} />
            <AppButton actionType="secondary" surface="soft" startIcon={<Plus size={15} />} onClick={handleAddOneTime} sx={{ mt: { sm: 0.5 }, height: 48 }}>
              {isBn ? 'টিআইএন যোগ করুন' : 'Use / Add TIN'}
            </AppButton>
          </div>
          {isAuthenticated && liabilityMode === 'facilitation' && onSaveNewBeneficiary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <AppCheckbox checked={saveAsBeneficiary} onChange={(_, c) => setSaveAsBeneficiary(c)} label={isBn ? 'বেনিফিশিয়ারি তালিকায় সংরক্ষণ করুন' : 'Save new taxpayer to Beneficiaries'} />
              {saveAsBeneficiary && (
                <AppSelectField
                  label={isBn ? 'সম্পর্ক / ট্যাগ' : 'Relation / Tag'}
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as Beneficiary['relationship'])}
                  options={[
                    { value: 'Clients', label: t('clients') }, { value: 'Father', label: t('father') }, { value: 'Mother', label: t('mother') }, { value: 'Spouse', label: t('spouse') },
                    { value: 'Son', label: t('son') }, { value: 'Daughter', label: t('daughter') }, { value: 'Siblings', label: t('siblings') }, { value: 'Friends', label: t('friends') }, { value: 'Others', label: t('others') },
                  ]}
                />
              )}
              {saveAsBeneficiary && relationship === 'Others' && (
                <AppTextField label={isBn ? 'সম্পর্ক উল্লেখ করুন' : 'Custom Tag Note'} value={relationshipNote} onChange={(e) => setRelationshipNote(e.target.value)} placeholder={isBn ? 'যেমন: অংশীদার' : 'e.g. Partner'} />
              )}
            </div>
          )}
        </div>
      )}

      {selectedTaxpayers.length > 0 && (
        <div data-testid="selected-taxpayers-list" className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{isBn ? `নির্বাচিত করদাতা (${selectedTaxpayers.length})` : `Active Taxpayer(s) (${selectedTaxpayers.length})`}</p>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {selectedTaxpayers.map((tp) => (
              <div key={tp.tin} className="flex items-center justify-between px-4 py-2.5 text-xs">
                <div><strong className="text-slate-900 dark:text-white">{tp.name}</strong><span className="ml-2 font-mono text-slate-500">TIN: {tp.tin}</span></div>
                {!(liabilityMode === 'own' && isAuthenticated && tp.tin === userTin) && (
                  <AppIconButton size="small" intent="destructive" aria-label={`Remove taxpayer ${tp.tin}`} onClick={() => onChangeSelectedTaxpayers(selectedTaxpayers.filter((x) => x.tin !== tp.tin))}><Trash2 size={14} /></AppIconButton>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <AppButton actionType="primary" endIcon={<ArrowRight size={16} />} onClick={handleContinue}>{isBn ? 'কর খাতে এগোতে ক্লিক করুন' : 'Continue to Payment Head'}</AppButton>
      </div>
    </div>
  );
};
