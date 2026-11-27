import type { Components, Theme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { buildFocusVisibleStyle, buildSelectionFocusRing } from './interactionStates';
import type { ThemeColorTokens } from './palette';
import { FORM_TOKENS } from './spacingAndShape';

export function getDatePickerComponents(
  colors: ThemeColorTokens
): Pick<
  Components<Theme>,
  | 'MuiPickersTextField'
  | 'MuiPickersOutlinedInput'
  | 'MuiDateCalendar'
  | 'MuiPickerDay'
  | 'MuiPickersCalendarHeader'
  | 'MuiPickerPopper'
> {
  return {
    MuiPickersTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: FORM_TOKENS.borderRadius,
          backgroundColor: colors.surface.input,
          fontSize: FORM_TOKENS.fontSizeInput,
          lineHeight: 1.5,
          minHeight: FORM_TOKENS.heightMedium,
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
          '&.MuiPickersInputBase-inputSizeSmall, &.MuiInputBase-sizeSmall': {
            minHeight: FORM_TOKENS.heightSmall,
          },
          '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
            borderWidth: '1px',
            transition: 'border-color 150ms ease',
          },
          '&:hover:not(.Mui-disabled):not(.Mui-error):not(.Mui-readOnly) .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.border.hover,
          },
          '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly) .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.border.focus,
            borderWidth: '2px',
          },
          '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly)': buildSelectionFocusRing(colors, false),
          '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.error.main,
          },
          '&.Mui-error.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.error.main,
            borderWidth: '2px',
          },
          '&.Mui-error.Mui-focused': buildSelectionFocusRing(colors, true),
          '&.Mui-disabled': {
            backgroundColor: colors.surface.disabled,
            cursor: 'not-allowed',
          },
          '&.Mui-disabled .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
          },
          '&.Mui-disabled .MuiPickersSectionList-root': {
            color: colors.text.disabled,
            WebkitTextFillColor: colors.text.disabled,
          },
          '&.Mui-readOnly': {
            backgroundColor: colors.surface.readOnly,
          },
          '&.Mui-readOnly:not(.Mui-disabled) .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
            borderStyle: 'dashed',
          },
          '&.Mui-readOnly .MuiPickersSectionList-root': {
            color: colors.text.readOnly,
          },
          '&.Mui-readOnly.Mui-focused': {
            boxShadow: 'none',
          },
        },
        sectionsContainer: {
          padding: `${FORM_TOKENS.paddingYMedium}px 0`,
          '.MuiPickersInputBase-inputSizeSmall &': {
            padding: `${FORM_TOKENS.paddingYSmall}px 0`,
          },
        },
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          borderRadius: FORM_TOKENS.borderRadius,
          marginTop: 4,
          border: `1px solid ${colors.border.default}`,
          backgroundColor: colors.surface.paper,
          backgroundImage: 'none',
          boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.2)',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface.paper,
          color: colors.text.primary,
          borderRadius: FORM_TOKENS.borderRadius,
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          fontWeight: 600,
          color: colors.text.primary,
        },
        switchViewButton: {
          color: colors.adornment,
        },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: {
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.brand.softBg,
          },
          '&.Mui-selected': {
            backgroundColor: colors.brand.main,
            color: '#ffffff',
            fontWeight: 600,
          },
          '&.Mui-selected:hover, &.Mui-selected:focus': {
            backgroundColor: colors.brand.hover,
          },
          '&.MuiPickersDay-today:not(.Mui-selected)': {
            borderColor: colors.brand.main,
          },
          '&.Mui-disabled': {
            color: colors.text.disabled,
          },
          '&.Mui-focusVisible': buildFocusVisibleStyle(colors.focus.outline, 2),
        },
      },
    },
  };
}
