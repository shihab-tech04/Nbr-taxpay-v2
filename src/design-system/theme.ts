import { createTheme } from '@mui/material/styles';

export const FORM_TOKENS = {
  heightSmall: 40,
  heightMedium: 48,
  borderRadius: 8,
  fontSizeInput: '0.875rem',
  fontSizeLabel: '0.875rem',
  fontSizeHelper: '0.75rem',
  paddingX: 14,
  paddingYSmall: 8.5,
  paddingYMedium: 12,
  helperMarginTop: 4,
  adornmentGap: 8,
} as const;

export const BUTTON_TOKENS = {
  heightSmall: 36,
  heightMedium: 40,
  heightLarge: 48,
  borderRadius: 10,
  heroBorderRadius: 12,
  iconRadius: 8,
  cardRadius: 20,
  fontSizeSmall: '0.75rem',
  fontSizeMedium: '0.875rem',
  fontSizeLarge: '0.90625rem',
  paddingSmall: '6px 14px',
  paddingMedium: '8px 18px',
  paddingLarge: '10px 24px',
  iconGap: 8,
  iconSizeSmall: 16,
  iconSizeMedium: 18,
  homePrimary: '#2F55A4',
  homePrimaryHover: '#1F3C7A',
  homeAccentText: '#1C3D70',
  homeAccentBorder: '#CAD8EF',
  homeAccentBgHover: '#F4F7FC',
  confirmMain: '#10B981',
  confirmHover: '#059669',
  confirmText: '#022C22',
} as const;

