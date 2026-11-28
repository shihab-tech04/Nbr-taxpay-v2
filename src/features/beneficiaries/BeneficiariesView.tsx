import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { AppButton } from '../../design-system/buttons';
import { AppToast } from '../../design-system/feedback';
import { AppSearchField } from '../../design-system/forms';
import { AppConfirmDialog, AppDialog } from '../../design-system/modals';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { Beneficiary, PaymentTransaction } from '../../types/tax';
import { formatBeneficiaryDisplayTag, validateBeneficiaryInput, type BeneficiaryFormErrors } from './beneficiaryLogic';
import { BeneficiariesTable } from './components/BeneficiariesTable';
import { BeneficiaryForm } from './components/BeneficiaryForm';
import { BeneficiaryListManager } from './components/BeneficiaryListManager';
import { BeneficiaryTimelineDialog } from './components/BeneficiaryTimelineDialog';

export const BeneficiariesView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const {
    activeScope, isAuthenticated, beneficiaryLists, createBeneficiaryList, renameBeneficiaryList,
    deleteBeneficiaryList, beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary, transactions,
  } = useApp();

  const [selectedListId, setSelectedListId] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTarget, setEditingTarget] = useState<Beneficiary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [tin, setTin] = useState('');
  const [relationship, setRelationship] = useState<Beneficiary['relationship']>('Father');
  const [relationshipNote, setRelationshipNote] = useState('');
  const [listId, setListId] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<BeneficiaryFormErrors>({});
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
  const [timelineTarget, setTimelineTarget] = useState<Beneficiary | null>(null);
  const [receiptTx, setReceiptTx] = useState<PaymentTransaction | null>(null);
  const [certTx, setCertTx] = useState<PaymentTransaction | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const listNameById = new Map(beneficiaryLists.map((l) => [l.id, l.name.toLowerCase()]));
  const normalizedQuery = search.trim().toLowerCase();
  const filteredBeneficiaries = beneficiaries.filter((b) => {
    if (selectedListId !== 'all' && b.listId !== selectedListId) return false;
    if (!normalizedQuery) return true;
    const tag = formatBeneficiaryDisplayTag(b, t).toLowerCase();
    const lName = b.listId ? listNameById.get(b.listId) ?? '' : '';
    return b.name.toLowerCase().includes(normalizedQuery) || b.tin.includes(normalizedQuery) || tag.includes(normalizedQuery) || lName.includes(normalizedQuery);
  });

  const isDirty = editingTarget
    ? name !== editingTarget.name || tin !== editingTarget.tin || relationship !== editingTarget.relationship || relationshipNote !== (editingTarget.relationshipNote ?? '') || listId !== (editingTarget.listId ?? '') || phone !== (editingTarget.phone ?? '')
    : Boolean(name.trim() || tin.trim() || phone.trim() || relationshipNote.trim());

  const openCreateModal = () => {
    setEditingTarget(null);
    setName(''); setTin(''); setRelationship('Father'); setRelationshipNote('');
    setListId(selectedListId !== 'all' ? selectedListId : beneficiaryLists[0]?.id ?? '');
    setPhone(''); setErrors({}); setModalOpen(true);
  };

  const openEditModal = (b: Beneficiary) => {
    setEditingTarget(b);
    setName(b.name); setTin(b.tin); setRelationship(b.relationship);
    setRelationshipNote(b.relationshipNote ?? ''); setListId(b.listId ?? '');
    setPhone(b.phone ?? ''); setErrors({}); setModalOpen(true);
  };

  const resetAndCloseModal = () => { setModalOpen(false); setEditingTarget(null); setName(''); setTin(''); setPhone(''); setRelationshipNote(''); setErrors({}); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('beneficiary_write')) return;
    const nextErrors = validateBeneficiaryInput({ name, tin, relationship, relationshipNote, listId, phone }, beneficiaries, editingTarget?.id);
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }
    const payload = {
      name: name.trim(), tin: tin.trim(), relationship,
      relationshipNote: relationship === 'Others' ? relationshipNote.trim() : undefined,
      listId: listId || undefined, phone: phone.trim() || undefined,
    };
    if (editingTarget) {
      updateBeneficiary(editingTarget.id, payload);
      setToastMsg(isBn ? 'বেনিফিশিয়ারি তথ্য হালনাগাদ হয়েছে' : 'Beneficiary updated');
    } else {
      addBeneficiary(payload);
      setToastMsg(isBn ? 'নতুন বেনিফিশিয়ারি যোগ করা হয়েছে' : 'Beneficiary added successfully');
    }
    resetAndCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="text-teal-700" size={28} /> {t('beneficiaries')}</h1>
            <p className="text-xs text-slate-500">{isBn ? 'সহায়তাপ্রাপ্ত কর প্রদানের জন্য তালিকা ও প্রাপক পরিচালনা করুন।' : 'Organize beneficiary lists and manage TIN mappings for facilitated tax payments.'}</p>
          </div>
          <AppButton actionType="primary" size="small" previewRestricted startIcon={<Plus size={16} />} onClick={openCreateModal} sx={{ borderRadius: '12px', px: 2, py: 1.25 }}>
            {t('addBeneficiary')}
          </AppButton>
        </div>

        <BeneficiaryListManager
          lists={beneficiaryLists} beneficiaries={beneficiaries} selectedListId={selectedListId}
          onSelectList={setSelectedListId} onCreateList={createBeneficiaryList}
          onRenameList={renameBeneficiaryList} onDeleteList={deleteBeneficiaryList}
        />

        <div className="max-w-sm">
          <AppSearchField
            label={isBn ? 'বেনিফিশিয়ারি খুঁজুন' : 'Search Beneficiaries'} value={search}
            onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')}
            placeholder={isBn ? 'নাম, টিআইএন, ট্যাগ বা তালিকা লিখুন...' : 'Search by name, TIN, tag, or list...'} clearAriaLabel={t('clearSearch')}
          />
        </div>

        <AppDialog
          open={modalOpen} onClose={resetAndCloseModal}
          title={editingTarget ? (isBn ? 'বেনিফিশিয়ারি সম্পাদনা' : 'Edit Beneficiary') : t('addBeneficiary')}
          maxWidth="md" responsiveBottomSheet isDirty={isDirty} id="add-beneficiary-dialog"
          actions={
            <div className="flex justify-end gap-3 w-full">
              <AppButton type="button" actionType="secondary" size="small" onClick={resetAndCloseModal}>{t('cancel')}</AppButton>
              <AppButton type="submit" form="beneficiary-form" actionType="primary" size="small" previewRestricted>{t('save')}</AppButton>
            </div>
          }
        >
          <BeneficiaryForm
            formId="beneficiary-form" name={name} tin={tin} relationship={relationship} relationshipNote={relationshipNote}
            listId={listId} lists={beneficiaryLists} phone={phone} errors={errors}
            onChangeName={(v) => { setName(v); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
            onChangeTin={(v) => { setTin(v); if (errors.tin) setErrors((p) => ({ ...p, tin: undefined })); }}
            onChangeRelationship={setRelationship}
            onChangeRelationshipNote={(v) => { setRelationshipNote(v); if (errors.relationshipNote) setErrors((p) => ({ ...p, relationshipNote: undefined })); }}
            onChangeListId={setListId}
            onChangePhone={(v) => { setPhone(v); if (errors.phone) setErrors((p) => ({ ...p, phone: undefined })); }}
            onSubmit={handleSubmit}
          />
        </AppDialog>

        <BeneficiariesTable
          beneficiaries={filteredBeneficiaries} lists={beneficiaryLists}
          onMakePayment={(b) => navigate('/all-taxes', { state: { selectedBeneficiary: b } })}
          onViewTimeline={(b) => setTimelineTarget(b)}
          onRequestEdit={(b) => { if (isRestrictedOperationAllowed('beneficiary_write')) openEditModal(b); }}
          onRequestDelete={(b) => { if (isRestrictedOperationAllowed('beneficiary_write')) setDeleteTarget(b); }}
        />
      </div>

      <BeneficiaryTimelineDialog
        beneficiary={timelineTarget} transactions={transactions} ownerScope={activeScope}
        onClose={() => setTimelineTarget(null)} onViewReceipt={(tx) => setReceiptTx(tx)} onViewCertificate={(tx) => setCertTx(tx)}
      />
      <ReceiptModal open={Boolean(receiptTx)} onClose={() => setReceiptTx(null)} transaction={receiptTx} isAuthenticated={isAuthenticated} />
      <PaymentCertificateDialog open={Boolean(certTx)} onClose={() => setCertTx(null)} transaction={certTx} isAuthenticated={isAuthenticated} />

      <AppConfirmDialog
        open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} intent="destructive"
        title={isBn ? 'বেনিফিশিয়ারি মুছে ফেলবেন?' : 'Delete Beneficiary?'}
        message={isBn ? `"${deleteTarget?.name ?? ''}" কে তালিকা থেকে মুছলেও পূর্বের পেমেন্ট রেকর্ড সংরক্ষিত থাকবে।` : `Remove "${deleteTarget?.name ?? ''}" from your saved beneficiaries? Historical payment records will remain preserved.`}
        confirmLabel={t('delete')}
        onConfirm={() => {
          if (!deleteTarget || !isRestrictedOperationAllowed('beneficiary_write')) return;
          deleteBeneficiary(deleteTarget.id);
          setToastMsg(isBn ? 'বেনিফিশিয়ারি মুছে ফেলা হয়েছে' : 'Beneficiary removed');
        }}
      />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
