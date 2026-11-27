import type { Components, Theme } from '@mui/material/styles';
import { buildFocusVisibleStyle } from './interactionStates';
import type { ThemeColorTokens } from './palette';
import { FORM_TOKENS } from './spacingAndShape';

export function getAutocompleteComponents(
  colors: ThemeColorTokens
): Pick<Components<Theme>, 'MuiAutocomplete'> {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '2px 10px',
            minHeight: FORM_TOKENS.heightMedium,
          },
          '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
            padding: '2px 8px',
            minHeight: FORM_TOKENS.heightSmall,
          },
          '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
            padding: '6px 4px',
          },
          '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input': {
            padding: '5px 4px',
          },
        },
        paper: {
          borderRadius: FORM_TOKENS.borderRadius,
          marginTop: 4,
          border: `1px solid ${colors.border.default}`,
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.16)',
          backgroundImage: 'none',
        },
        listbox: {
          padding: '4px 0',
          maxHeight: 'min(320px, 42vh)',
          overscrollBehavior: 'contain',
          '& .MuiAutocomplete-option': {
            fontSize: FORM_TOKENS.fontSizeInput,
            minHeight: 40,
            padding: '8px 14px',
            '&[aria-selected="true"]': {
              backgroundColor: colors.selectedItemBg,
              fontWeight: 600,
            },
            '&[aria-selected="true"].Mui-focused': {
              backgroundColor: colors.selectedItemHoverBg,
            },
            '&.Mui-focused': {
              backgroundColor: colors.brand.softBg,
            },
            '&[aria-disabled="true"]': {
              opacity: 0.5,
            },
          },
        },
        groupLabel: {
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: colors.brand.main,
          backgroundColor: colors.surface.paper,
          lineHeight: '28px',
          padding: '6px 14px 4px',
        },
        noOptions: {
          fontSize: FORM_TOKENS.fontSizeInput,
          color: colors.text.secondary,
          padding: '12px 14px',
        },
        loading: {
          fontSize: FORM_TOKENS.fontSizeInput,
          color: colors.text.secondary,
          padding: '12px 14px',
        },
        clearIndicator: {
          color: colors.adornment,
          '&.Mui-focusVisible': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
        popupIndicator: {
          color: colors.adornment,
          '&.Mui-focusVisible': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
      },
    },
  };
}