export const getTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';
  const formColors = {
    borderDefault: isLight ? '#CBD5E1' : '#334155',
    borderHover: isLight ? '#0F766E' : '#2DD4BF',
    borderFocus: isLight ? '#0F766E' : '#14B8A6',
    borderError: isLight ? '#E11D48' : '#FB7185',
    bgInput: isLight ? '#FFFFFF' : '#0F172A',
    bgDisabled: isLight ? '#F1F5F9' : 'rgba(15, 23, 42, 0.72)',
    bgReadOnly: isLight ? '#F8FAFC' : 'rgba(30, 41, 59, 0.65)',
    textDisabled: isLight ? '#64748B' : '#94A3B8',
    textReadOnly: isLight ? '#334155' : '#CBD5E1',
    adornment: isLight ? '#64748B' : '#94A3B8',
    focusRing: isLight ? 'rgba(15, 118, 110, 0.14)' : 'rgba(20, 184, 166, 0.22)',
    errorFocusRing: isLight ? 'rgba(225, 29, 72, 0.14)' : 'rgba(251, 113, 133, 0.22)',
    selectedItemBg: isLight ? 'rgba(15, 118, 110, 0.1)' : 'rgba(20, 184, 166, 0.18)',
    selectedItemHoverBg: isLight ? 'rgba(15, 118, 110, 0.16)' : 'rgba(20, 184, 166, 0.26)',
  };

  const buttonColors = {
    focusOutline: isLight ? '#0F766E' : '#2DD4BF',
    neutralBg: isLight ? '#F1F5F9' : '#1E293B',
    neutralHover: isLight ? '#E2E8F0' : '#334155',
    neutralBorder: isLight ? '#CBD5E1' : '#334155',
    neutralText: isLight ? '#0F172A' : '#F8FAFC',
    disabledBg: isLight ? '#E2E8F0' : '#1E293B',
    disabledText: isLight ? '#64748B' : '#94A3B8',
  };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0F766E',
        light: '#14B8A6',
        dark: '#115E59',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0D9488',
        light: '#2DD4BF',
        dark: '#0F766E',
        contrastText: '#ffffff',
      },
      error: {
        main: formColors.borderError,
      },
      background: {
        default: isLight ? '#F8FAFC' : '#0F172A',
        paper: isLight ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: isLight ? '#0F172A' : '#F8FAFC',
        secondary: isLight ? '#475569' : '#94A3B8',
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Noto Sans Bengali', sans-serif",
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        lineHeight: 1.35,
      },
    },
    shape: {
      borderRadius: FORM_TOKENS.borderRadius,
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontFamily: 'inherit',
            '&:focus-visible': {
              outline: `2px solid ${buttonColors.focusOutline}`,
              outlineOffset: 2,
            },
            '&.Mui-disabled': {
              cursor: 'not-allowed',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: BUTTON_TOKENS.borderRadius,
            minHeight: BUTTON_TOKENS.heightMedium,
            padding: BUTTON_TOKENS.paddingMedium,
            fontSize: BUTTON_TOKENS.fontSizeMedium,
            fontWeight: 600,
            lineHeight: 1.35,
            gap: BUTTON_TOKENS.iconGap,
            boxShadow: 'none',
            transition:
              'background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 140ms ease',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active:not(:disabled)': {
              transform: 'scale(0.985)',
            },
            '&.MuiButton-sizeSmall': {
              minHeight: BUTTON_TOKENS.heightSmall,
              padding: BUTTON_TOKENS.paddingSmall,
              fontSize: BUTTON_TOKENS.fontSizeSmall,
            },
            '&.MuiButton-sizeLarge': {
              minHeight: BUTTON_TOKENS.heightLarge,
              padding: BUTTON_TOKENS.paddingLarge,
              fontSize: BUTTON_TOKENS.fontSizeLarge,
              borderRadius: BUTTON_TOKENS.heroBorderRadius,
            },
            '&.Mui-disabled': {
              cursor: 'not-allowed',
              pointerEvents: 'auto',
              opacity: 0.62,
            },
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              margin: 0,
            },
            '&.MuiButton-containedPrimary': {
              backgroundColor: '#0F766E',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#115E59',
              },
              '&.Mui-disabled': {
                backgroundColor: buttonColors.disabledBg,
                color: buttonColors.disabledText,
              },
            },
            '&.MuiButton-outlinedPrimary': {
              borderColor: buttonColors.neutralBorder,
              color: buttonColors.neutralText,
              '&:hover': {
                borderColor: formColors.borderHover,
                backgroundColor: isLight ? 'rgba(15, 118, 110, 0.06)' : 'rgba(45, 212, 191, 0.1)',
              },
            },
            '&.MuiButton-containedError': {
              backgroundColor: formColors.borderError,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: isLight ? '#BE123C' : '#F43F5E',
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: BUTTON_TOKENS.iconRadius,
            transition: 'background-color 150ms ease, color 150ms ease, transform 140ms ease',
            '&:active:not(:disabled)': {
              transform: 'scale(0.96)',
            },
            '&.Mui-disabled': {
              cursor: 'not-allowed',
              pointerEvents: 'auto',
              opacity: 0.48,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            backgroundImage: 'none',
          },
        },
      },
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
            backgroundColor: formColors.bgInput,
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
              borderColor: formColors.borderDefault,
              borderWidth: '1px',
              transition: 'border-color 150ms ease',
            },
            '&:hover:not(.Mui-disabled):not(.Mui-error):not(.Mui-readOnly) .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderHover,
            },
            '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly) .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderFocus,
              borderWidth: '2px',
            },
            '&.Mui-focused:not(.Mui-error):not(.Mui-readOnly)': {
              boxShadow: `0 0 0 3px ${formColors.focusRing}`,
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderError,
            },
            '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderError,
              borderWidth: '2px',
            },
            '&.Mui-error.Mui-focused': {
              boxShadow: `0 0 0 3px ${formColors.errorFocusRing}`,
            },
            '&.Mui-disabled': {
              backgroundColor: formColors.bgDisabled,
              cursor: 'not-allowed',
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderDefault,
            },
            '&.Mui-disabled .MuiOutlinedInput-input': {
              WebkitTextFillColor: formColors.textDisabled,
              color: formColors.textDisabled,
              cursor: 'not-allowed',
            },
            '&.Mui-readOnly, &:has(input[readonly], textarea[readonly])': {
              backgroundColor: formColors.bgReadOnly,
            },
            '&.Mui-readOnly:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline, &:has(input[readonly], textarea[readonly]):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
              borderColor: formColors.borderDefault,
              borderStyle: 'dashed',
            },
            '&.Mui-readOnly .MuiOutlinedInput-input, &:has(input[readonly], textarea[readonly]) .MuiOutlinedInput-input': {
              color: formColors.textReadOnly,
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
              color: formColors.borderFocus,
            },
            '&.Mui-error': {
              color: formColors.borderError,
            },
            '&.Mui-disabled': {
              color: formColors.textDisabled,
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
              color: formColors.borderError,
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
            color: formColors.adornment,
            '&.MuiInputAdornment-positionStart': {
              marginRight: FORM_TOKENS.adornmentGap,
            },
            '&.MuiInputAdornment-positionEnd': {
              marginLeft: 4,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            '&.MuiInputBase-inputSizeSmall': {
              paddingTop: `${FORM_TOKENS.paddingYSmall}px`,
              paddingBottom: `${FORM_TOKENS.paddingYSmall}px`,
              paddingRight: '32px',
            },
            '&.Mui-disabled': {
              WebkitTextFillColor: formColors.textDisabled,
              color: formColors.textDisabled,
              cursor: 'not-allowed',
            },
          },
          icon: {
            color: formColors.adornment,
            '&.Mui-disabled': {
              color: formColors.textDisabled,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: FORM_TOKENS.borderRadius,
            marginTop: 4,
            border: `1px solid ${formColors.borderDefault}`,
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.16)',
            backgroundImage: 'none',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: FORM_TOKENS.fontSizeInput,
            minHeight: 38,
            '&.Mui-selected': {
              backgroundColor: formColors.selectedItemBg,
              fontWeight: 600,
            },
            '&.Mui-selected:hover': {
              backgroundColor: formColors.selectedItemHoverBg,
            },
          },
        },
      },
    },
  });
};
