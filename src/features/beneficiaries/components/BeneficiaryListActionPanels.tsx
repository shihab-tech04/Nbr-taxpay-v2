import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../../../design-system/buttons';
import { AppAutocomplete, AppTextField } from '../../../design-system/forms';
import type { BeneficiaryList } from '../../../types/tax';

interface BeneficiaryListActionPanelsProps {
  subMode: 'select' | 'create' | 'rename' | 'delete';
  activeList: BeneficiaryList | null;
  otherLists: readonly BeneficiaryList[];
  membersInActive: number;
  listNameInput: string;
  transferToListId: string;
  errorMsg: string;
  onChangeListNameInput: (val: string) => void;
  onChangeTransferToListId: (val: string) => void;
  onSaveListName: (e: React.FormEvent) => void;
  onCancelSubMode: () => void;
  onConfirmDeleteList: () => void;
}

export const BeneficiaryListActionPanels: React.FC<BeneficiaryListActionPanelsProps> = ({
  subMode,
  activeList,
  otherLists,
  membersInActive,
  listNameInput,
  transferToListId,
  errorMsg,
  onChangeListNameInput,
  onChangeTransferToListId,
  onSaveListName,
  onCancelSubMode,
  onConfirmDeleteList,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  if (subMode === 'create' || subMode === 'rename') {
    return (
      <form
        onSubmit={onSaveListName}
        className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
      >
        <AppTextField
          label={isBn ? 'তালিকার নাম' : 'List Label'}
          value={listNameInput}
          onChange={(e) => onChangeListNameInput(e.target.value)}
          error={Boolean(errorMsg)}
          helperText={errorMsg}
          required
        />
        <div className="flex justify-end gap-2">
          <AppButton type="button" actionType="secondary" size="small" onClick={onCancelSubMode}>{t('cancel')}</AppButton>
          <AppButton type="submit" actionType="primary" size="small" previewRestricted>{t('save')}</AppButton>
        </div>
      </form>
    );
  }

  if (subMode === 'delete' && activeList) {
    return (
      <div className="space-y-3 p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-xs">
        {membersInActive > 0 ? (
          otherLists.length === 0 ? (
            <p role="alert" className="text-rose-700 dark:text-rose-300">
              {isBn
                ? 'এই তালিকায় সদস্য রয়েছে এবং স্থানান্তর করার জন্য অন্য কোনো তালিকা নেই। প্রথমে নতুন তালিকা তৈরি করুন।'
                : 'This list has members and no target list exists. Create another list first.'}
            </p>
          ) : (
            <>
              <p className="text-slate-700 dark:text-slate-200">
                {isBn
                  ? `এই তালিকায় ${membersInActive} জন সদস্য রয়েছে। মুছে ফেলার আগে স্থানান্তরের তালিকা নির্বাচন করুন:`
                  : `${membersInActive} beneficiary(ies) belong to "${activeList.name}". Choose a transfer list before deleting:`}
              </p>
              <AppAutocomplete
                label={isBn ? 'স্থানান্তর তালিকা' : 'Transfer Members To'}
                value={transferToListId || null}
                disableClearable
                options={otherLists.map((l) => ({ value: l.id, label: l.name }))}
                onChange={onChangeTransferToListId}
                required
              />
            </>
          )
        ) : (
          <p className="text-slate-600 dark:text-slate-300">
            {isBn ? `"${activeList.name}" তালিকাটি মুছে ফেলা হবে।` : `Delete empty list "${activeList.name}" permanently?`}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <AppButton type="button" actionType="secondary" size="small" onClick={onCancelSubMode}>{t('cancel')}</AppButton>
          <AppButton
            type="button"
            actionType="primary"
            intent="destructive"
            size="small"
            disabled={membersInActive > 0 && (otherLists.length === 0 || !transferToListId)}
            onClick={onConfirmDeleteList}
          >
            {t('delete')}
          </AppButton>
        </div>
      </div>
    );
  }

  return null;
};
