import type { Components, Theme } from '@mui/material/styles';
import { buildSelectionFocusRing } from './interactionStates';
import type { ThemeColorTokens } from './palette';
import { FORM_TOKENS } from './spacingAndShape';

export function getFormComponents(
  colors: ThemeColorTokens
): Pick<
  Components<Theme>,
  | 'MuiTextField'
  | 'MuiOutlinedInput'
  | 'MuiInputLabel'
  | 'MuiFormHelperText'
  | 'MuiInputAdornment'
> {
  return {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: FORM_TOKENS.borderRadius,
          backgroundColor: colors.surface.input,
          fontSize: FORM_TOKENS.fontSizeInput,
          lineHeight: 1.5,
          minHeight: FORM_TOKENS.heightMedium,
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
          '&.MuiInputBase-sizeSmall': {
            minHeight: FORM_TOKENS.heightSmall,
          },
          '&.MuiInputBase-multiline': {
            minHeight: 'auto',
            padding: `${FORM_TOKENS.paddingYMedium}px ${FORM_TOKENS.paddingX}px`,
          },
          '&.MuiInputBase-multiline.MuiInputBase-sizeSmall': {
            minHeight: 'auto',
            padding: `${FORM_TOKENS.paddingYSmall}px ${FORM_TOKENS.paddingX}px`,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
            borderWidth: '1px',
            transition: 'border-color 150ms ease',
          },
          '&:hover:not(.Mui-disabled):not(.Mui-error):not(.Mui-readOnly) .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.hover,
          },
          '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly) .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.focus,
            borderWidth: '2px',
          },
          '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly)': buildSelectionFocusRing(colors, false),
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.error.main,
          },
          '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.error.main,
            borderWidth: '2px',
          },
          '&.Mui-error.Mui-focused': buildSelectionFocusRing(colors, true),
          '&.Mui-disabled': {
            backgroundColor: colors.surface.disabled,
            cursor: 'not-allowed',
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
          },
          '&.Mui-disabled .MuiOutlinedInput-input': {
            WebkitTextFillColor: colors.text.disabled,
            color: colors.text.disabled,
            cursor: 'not-allowed',
          },
          '&.Mui-readOnly, &:has(input[readonly], textarea[readonly])': {
            backgroundColor: colors.surface.readOnly,
          },
          '&.Mui-readOnly:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline, &:has(input[readonly], textarea[readonly]):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.default,
            borderStyle: 'dashed',
          },
          '&.Mui-readOnly .MuiOutlinedInput-input, &:has(input[readonly], textarea[readonly]) .MuiOutlinedInput-input': {
            color: colors.text.readOnly,
            cursor: 'default',
          },
          '&.Mui-readOnly.Mui-focused': {
            boxShadow: 'none',
          },
        },
        input: {
          padding: `${FORM_TOKENS.paddingYMedium}px ${FORM_TOKENS.paddingX}px`,
          '&.MuiInputBase-inputSizeSmall': {
            padding: `${FORM_TOKENS.paddingYSmall}px ${FORM_TOKENS.paddingX}px`,
          },
          '&.MuiInputBase-inputMultiline': {
            padding: 0,
          },
          '&.MuiInputBase-inputAdornedStart': {
            paddingLeft: 0,
          },
          '&.MuiInputBase-inputAdornedEnd': {
            paddingRight: 0,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: FORM_TOKENS.fontSizeLabel,
          fontWeight: 500,
          '&.MuiInputLabel-sizeSmall': {
            transform: 'translate(14px, 9px) scale(1)',
          },
          '&.MuiInputLabel-sizeSmall.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
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
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 2,
          marginRight: 2,
          marginTop: FORM_TOKENS.helperMarginTop,
          fontSize: FORM_TOKENS.fontSizeHelper,
          lineHeight: 1.4,
          '&.Mui-error': {
            color: colors.error.main,
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: '0 !important',
          display: 'flex',
          alignItems: 'center',
          color: colors.adornment,
          '&.MuiInputAdornment-positionStart': {
            marginRight: FORM_TOKENS.adornmentGap,
          },
          '&.MuiInputAdornment-positionEnd': {
            marginLeft: 4,
          },
        },
      },
    },
  };
}
