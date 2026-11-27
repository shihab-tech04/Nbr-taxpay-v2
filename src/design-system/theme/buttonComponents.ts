import type { Components, Theme } from '@mui/material/styles';
import { buildDisabledInteractionStyle, buildFocusVisibleStyle } from './interactionStates';
import type { ThemeColorTokens } from './palette';
import { BUTTON_TOKENS } from './spacingAndShape';

export function getButtonComponents(
  colors: ThemeColorTokens
): Pick<Components<Theme>, 'MuiButtonBase' | 'MuiButton' | 'MuiIconButton' | 'MuiCard'> {
  return {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          '&:focus-visible': buildFocusVisibleStyle(colors.focus.outline, 2),
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
          '&:active:not(:disabled):not([aria-disabled="true"])': {
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
          '&.Mui-disabled': buildDisabledInteractionStyle(0.62),
          '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            margin: 0,
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: colors.brand.main,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: colors.brand.dark,
            },
            '&.Mui-disabled': {
              backgroundColor: colors.surface.neutralHover,
              color: colors.text.disabled,
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: colors.border.neutral,
            color: colors.text.primary,
            '&:hover': {
              borderColor: colors.border.hover,
              backgroundColor: colors.brand.softBg,
            },
          },
          '&.MuiButton-containedError': {
            backgroundColor: colors.error.main,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: colors.error.hover,
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
          '&.Mui-disabled': buildDisabledInteractionStyle(0.48),
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
  };
}
