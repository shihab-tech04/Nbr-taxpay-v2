import React from 'react';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { getThemeColors, TIN_TOKENS } from '../theme';

interface AppTinSuggestionsPopperProps {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  value: string;
  options: readonly string[];
  onSelect: (option: string) => void;
  onDismiss: () => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const AppTinSuggestionsPopper: React.FC<AppTinSuggestionsPopperProps> = ({
  id,
  open,
  anchorEl,
  value,
  options,
  onSelect,
  onDismiss,
  listRef,
  inputRef,
}) => {
  const { i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const theme = useTheme();
  const colors = getThemeColors(theme.palette.mode);

  const anchorWidth = anchorEl?.getBoundingClientRect().width;

  return (
    <Popper
      open={Boolean(open && anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        { name: 'flip', enabled: false },
        { name: 'preventOverflow', enabled: true, options: { boundary: 'viewport', padding: 8 } },
      ]}
      sx={{
        zIndex: (muiTheme) => muiTheme.zIndex.modal + 10,
        width: anchorWidth ? `${anchorWidth}px` : undefined,
        maxWidth: 'calc(100vw - 16px)',
      }}
    >
      <Paper
        ref={listRef}
        id={id}
        role="listbox"
        data-placement="below"
        aria-label={
          bn ? 'নমুনা টিআইএন — সরকারি যাচাইকৃত নয়' : 'Sample TIN suggestions — not NBR verified'
        }
        elevation={6}
        sx={{
          mt: 0.5,
          maxHeight: `${TIN_TOKENS.suggestionsMaxHeight}px`,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          borderRadius: `${TIN_TOKENS.cardRadius}px`,
          border: `1px solid ${colors.tin.suggestionBorder}`,
          backgroundImage: 'none',
        }}
      >
        <p
          role="presentation"
          className="m-0 px-3 py-2 text-xs font-medium"
          style={{
            color: colors.text.secondary,
            borderBottom: `1px solid ${colors.tin.divider}`,
          }}
        >
          {bn ? 'নমুনা টিআইএন নম্বর — NBR যাচাইকৃত নয়' : 'Sample TIN numbers — not verified NBR records'}
        </p>

        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={value === option}
            onMouseDown={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onDismiss();
              } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const items = Array.from(
                  listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []
                );
                const idx = items.indexOf(event.currentTarget);
                const next = event.key === 'ArrowDown' ? idx + 1 : idx - 1;
                if (items[next]) items[next].focus();
                else inputRef.current?.focus();
              }
            }}
            onClick={() => onSelect(option)}
            className="flex w-full min-h-[40px] items-center justify-between px-3 py-2 text-left text-sm font-medium tabular-nums border-0 cursor-pointer transition-colors"
            style={{
              backgroundColor: value === option ? colors.tin.suggestionHoverBg : colors.surface.paper,
              color: colors.tin.heading,
              borderBottom: `1px solid ${colors.tin.divider}`,
            }}
          >
            <span>{option}</span>
          </button>
        ))}

        {!options.length && (
          <p
            role="presentation"
            className="m-0 px-3 py-2.5 text-xs"
            style={{ color: colors.error.main }}
          >
            {bn ? 'কোনো প্রস্তাবিত টিআইএন নেই।' : 'No matching suggested TIN.'}
          </p>
        )}
      </Paper>
    </Popper>
  );
};
