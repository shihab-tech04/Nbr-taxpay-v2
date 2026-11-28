import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, Pencil, RotateCcw, Save, Trash2 } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppAutocomplete, AppTextField, AppTinLookupField, AppTinResultCard, maskTinForDisplay, sanitizeTinResultForDisplay } from '../../../design-system/forms';
import { GIFT_SUGGESTED_TINS, canUndoGiftPartyRemoval, getRelationshipLabel, isGiftRelationshipValid } from '../giftTaxLogic';
import { APPROVED_GIFT_RELATIONSHIPS, type GiftFormErrors, type GiftPartyRecord, type GiftRelationship, type RemovedPartyUndoState } from '../giftTaxTypes';

interface GiftTaxPartiesStepProps {
  donor: GiftPartyRecord | null;
  donee: GiftPartyRecord | null;
  donorTinInput: string;
  doneeTinInput: string;
  donorLookupResult: GiftPartyRecord | null;
  doneeLookupResult: GiftPartyRecord | null;
  donorLookupError: string;
  doneeLookupError: string;
  relationship: GiftRelationship | '';
  relationshipTag: string;
  undoParty: RemovedPartyUndoState | null;
  errors: GiftFormErrors;
  isAuthenticated: boolean;
  onChangeDonorTin: (val: string) => void;
  onChangeDoneeTin: (val: string) => void;
  onSearchDonor: () => void;
  onSearchDonee: () => void;
  onAddDonor: () => void;
  onAddDonee: () => void;
  onEditParty: (role: 'donor' | 'donee') => void;
  onRemoveParty: (role: 'donor' | 'donee') => void;
  onUndoRemove: () => void;
  onSelectRelationship: (val: GiftRelationship) => void;
  onChangeRelationshipTag: (val: string) => void;
  onSaveDraft: () => void;
  onNext: () => void;
}

