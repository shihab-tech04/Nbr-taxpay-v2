import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { maskTinForDisplay } from '../../../design-system/forms';
import { getRelationshipLabel } from '../giftTaxLogic';
import type { GiftPartyRecord, GiftRelationship, RemovedPartyUndoState } from '../giftTaxTypes';

interface GiftTaxRightRailExtrasProps {
  donor: GiftPartyRecord | null;
  donee: GiftPartyRecord | null;
  relationship: GiftRelationship | '';
  relationshipTag: string;
  undoParty: RemovedPartyUndoState | null;
  onEditParty: (role: 'donor' | 'donee') => void;
  onRemoveParty: (role: 'donor' | 'donee') => void;
  onUndoRemove: () => void;
}

export const GiftTaxRightRailExtras: React.FC<GiftTaxRightRailExtrasProps> = ({
  donor,
  donee,
  relationship,
  relationshipTag,
  undoParty,
  onEditParty,
  onRemoveParty,
  onUndoRemove,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';

  return (
    <div className="space-y-2.5" data-testid="gift-right-rail-parties">
      {undoParty && (
        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-amber-900 dark:text-amber-200 truncate">
            {isBn ? `${undoParty.party.name} সরানো হয়েছে` : `Removed ${undoParty.party.name}`}
          </span>
          <AppButton actionType="secondary" surface="soft" size="small" startIcon={<RotateCcw size={12} />} onClick={onUndoRemove} data-testid="gift-rail-undo-btn">
            {isBn ? 'পূর্বাবস্থায়' : 'Undo'}
          </AppButton>
        </div>
      )}

      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            {isBn ? 'দাতা (ক্রেডিট ও পক্ষে)' : 'Donor · Credit & On Behalf Of'}
          </span>
          {donor && (
            <div className="flex items-center gap-0.5">
              <AppIconButton size="small" aria-label={isBn ? 'দাতা সম্পাদনা' : 'Edit Donor'} onClick={() => onEditParty('donor')} data-testid="gift-rail-edit-donor">
                <Pencil size={13} />
              </AppIconButton>
              <AppIconButton size="small" intent="destructive" aria-label={isBn ? 'দাতা সরান' : 'Remove Donor'} onClick={() => onRemoveParty('donor')} data-testid="gift-rail-remove-donor">
                <Trash2 size={13} />
              </AppIconButton>
            </div>
          )}
        </div>
        {donor ? (
          <div data-testid="gift-rail-donor-card">
            <div className="font-semibold text-slate-900 dark:text-white break-words">{donor.name}</div>
            <div className="text-[11px] font-mono text-slate-500">{maskTinForDisplay(donor.tin)}</div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500">{isBn ? 'দাতা যোগ করা হয়নি' : 'No Donor added yet'}</div>
        )}
      </div>

      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            {isBn ? 'গ্রহীতা (মাধ্যমে)' : 'Donee · Through'}
          </span>
          {donee && (
            <div className="flex items-center gap-0.5">
              <AppIconButton size="small" aria-label={isBn ? 'গ্রহীতা সম্পাদনা' : 'Edit Donee'} onClick={() => onEditParty('donee')} data-testid="gift-rail-edit-donee">
                <Pencil size={13} />
              </AppIconButton>
              <AppIconButton size="small" intent="destructive" aria-label={isBn ? 'গ্রহীতা সরান' : 'Remove Donee'} onClick={() => onRemoveParty('donee')} data-testid="gift-rail-remove-donee">
                <Trash2 size={13} />
              </AppIconButton>
            </div>
          )}
        </div>
        {donee ? (
          <div data-testid="gift-rail-donee-card">
            <div className="font-semibold text-slate-900 dark:text-white break-words">{donee.name}</div>
            <div className="text-[11px] font-mono text-slate-500">{maskTinForDisplay(donee.tin)}</div>
            {(relationship || relationshipTag) && (
              <div className="text-[11px] text-teal-700 dark:text-teal-300 mt-0.5 break-words">
                {relationship ? getRelationshipLabel(relationship, lang) : ''}
                {relationshipTag ? ` (${relationshipTag})` : ''}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-slate-500">{isBn ? 'গ্রহীতা যোগ করা হয়নি' : 'No Donee added yet'}</div>
        )}
      </div>
    </div>
  );
};
