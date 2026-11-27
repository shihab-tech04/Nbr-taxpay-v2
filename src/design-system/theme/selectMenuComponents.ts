import type { Components, Theme } from '@mui/material/styles';
import type { ThemeColorTokens } from './palette';
import { FORM_TOKENS } from './spacingAndShape';

export function getSelectMenuComponents(
  colors: ThemeColorTokens
): Pick<Components<Theme>, 'MuiSelect' | 'MuiMenu' | 'MuiMenuItem'> {
  return {
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
            WebkitTextFillColor: colors.text.disabled,
            color: colors.text.disabled,
            cursor: 'not-allowed',
          },
        },
        icon: {
          color: colors.adornment,
          '&.Mui-disabled': {
            color: colors.text.disabled,
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: FORM_TOKENS.borderRadius,
          marginTop: 4,
          border: `1px solid ${colors.border.default}`,
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
            backgroundColor: colors.selectedItemBg,
            fontWeight: 600,
          },
          '&.Mui-selected:hover': {
            backgroundColor: colors.selectedItemHoverBg,
          },
        },
      },
    },
  };
}