export const GiftTaxPartiesStep: React.FC<GiftTaxPartiesStepProps> = (p) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';
  const relationshipValid = isGiftRelationshipValid(p.relationship, p.relationshipTag);
  const undoCheck = canUndoGiftPartyRemoval(p.undoParty, p.donor, p.donee);
  const donorDupMsg = p.donorLookupResult && p.donee && p.donorLookupResult.tin === p.donee.tin ? (isBn ? 'দাতা ও গ্রহীতার টিআইএন ভিন্ন হতে হবে।' : 'Donor TIN must differ from confirmed Donee TIN.') : undefined;
  const doneeDupMsg = p.doneeLookupResult && p.donor && p.doneeLookupResult.tin === p.donor.tin
    ? (isBn ? 'দাতা ও গ্রহীতার টিআইএন ভিন্ন হতে হবে।' : 'Donee TIN must differ from confirmed Donor TIN.')
    : !relationshipValid && p.doneeLookupResult
      ? (isBn ? 'গ্রহীতা যোগ করার আগে বৈধ সম্পর্ক (এবং অন্যান্য হলে ১–৮০ অক্ষরের বিবরণ) দিন।' : 'Select a valid Donee relationship (and 1–80 char custom label for Others) before clicking Add Donee.')
      : undefined;
  const donorResultDisplay = p.donorLookupResult ? sanitizeTinResultForDisplay({ tin: p.donorLookupResult.tin, name: p.donorLookupResult.name, classification: p.donorLookupResult.classification, allowRevealTin: false }) : null;
  const doneeResultDisplay = p.doneeLookupResult ? sanitizeTinResultForDisplay({ tin: p.doneeLookupResult.tin, name: p.doneeLookupResult.name, classification: p.doneeLookupResult.classification, allowRevealTin: false }) : null;

  return (
    <div className="space-y-5" data-testid="gift-stage-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{isBn ? 'ধাপ ১: এই পেমেন্টে দাতা ও গ্রহীতা' : 'Stage 1 — Donor & Donee in this Payment'}</h3>
        <span className="text-[11px] text-slate-500">{isBn ? 'আলাদা ১২ ডিজিটের টিআইএন যাচাই' : 'Separate 12-digit TIN lookup'}</span>
      </div>

      {p.undoParty && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-2 text-xs">
          <span>
            {!undoCheck.ok
              ? (isBn ? `পূর্বাবস্থায় ফেরানো যাবে না: ${p.undoParty.party.name}-এর টিআইএন অন্য পক্ষে ব্যবহৃত হচ্ছে।` : `Cannot undo ${p.undoParty.party.name}: TIN is already confirmed on the other party.`)
              : (isBn ? `${p.undoParty.party.name} সরানো হয়েছে` : `Removed ${p.undoParty.party.name}`)}
          </span>
          <AppButton actionType="secondary" surface="soft" size="small" disabled={!undoCheck.ok} startIcon={<RotateCcw size={14} />} onClick={p.onUndoRemove} data-testid="gift-undo-remove-btn">
            {isBn ? 'পূর্বাবস্থায় ফেরান' : 'Undo'}
          </AppButton>
        </div>
      )}

      <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3" data-testid="gift-donor-section">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">{isBn ? 'দাতা (Donor · করদাতা ও ক্রেডিট প্রাপক)' : 'Donor (Taxpayer & Credit Attribution)'}</h4>
          {p.donor && <CheckCircle2 size={16} className="text-emerald-600" />}
        </div>
        {p.donor && (
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs" data-testid="gift-donor-confirmed">
            <div><strong className="text-slate-900 dark:text-white">{p.donor.name}</strong><div className="font-mono text-slate-500">{maskTinForDisplay(p.donor.tin)}</div></div>
            <div className="flex items-center gap-1">
              <AppIconButton size="small" aria-label={isBn ? 'দাতা সম্পাদনা' : 'Edit Donor'} onClick={() => p.onEditParty('donor')}><Pencil size={14} /></AppIconButton>
              <AppIconButton size="small" intent="destructive" aria-label={isBn ? 'দাতা সরান' : 'Remove Donor'} onClick={() => p.onRemoveParty('donor')}><Trash2 size={14} /></AppIconButton>
            </div>
          </div>
        )}
        <AppTinLookupField id="gift-donor-tin-lookup" label={t('giftDonorTin')} searchLabel={isBn ? 'দাতার টিআইএন খুঁজুন' : 'Search Donor TIN'} value={p.donorTinInput} onChange={p.onChangeDonorTin} onSearch={p.onSearchDonor} canSearch={p.donorTinInput.length === 12} suggestedTins={[...GIFT_SUGGESTED_TINS]} submitOnEnter error={Boolean(p.donorLookupError || p.errors.donor)} helperText={p.donorLookupError || p.errors.donor || t('tinHelperText')} inputTestId="gift-donor-tin-input" />
        {donorResultDisplay && (
          <AppTinResultCard testId="gift-donor-result-card" addButtonTestId="gift-add-donor-btn" name={donorResultDisplay.name} maskedTin={donorResultDisplay.maskedTin} classification={donorResultDisplay.classification} duplicateMessage={donorDupMsg} canAdd={!donorDupMsg} onAdd={p.onAddDonor} addLabel={isBn ? 'দাতা যোগ করুন' : 'Add Donor'} />
        )}
      </section>

      <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3" data-testid="gift-donee-section">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">{isBn ? 'গ্রহীতা (Donee · মাধ্যমে)' : 'Donee (Recipient · Through)'}</h4>
          {p.donee && <CheckCircle2 size={16} className="text-emerald-600" />}
        </div>
        {p.donee && (
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs" data-testid="gift-donee-confirmed">
            <div><strong className="text-slate-900 dark:text-white">{p.donee.name}</strong><div className="font-mono text-slate-500">{maskTinForDisplay(p.donee.tin)}</div></div>
            <div className="flex items-center gap-1">
              <AppIconButton size="small" aria-label={isBn ? 'গ্রহীতা সম্পাদনা' : 'Edit Donee'} onClick={() => p.onEditParty('donee')}><Pencil size={14} /></AppIconButton>
              <AppIconButton size="small" intent="destructive" aria-label={isBn ? 'গ্রহীতা সরান' : 'Remove Donee'} onClick={() => p.onRemoveParty('donee')}><Trash2 size={14} /></AppIconButton>
            </div>
          </div>
        )}
        <div className={`grid grid-cols-1 ${p.relationship === 'Others' ? 'sm:grid-cols-2' : ''} gap-3`}>
          <AppAutocomplete
            label={t('relationship')}
            value={p.relationship || null}
            required
            error={Boolean(p.errors.relationship)}
            helperText={p.errors.relationship || t('relationshipHelper')}
            onChange={(val) => p.onSelectRelationship((val ?? '') as GiftRelationship)}
            options={APPROVED_GIFT_RELATIONSHIPS.map((rel) => ({
              value: rel,
              label: getRelationshipLabel(rel, lang),
            }))}
          />
          {p.relationship === 'Others' && (
            <AppTextField data-testid="gift-others-relationship-input" label={isBn ? 'অন্যান্য সম্পর্কের বিবরণ (১–৮০ অক্ষর)' : 'Custom Relationship / Tag (1–80 chars)'} value={p.relationshipTag} required error={Boolean(p.errors.relationshipTag)} helperText={p.errors.relationshipTag || (isBn ? 'অন্যান্য সম্পর্কের বিবরণ দিন (১–৮০ অক্ষর)' : 'Required for Others (1–80 characters)')} onChange={(e) => p.onChangeRelationshipTag(e.target.value)} slotProps={{ htmlInput: { maxLength: 80 } }} />
          )}
        </div>
        <AppTinLookupField id="gift-donee-tin-lookup" label={t('giftDoneeTin')} searchLabel={isBn ? 'গ্রহীতার টিআইএন খুঁজুন' : 'Search Donee TIN'} value={p.doneeTinInput} onChange={p.onChangeDoneeTin} onSearch={p.onSearchDonee} canSearch={p.doneeTinInput.length === 12} suggestedTins={[...GIFT_SUGGESTED_TINS]} submitOnEnter error={Boolean(p.doneeLookupError || p.errors.donee)} helperText={p.doneeLookupError || p.errors.donee || t('tinHelperText')} inputTestId="gift-donee-tin-input" />
        {doneeResultDisplay && (
          <AppTinResultCard testId="gift-donee-result-card" addButtonTestId="gift-add-donee-btn" name={doneeResultDisplay.name} maskedTin={doneeResultDisplay.maskedTin} classification={doneeResultDisplay.classification} duplicateMessage={doneeDupMsg} canAdd={!doneeDupMsg && relationshipValid} onAdd={p.onAddDonee} addLabel={isBn ? 'গ্রহীতা যোগ করুন' : 'Add Donee'} />
        )}
      </section>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        {p.isAuthenticated ? <AppButton actionType="secondary" surface="outlined" startIcon={<Save size={15} />} onClick={p.onSaveDraft} previewRestricted>{t('saveDraft')}</AppButton> : <span />}
        <AppButton actionType="primary" endIcon={<ArrowRight size={16} />} onClick={p.onNext} previewRestricted>{isBn ? 'পরবর্তী: দান ও কর তথ্য' : 'Next: Gift & Tax Information'}</AppButton>
      </div>
    </div>
  );
};
