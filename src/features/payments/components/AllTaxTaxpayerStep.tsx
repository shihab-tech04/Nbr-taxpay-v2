import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Trash2, Users } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextField, AppTinLookupField, AppTinResultCard, sanitizeTinResultForDisplay, validateTin } from '../../../design-system/forms';
import { AppCheckbox, AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import { DIRECTORY_SUGGESTED_TINS, lookupTaxpayerDirectoryRecord } from '../../../shared/taxpayerDirectory';
import type { Beneficiary, GiftPartyRecord } from '../../../types/tax';

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
  isAuthenticated, userTin, userName, liabilityMode, beneficiaries, selectedTaxpayers,
  onChangeLiabilityMode, onChangeSelectedTaxpayers, onSaveNewBeneficiary, onBack, onNext,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [manualTin, setManualTin] = useState('');
  const [lookupResult, setLookupResult] = useState<GiftPartyRecord | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const [relationship, setRelationship] = useState<Beneficiary['relationship']>('Clients');
  const [relationshipNote, setRelationshipNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const allBeneficiariesSelected = beneficiaries.length > 0 && beneficiaries.every((b) => selectedTaxpayers.some((tp) => tp.tin === b.tin));
  const someBeneficiariesSelected = beneficiaries.some((b) => selectedTaxpayers.some((tp) => tp.tin === b.tin));

  const handleToggleSelectAll = (checked: boolean) => {
    setErrorMsg('');
    if (checked) {
      const merged = [...selectedTaxpayers];
      beneficiaries.forEach((b) => {
        if (!merged.some((tp) => tp.tin === b.tin)) {
          merged.push({ tin: b.tin, name: b.name.trim() || b.relationship, source: 'beneficiary' });
        }
      });
      onChangeSelectedTaxpayers(merged);
    } else {
      const benTins = new Set(beneficiaries.map((b) => b.tin));
      onChangeSelectedTaxpayers(selectedTaxpayers.filter((tp) => !benTins.has(tp.tin)));
    }
  };

  const handleToggleBeneficiary = (b: Beneficiary, checked: boolean) => {
    setErrorMsg('');
    if (checked) {
      if (!selectedTaxpayers.some((tp) => tp.tin === b.tin)) {
        onChangeSelectedTaxpayers([...selectedTaxpayers, { tin: b.tin, name: b.name.trim() || b.relationship, source: 'beneficiary' }]);
      }
    } else {
      onChangeSelectedTaxpayers(selectedTaxpayers.filter((tp) => tp.tin !== b.tin));
    }
  };

  const handleSearchTin = () => {
    setErrorMsg('');
    const cleanTin = manualTin.trim();
    if (!validateTin(cleanTin).valid) {
      setLookupResult(null);
      setLookupError(t('invalidTinError'));
      return;
    }
    const found = lookupTaxpayerDirectoryRecord(cleanTin, beneficiaries);
    if (!found) {
      setLookupResult(null);
      setLookupError(isBn ? 'এই ১২ ডিজিটের টিআইএন-এর জন্য কোনো করদাতার তথ্য পাওয়া যায়নি।' : 'Taxpayer record unavailable for this 12-digit TIN.');
      return;
    }
    setLookupError('');
    setLookupResult(found);
  };

  const handleConfirmLookupTaxpayer = () => {
    if (!lookupResult) return;
    const cleanNote = relationship === 'Others' ? relationshipNote.trim() : '';
    const shouldSave = isAuthenticated && liabilityMode === 'facilitation' && saveAsBeneficiary && Boolean(onSaveNewBeneficiary);
    if (shouldSave && relationship === 'Others' && (cleanNote.length < 1 || cleanNote.length > 80)) {
      setErrorMsg(isBn ? 'অন্যান্য সম্পর্কের বিবরণ (১–৮০ অক্ষর) লিখুন।' : 'Custom relationship description must be 1–80 characters.');
      return;
    }
    if (shouldSave && !beneficiaries.some((b) => b.tin === lookupResult.tin)) {
      onSaveNewBeneficiary?.({ name: lookupResult.name, tin: lookupResult.tin, relationship, relationshipNote: cleanNote || undefined });
    }
    const entry: SelectedTaxpayerEntry = { tin: lookupResult.tin, name: lookupResult.name, source: shouldSave ? 'beneficiary' : lookupResult.tin === userTin ? 'self' : 'one_time' };
    onChangeSelectedTaxpayers(liabilityMode === 'own' ? [entry] : selectedTaxpayers.some((tp) => tp.tin === entry.tin) ? [...selectedTaxpayers] : [...selectedTaxpayers, entry]);
    setManualTin(''); setLookupResult(null); setLookupError(''); setSaveAsBeneficiary(false); setRelationshipNote(''); setErrorMsg('');
  };

  const handleContinue = () => {
    if (selectedTaxpayers.length === 0) { setErrorMsg(isBn ? 'অনুগ্রহ করে অন্তত একজন করদাতা নির্ধারণ করুন।' : 'Add or select at least one taxpayer TIN before continuing.'); return; }
    if (liabilityMode === 'own' && selectedTaxpayers.length > 1) { setErrorMsg(isBn ? 'নিজস্ব দায় পরিশোধে কেবল ১ জন করদাতা অনুমোদিত।' : 'Own liability mode permits only 1 taxpayer.'); return; }
    setErrorMsg(''); onNext();
  };

  const dupLookupMsg = lookupResult && liabilityMode === 'facilitation' && selectedTaxpayers.some((tp) => tp.tin === lookupResult.tin)
    ? (isBn ? 'এই করদাতা ইতিমধ্যে নির্বাচিত তালিকায় যুক্ত আছেন।' : 'This taxpayer TIN is already added.') : undefined;
  const resultDisplay = lookupResult ? sanitizeTinResultForDisplay({ tin: lookupResult.tin, name: lookupResult.name, classification: lookupResult.classification, allowRevealTin: false }) : null;
  const showLookupBox = liabilityMode === 'facilitation' || (!isAuthenticated && selectedTaxpayers.length === 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2"><Users className="text-teal-700" size={20} /><h3 className="text-lg font-bold">{isBn ? 'করদাতা ও টিআইএন নির্বাচন' : 'Taxpayer & TIN Selection'}</h3></div>
        <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<ArrowLeft size={14} />} onClick={onBack}>{isBn ? 'বিভাগ পরিবর্তন' : 'Change Category'}</AppButton>
      </div>

      {errorMsg && <div role="alert" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs text-rose-700">{errorMsg}</div>}

      <AppRadioGroup label={isBn ? 'পরিশোধের ধরণ' : 'Payment Liability Scope'} value={liabilityMode} onChange={(_, val) => onChangeLiabilityMode(val as 'own' | 'facilitation')} columns={2}>
        <AppRadioCard value="own" title={isBn ? 'নিজস্ব কর দায় (১ জন)' : 'Own Liability (1 Taxpayer)'} description={isAuthenticated ? `${userName} (${userTin})` : isBn ? 'ওয়াক-ইন একক টিআইএন' : 'Single walk-in taxpayer TIN'} />
        <AppRadioCard value="facilitation" title={isBn ? 'সহায়তা ও সম্মিলিত (একাধিক করদাতা)' : 'Facilitation / Multi-Taxpayer'} description={isBn ? 'সংরক্ষিত বেনিফিশিয়ারি ও ১২-অঙ্কের টিআইএন অনুসন্ধান' : 'Combine saved beneficiaries or multiple verified 12-digit TINs'} />
      </AppRadioGroup>

      {isAuthenticated && liabilityMode === 'facilitation' && beneficiaries.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{isBn ? 'সংরক্ষিত বেনিফিশিয়ারি নির্বাচন করুন:' : 'Saved Beneficiaries:'}</p>
            <AppCheckbox data-testid="facilitation-select-all-beneficiaries" checked={allBeneficiariesSelected} indeterminate={!allBeneficiariesSelected && someBeneficiariesSelected} onChange={(_, c) => handleToggleSelectAll(c)} label={isBn ? 'সব নির্বাচন করুন' : 'Select All'} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {beneficiaries.map((b) => (
              <AppCheckbox key={b.id} checked={selectedTaxpayers.some((tp) => tp.tin === b.tin)} onChange={(_, checked) => handleToggleBeneficiary(b, checked)} label={`${b.name.trim() || b.relationship} (${b.tin})`} />
            ))}
          </div>
        </div>
      )}

      {showLookupBox && (
        <div data-testid="alltax-tin-lookup-box" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {liabilityMode === 'own' ? (isBn ? 'একক করদাতার ১২-অঙ্কের টিআইএন যাচাই করুন' : 'Verify Single Taxpayer 12-Digit TIN') : (isBn ? '১২-অঙ্কের টিআইএন অনুসন্ধান করে করদাতা যোগ করুন' : 'Search & Add 12-Digit Taxpayer TIN')}
          </p>
          <AppTinLookupField id="alltax-tin-lookup" label={t('taxpayerTin')} searchLabel={isBn ? 'টিআইএন খুঁজুন' : 'Search TIN'} value={manualTin} onChange={(v) => { setManualTin(v); setLookupResult(null); setLookupError(''); }} onSearch={handleSearchTin} canSearch={manualTin.length === 12} suggestedTins={[...DIRECTORY_SUGGESTED_TINS]} submitOnEnter error={Boolean(lookupError)} helperText={lookupError || t('tinHelperText')} inputTestId="alltax-tin-input" />
          {resultDisplay && (
            <AppTinResultCard testId="alltax-tin-result-card" addButtonTestId="alltax-add-taxpayer-btn" name={resultDisplay.name} maskedTin={resultDisplay.maskedTin} classification={resultDisplay.classification} duplicateMessage={dupLookupMsg} canAdd={!dupLookupMsg} onAdd={handleConfirmLookupTaxpayer} addLabel={liabilityMode === 'own' ? (isBn ? 'করদাতা নির্ধারণ করুন' : 'Set Taxpayer') : (isBn ? 'করদাতা যোগ করুন' : 'Add Taxpayer')} />
          )}
          {isAuthenticated && liabilityMode === 'facilitation' && onSaveNewBeneficiary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <AppCheckbox checked={saveAsBeneficiary} onChange={(_, c) => setSaveAsBeneficiary(c)} label={isBn ? 'বেনিফিশিয়ারি তালিকায় সংরক্ষণ করুন' : 'Save new taxpayer to Beneficiaries'} />
              {saveAsBeneficiary && (
                <AppSelectField label={isBn ? 'সম্পর্ক / ট্যাগ' : 'Relation / Tag'} value={relationship} onChange={(e) => setRelationship(e.target.value as Beneficiary['relationship'])} options={[{ value: 'Clients', label: t('clients') }, { value: 'Father', label: t('father') }, { value: 'Mother', label: t('mother') }, { value: 'Spouse', label: t('spouse') }, { value: 'Son', label: t('son') }, { value: 'Daughter', label: t('daughter') }, { value: 'Siblings', label: t('siblings') }, { value: 'Friends', label: t('friends') }, { value: 'Others', label: t('others') }]} />
              )}
              {saveAsBeneficiary && relationship === 'Others' && (
                <AppTextField label={isBn ? 'সম্পর্ক উল্লেখ করুন' : 'Custom Tag Note'} value={relationshipNote} onChange={(e) => setRelationshipNote(e.target.value)} placeholder={isBn ? 'যেমন: অংশীদার' : 'e.g. Partner'} slotProps={{ htmlInput: { maxLength: 80 } }} />
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

      <div className="flex justify-end pt-2"><AppButton actionType="primary" endIcon={<ArrowRight size={16} />} onClick={handleContinue}>{isBn ? 'কর খাতে এগোতে ক্লিক করুন' : 'Continue to Payment Head'}</AppButton></div>
    </div>
  );
};
