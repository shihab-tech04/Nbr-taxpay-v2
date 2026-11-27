import type { Components, Theme } from '@mui/material/styles';
import { buildFocusVisibleStyle } from './interactionStates';
import type { ThemeColorTokens } from './palette';
import { FORM_TOKENS, SELECTION_TOKENS } from './spacingAndShape';

export function getSelectionComponents(
  colors: ThemeColorTokens
): Pick<
  Components<Theme>,
  | 'MuiCheckbox'
  | 'MuiRadio'
  | 'MuiRadioGroup'
  | 'MuiSwitch'
  | 'MuiFormControl'
  | 'MuiFormLabel'
  | 'MuiFormControlLabel'
> {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: FORM_TOKENS.fontSizeLabel,
          fontWeight: 600,
          color: colors.text.primary,
          marginBottom: 6,
          '&.Mui-focused:not(.Mui-error)': {
            color: colors.border.focus,
          },
          '&.Mui-error': {
            color: colors.error.main,
          },
          '&.Mui-disabled': {
            color: colors.text.disabled,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          alignItems: 'flex-start',
          gap: 8,
          '&.Mui-disabled': {
            cursor: 'not-allowed',
          },
          '&.Mui-readOnly': {
            cursor: 'default',
          },
        },
        label: {
          fontSize: SELECTION_TOKENS.labelFontSizeMedium,
          fontWeight: 500,
          lineHeight: 1.45,
          color: colors.text.primary,
          '&.Mui-disabled': {
            color: colors.text.disabled,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 4,
          marginTop: -2,
          borderRadius: 6,
          color: colors.border.default,
          transition: 'color 150ms ease, background-color 150ms ease',
          '&:hover:not(.Mui-disabled):not(.Mui-readOnly)': {
            backgroundColor: colors.brand.softBg,
            color: colors.brand.main,
          },
          '&.Mui-checked, &.MuiCheckbox-indeterminate': {
            color: colors.brand.main,
          },
          '&.Mui-error': {
            color: colors.error.main,
          },
          '&.Mui-disabled': {
            color: colors.text.disabled,
            cursor: 'not-allowed',
          },
          '&.Mui-readOnly': {
            color: colors.text.readOnly,
            cursor: 'default',
            pointerEvents: 'none',
          },
          '&.Mui-focusVisible': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 4,
          marginTop: -2,
          color: colors.border.default,
          transition: 'color 150ms ease, background-color 150ms ease',
          '&:hover:not(.Mui-disabled):not(.Mui-readOnly)': {
            backgroundColor: colors.brand.softBg,
            color: colors.brand.main,
          },
          '&.Mui-checked': {
            color: colors.brand.main,
          },
          '&.Mui-error': {
            color: colors.error.main,
          },
          '&.Mui-disabled': {
            color: colors.text.disabled,
            cursor: 'not-allowed',
          },
          '&.Mui-readOnly': {
            color: colors.text.readOnly,
            cursor: 'default',
            pointerEvents: 'none',
          },
          '&.Mui-focusVisible': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
      },
    },
    MuiRadioGroup: {
      styleOverrides: {
        root: {
          gap: SELECTION_TOKENS.groupGap,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 7,
          '&.Mui-disabled': {
            cursor: 'not-allowed',
          },
          '&.Mui-readOnly': {
            cursor: 'default',
            pointerEvents: 'none',
          },
        },
        switchBase: {
          transitionDuration: '180ms',
          '&.Mui-checked': {
            color: '#FFFFFF',
            '& + .MuiSwitch-track': {
              backgroundColor: colors.brand.main,
              opacity: 1,
            },
          },
          '&.Mui-disabled': {
            color: colors.switchThumbDisabled,
            '& + .MuiSwitch-track': {
              opacity: 0.45,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
        track: {
          borderRadius: 999,
          backgroundColor: colors.switchTrackOff,
          opacity: 0.65,
        },
      },
    },
  };
}
