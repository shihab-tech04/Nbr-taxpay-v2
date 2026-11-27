import type { Theme } from '@mui/material/styles';
import { getThemeColors, SELECTION_TOKENS } from '../theme';
import type { SelectionPalette } from './selectionContext';

export const RADIO_GROUP_COLUMN_SX = {
  1: { display: 'grid', gridTemplateColumns: '1fr', gap: '12px' },
  2: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
    gap: '12px',
  },
  3: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
    gap: '12px',
  },
} as const;

export function resolveRadioCardSx(options: {
  palette: SelectionPalette;
  isSelected: boolean;
  resolvedError: boolean;
  effectiveDisabled: boolean;
  effectiveReadOnly: boolean;
}) {
  const { palette, isSelected, resolvedError, effectiveDisabled, effectiveReadOnly } = options;

  return (theme: Theme) => {
    const colors = getThemeColors(theme.palette.mode);
    const accentBorder = palette === 'home' ? colors.home.radioSelectedBorder : colors.brand.main;
    const accentBg = palette === 'home' ? colors.home.radioSelectedBg : colors.brand.softBg;
    const hoverBorder = palette === 'home' ? colors.home.radioHoverBorder : colors.border.hover;
    const defaultBorder = palette === 'home' ? colors.home.radioBorder : colors.border.default;
    const focusColor = palette === 'home' ? colors.home.radioHoverBorder : colors.focus.outline;

    return {
      m: 0,
      width: '100%',
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: `${SELECTION_TOKENS.cardGap}px`,
      minHeight: {
        xs: SELECTION_TOKENS.cardMinHeightMobile,
        sm: SELECTION_TOKENS.cardMinHeightDesktop,
      },
      padding: {
        xs: SELECTION_TOKENS.cardPaddingMobile,
        sm: SELECTION_TOKENS.cardPaddingDesktop,
      },
      borderRadius: `${SELECTION_TOKENS.cardBorderRadius}px`,
      border: '1.5px solid',
      borderColor: resolvedError ? colors.error.main : isSelected ? accentBorder : defaultBorder,
      bgcolor: isSelected ? accentBg : colors.surface.paper,
      color: colors.text.primary,
      cursor: effectiveDisabled ? 'not-allowed' : effectiveReadOnly ? 'default' : 'pointer',
      opacity: effectiveDisabled ? 0.62 : 1,
      transition: 'border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease',
      '&:hover':
        effectiveDisabled || effectiveReadOnly
          ? undefined
          : {
              borderColor: resolvedError ? colors.error.hover : hoverBorder,
            },
      '&:focus-within': {
        outline: `2px solid ${resolvedError ? colors.error.main : focusColor}`,
        outlineOffset: 2,
      },
      '& .MuiFormControlLabel-label': {
        flex: 1,
        minWidth: 0,
      },
    };
  };
}
