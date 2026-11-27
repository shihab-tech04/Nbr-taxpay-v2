import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type PublicCapability } from '../../shared/previewPolicy';
import { AppButton, AppIconButton } from '../buttons';
import { getThemeColors, TIN_TOKENS } from '../theme';
import { maskTinForDisplay } from './tinInputUtils';

export interface AppTinResultCardProps {
  tin: string;
  name: string;
  classification?: string | null;
  duplicateMessage?: string;
  classificationError?: string;
  onAdd?: () => void;
  canAdd?: boolean;
  allowRevealTin?: boolean;
  addLabel?: string;
  disabledAddLabel?: string;
  testId?: string;
  summaryTestId?: string;
  addButtonTestId?: string;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
}

export const AppTinResultCard: React.FC<AppTinResultCardProps> = ({
  tin,
  name,
  classification,
  duplicateMessage,
  classificationError,
  onAdd,
  canAdd = false,
  allowRevealTin = false,
  addLabel,
  disabledAddLabel,
  testId,
  summaryTestId,
  addButtonTestId,
  publicCapability = 'none',
  previewRestricted = false,
}) => {
  const { i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const theme = useTheme();
  const colors = getThemeColors(theme.palette.mode);

  const identityKey = `${tin}\u0000${name}`;
  const [revealState, setRevealState] = useState<{ key: string; open: boolean }>({
    key: identityKey,
    open: false,
  });
  const revealed = Boolean(
    allowRevealTin && revealState.key === identityKey && revealState.open
  );

  const displayedTin = revealed ? tin : maskTinForDisplay(tin);

  return (
    <div
      data-testid={testId}
      role="group"
      aria-live="polite"
      aria-atomic="true"
      aria-label={bn ? 'করদাতার অনুসন্ধান ফলাফল' : 'Taxpayer search result'}
      className="grid gap-1 min-w-0 w-full mt-3 px-4 py-3"
      style={{
        border: `1px solid ${colors.tin.cardBorder}`,
        borderRadius: `${TIN_TOKENS.resultCardRadius}px`,
        backgroundColor: colors.surface.paper,
        color: colors.tin.heading,
      }}
    >
      <dl data-testid={summaryTestId} className="m-0 min-w-0">
        <div
          className="flex items-center justify-between gap-3 min-h-[38px]"
          style={{ borderBottom: `1px solid ${colors.tin.divider}` }}
        >
          <dt className="text-xs font-normal" style={{ color: colors.text.secondary }}>
            {bn ? 'করদাতার নাম' : 'Taxpayer name'}
          </dt>
          <dd className="m-0 text-right text-[13px] font-semibold break-words">
            <span>{name}</span>
            {classification ? (
              <span className="font-medium" style={{ color: colors.text.secondary }}>
                {` · ${classification}`}
              </span>
            ) : null}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3 min-h-[38px]">
          <dt className="text-xs font-normal" style={{ color: colors.text.secondary }}>
            {bn ? 'টিআইএন' : 'TIN'}
          </dt>
          <dd className="m-0 flex items-center justify-end gap-2 text-right text-[13px] font-semibold tabular-nums">
            <span>{displayedTin}</span>
            {allowRevealTin && (
              <AppIconButton
                size="small"
                aria-label={
                  revealed
                    ? bn
                      ? 'টিআইএন আড়াল করুন'
                      : 'Hide TIN'
                    : bn
                      ? 'টিআইএন দেখুন'
                      : 'Reveal TIN'
                }
                onClick={() =>
                  setRevealState((prev) => ({
                    key: identityKey,
                    open: !(prev.key === identityKey && prev.open),
                  }))
                }
                sx={{ width: 29, height: 29 }}
              >
                {revealed ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
              </AppIconButton>
            )}
          </dd>
        </div>
      </dl>

      {duplicateMessage && (
        <p role="status" className="m-0 mt-1 text-[13px]" style={{ color: colors.error.main }}>
          {duplicateMessage}
        </p>
      )}
      {classificationError && (
        <p role="status" className="m-0 mt-1 text-[13px]" style={{ color: colors.error.main }}>
          {classificationError}
        </p>
      )}

      {onAdd && (
        <div className="mt-2">
          <AppButton
            actionType="secondary"
            palette="home"
            surface="outlined"
            data-testid={addButtonTestId}
            disabled={!canAdd}
            publicCapability={publicCapability}
            previewRestricted={previewRestricted}
            startIcon={<Plus size={18} aria-hidden="true" />}
            onClick={onAdd}
          >
            {!canAdd && disabledAddLabel
              ? disabledAddLabel
              : addLabel ?? (bn ? 'করদাতা যোগ করুন' : 'Add taxpayer')}
          </AppButton>
        </div>
      )}
    </div>
  );
};
