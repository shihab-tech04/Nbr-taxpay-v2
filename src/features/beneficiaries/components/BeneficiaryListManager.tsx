import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextField } from '../../../design-system/forms';
import { AppDialog } from '../../../design-system/modals';
import type { Beneficiary, BeneficiaryList } from '../../../types/tax';

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
  const [modalMode, setModalMode] = useState<'create' | 'rename' | null>(null);
  const [listNameInput, setListNameInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<BeneficiaryList | null>(null);
  const [transferToListId, setTransferToListId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeList = lists.find((l) => l.id === selectedListId) ?? null;
  const membersInDeleteTarget = deleteTarget ? beneficiaries.filter((b) => b.listId === deleteTarget.id).length : 0;
  const otherLists = deleteTarget ? lists.filter((l) => l.id !== deleteTarget.id) : [];

  const handleSaveListName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = listNameInput.trim();
    if (!clean) { setErrorMsg(isBn ? 'তালিকার নাম লিখুন।' : 'List name is required.'); return; }
    if (lists.some((l) => l.name.toLowerCase() === clean.toLowerCase() && (modalMode === 'create' || l.id !== selectedListId))) {
      setErrorMsg(isBn ? 'এই নামে একটি তালিকা ইতিমধ্যে আছে।' : 'A list with this name already exists.');
      return;
    }
    if (modalMode === 'create') {
      const created = onCreateList(clean);
      if (created) onSelectList(created.id);
    } else if (modalMode === 'rename' && activeList) {
      onRenameList(activeList.id, clean);
    }
    setModalMode(null);
    setListNameInput('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2" data-testid="beneficiary-list-filters">
          {selectedListId === 'all' ? (
            <AppButton actionType="primary" size="small" onClick={() => onSelectList('all')}>
              {isBn ? `সব (${beneficiaries.length})` : `All (${beneficiaries.length})`}
            </AppButton>
          ) : (
            <AppButton actionType="secondary" surface="outlined" size="small" onClick={() => onSelectList('all')}>
              {isBn ? `সব (${beneficiaries.length})` : `All (${beneficiaries.length})`}
            </AppButton>
          )}
          {lists.map((list) => {
            const count = beneficiaries.filter((b) => b.listId === list.id).length;
            const active = selectedListId === list.id;
            const label = `${list.name} (${count})`;
            return active ? (
              <AppButton key={list.id} actionType="primary" size="small" onClick={() => onSelectList(list.id)}>{label}</AppButton>
            ) : (
              <AppButton key={list.id} actionType="secondary" surface="outlined" size="small" onClick={() => onSelectList(list.id)}>{label}</AppButton>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AppButton actionType="secondary" surface="soft" size="small" previewRestricted startIcon={<FolderPlus size={14} />} onClick={() => { setListNameInput(''); setErrorMsg(''); setModalMode('create'); }}>
            {isBn ? 'নতুন তালিকা' : 'New List'}
          </AppButton>
          {activeList && (
            <>
              <AppButton actionType="secondary" size="small" previewRestricted startIcon={<Pencil size={14} />} onClick={() => { setListNameInput(activeList.name); setErrorMsg(''); setModalMode('rename'); }}>
                {isBn ? 'নাম বদলান' : 'Rename List'}
              </AppButton>
              <AppButton actionType="secondary" intent="destructive" size="small" previewRestricted startIcon={<Trash2 size={14} />} onClick={() => { setDeleteTarget(activeList); setTransferToListId(lists.find((l) => l.id !== activeList.id)?.id ?? ''); setErrorMsg(''); }}>
                {isBn ? 'তালিকা মুছুন' : 'Delete List'}
              </AppButton>
            </>
          )}
        </div>
      </div>

      <AppDialog open={Boolean(modalMode)} onClose={() => setModalMode(null)} title={modalMode === 'create' ? (isBn ? 'নতুন বেনিফিশিয়ারি তালিকা' : 'Create Beneficiary List') : (isBn ? 'তালিকার নাম পরিবর্তন' : 'Rename List')} maxWidth="xs">
        <form onSubmit={handleSaveListName} className="space-y-4">
          <AppTextField label={isBn ? 'তালিকার নাম' : 'List Label'} value={listNameInput} onChange={(e) => { setListNameInput(e.target.value); setErrorMsg(''); }} error={Boolean(errorMsg)} helperText={errorMsg} required />
          <div className="flex justify-end gap-2">
            <AppButton type="button" actionType="secondary" size="small" onClick={() => setModalMode(null)}>{t('cancel')}</AppButton>
            <AppButton type="submit" actionType="primary" size="small" previewRestricted>{t('save')}</AppButton>
          </div>
        </form>
      </AppDialog>

      <AppDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title={isBn ? 'তালিকা মুছে ফেলবেন?' : `Delete "${deleteTarget?.name ?? ''}"?`} maxWidth="xs">
        <div className="space-y-4 text-xs">
          {membersInDeleteTarget > 0 ? (
            otherLists.length === 0 ? (
              <p role="alert" className="text-rose-700">{isBn ? 'এই তালিকায় সদস্য রয়েছে এবং স্থানান্তর করার জন্য অন্য কোনো তালিকা নেই। প্রথমে নতুন তালিকা তৈরি করুন।' : 'This list is not empty and no target list exists. Create another list first before deleting it.'}</p>
            ) : (
              <>
                <p className="text-slate-600 dark:text-slate-300">{isBn ? `এই তালিকায় ${membersInDeleteTarget} জন সদস্য রয়েছে। মুছে ফেলার আগে তাদের কোন তালিকায় স্থানান্তর করবেন তা নির্বাচন করুন:` : `${membersInDeleteTarget} beneficiary(ies) belong to this list. Select a target list to transfer them before deletion:`}</p>
                <AppSelectField label={isBn ? 'স্থানান্তর তালিকা' : 'Transfer Members To'} value={transferToListId} onChange={(e) => setTransferToListId(e.target.value)} options={otherLists.map((l) => ({ value: l.id, label: l.name }))} required />
              </>
            )
          ) : (
            <p className="text-slate-600 dark:text-slate-300">{isBn ? 'খালি তালিকাটি স্থায়ীভাবে মুছে ফেলা হবে।' : 'This empty list will be deleted permanently.'}</p>
          )}
          <div className="flex justify-end gap-2">
            <AppButton type="button" actionType="secondary" size="small" onClick={() => setDeleteTarget(null)}>{t('cancel')}</AppButton>
            <AppButton
              type="button"
              actionType="primary"
              intent="destructive"
              size="small"
              disabled={membersInDeleteTarget > 0 && (otherLists.length === 0 || !transferToListId)}
              onClick={() => {
                if (!deleteTarget) return;
                if (onDeleteList(deleteTarget.id, membersInDeleteTarget > 0 ? transferToListId : undefined)) {
                  onSelectList('all');
                  setDeleteTarget(null);
                }
              }}
            >
              {t('delete')}
            </AppButton>
          </div>
        </div>
      </AppDialog>
    </div>
  );
};
