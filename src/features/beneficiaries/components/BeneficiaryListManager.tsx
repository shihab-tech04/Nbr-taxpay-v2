import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, FolderPlus, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppAutocomplete } from '../../../design-system/forms';
import { AppDialog } from '../../../design-system/modals';
import type { Beneficiary, BeneficiaryList } from '../../../types/tax';
import { BeneficiaryListActionPanels } from './BeneficiaryListActionPanels';

interface BeneficiaryListManagerProps {
  lists: readonly BeneficiaryList[];
  beneficiaries: readonly Beneficiary[];
  selectedListId: string;
  onSelectList: (listId: string) => void;
  onCreateList: (name: string) => BeneficiaryList | null;
  onRenameList: (listId: string, name: string) => void;
  onDeleteList: (listId: string, transferToListId?: string) => boolean;
}

export const BeneficiaryListManager: React.FC<BeneficiaryListManagerProps> = ({
  lists, beneficiaries, selectedListId, onSelectList, onCreateList, onRenameList, onDeleteList,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subMode, setSubMode] = useState<'select' | 'create' | 'rename' | 'delete'>('select');
  const [listNameInput, setListNameInput] = useState('');
  const [transferToListId, setTransferToListId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeList = lists.find((l) => l.id === selectedListId) ?? null;
  const currentCount = selectedListId === 'all' ? beneficiaries.length : beneficiaries.filter((b) => b.listId === selectedListId).length;
  const membersInActive = activeList ? beneficiaries.filter((b) => b.listId === activeList.id).length : 0;
  const otherLists = activeList ? lists.filter((l) => l.id !== activeList.id) : [];

  const listOptions = [
    { value: 'all', label: `${t('allListsOption')} (${beneficiaries.length})` },
    ...lists.map((l) => ({
      value: l.id,
      label: `${l.name} (${beneficiaries.filter((b) => b.listId === l.id).length})`,
    })),
  ];

  const closeDialog = () => { setDialogOpen(false); setSubMode('select'); setErrorMsg(''); };

  const handleSaveListName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = listNameInput.trim();
    if (!clean) { setErrorMsg(isBn ? 'তালিকার নাম লিখুন।' : 'List name is required.'); return; }
    if (lists.some((l) => l.name.toLowerCase() === clean.toLowerCase() && (subMode === 'create' || l.id !== selectedListId))) {
      setErrorMsg(isBn ? 'এই নামে একটি তালিকা ইতিমধ্যে আছে।' : 'A list with this name already exists.');
      return;
    }
    if (subMode === 'create') {
      const created = onCreateList(clean);
      if (created) onSelectList(created.id);
    } else if (subMode === 'rename' && activeList) {
      onRenameList(activeList.id, clean);
    }
    setSubMode('select'); setListNameInput(''); setErrorMsg('');
  };

  const triggerText = `${t('filterButtonLabel')}: ${activeList ? activeList.name : t('allListsOption')} (${currentCount})`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2" data-testid="beneficiary-list-filters">
      <div className="flex flex-wrap items-center gap-2">
        <AppButton actionType="secondary" surface={selectedListId === 'all' ? 'outlined' : 'soft'} size="small" data-testid="beneficiary-filter-trigger" startIcon={<Filter size={14} />} onClick={() => { setSubMode('select'); setErrorMsg(''); setDialogOpen(true); }}>
          {triggerText}
        </AppButton>
        {selectedListId !== 'all' && (
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<RotateCcw size={13} />} onClick={() => onSelectList('all')}>
            {t('allListsOption')} ({beneficiaries.length})
          </AppButton>
        )}
      </div>

      <AppDialog open={dialogOpen} onClose={closeDialog} title={t('chooseBeneficiaryListTitle')} maxWidth="xs" id="choose-beneficiary-list-dialog">
        <div className="space-y-4">
          <AppAutocomplete
            label={t('selectedListLabel')}
            value={selectedListId}
            disableClearable
            options={listOptions}
            onChange={(val) => { onSelectList(val || 'all'); setSubMode('select'); setErrorMsg(''); }}
          />

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <AppButton actionType="secondary" surface="soft" size="small" previewRestricted startIcon={<FolderPlus size={14} />} onClick={() => { setListNameInput(''); setErrorMsg(''); setSubMode('create'); }}>
              {t('createListAction')}
            </AppButton>
            {activeList && (
              <>
                <AppButton actionType="secondary" size="small" previewRestricted startIcon={<Pencil size={14} />} onClick={() => { setListNameInput(activeList.name); setErrorMsg(''); setSubMode('rename'); }}>
                  {t('editListAction')}
                </AppButton>
                <AppButton actionType="secondary" intent="destructive" size="small" previewRestricted startIcon={<Trash2 size={14} />} onClick={() => { setTransferToListId(''); setErrorMsg(''); setSubMode('delete'); }}>
                  {t('deleteListAction')}
                </AppButton>
              </>
            )}
          </div>

          <BeneficiaryListActionPanels
            subMode={subMode} activeList={activeList} otherLists={otherLists} membersInActive={membersInActive}
            listNameInput={listNameInput} transferToListId={transferToListId} errorMsg={errorMsg}
            onChangeListNameInput={(val) => { setListNameInput(val); setErrorMsg(''); }}
            onChangeTransferToListId={setTransferToListId} onSaveListName={handleSaveListName}
            onCancelSubMode={() => setSubMode('select')}
            onConfirmDeleteList={() => {
              if (activeList && onDeleteList(activeList.id, membersInActive > 0 ? transferToListId : undefined)) {
                onSelectList('all'); setSubMode('select');
              }
            }}
          />

          <div className="flex justify-end pt-1">
            <AppButton actionType="primary" size="small" onClick={closeDialog}>{isBn ? 'সম্পন্ন' : 'Done'}</AppButton>
          </div>
        </div>
      </AppDialog>
    </div>
  );
};
