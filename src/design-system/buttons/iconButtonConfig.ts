import type { SxProps, Theme } from '@mui/material/styles';
import { getThemeColors } from '../theme';
import type { ButtonPalette, IconButtonSurface } from './buttonTypes';

export function resolveIconButtonStyle(options: {
  intent: 'default' | 'destructive';
  palette: ButtonPalette;
  surface: IconButtonSurface;
}): SxProps<Theme> {
  const { intent, palette, surface } = options;
  return (theme) => {
    const colors = getThemeColors(theme.palette.mode);
    if (intent === 'destructive') {
      return {
        color: colors.error.main,
        '&:hover': { bgcolor: colors.error.focusRing },
      };
    }
    switch (surface) {
      case 'arrow':
        return {
          width: 36,
          height: 36,
          borderRadius: '999px',
          color: '#141B2D',
          bgcolor: 'transparent',
          '&:hover': { bgcolor: '#F3F4F8' },
        };
      case 'submit':
        return {
          width: 40,
          height: 40,
          borderRadius: '12px',
          bgcolor: colors.home.softBg,
          color: colors.home.accentText,
          border: `1px solid ${colors.home.accentBorder}`,
          '&:hover': { bgcolor: colors.home.softHoverBg },
          '&.Mui-disabled': {
            bgcolor: colors.home.softBg,
            color: colors.home.accentText,
            opacity: 0.8,
          },
        };
      case 'clear':
        return {
          width: 28,
          height: 28,
          borderRadius: '999px',
          color: '#5F6880',
          '&:hover': {
            bgcolor: 'rgba(231, 233, 239, 0.6)',
            color: '#141B2D',
          },
        };
      case 'tinted':
        return {
          color: palette === 'home' ? colors.home.primary : colors.brand.main,
          '&:hover': {
            bgcolor: palette === 'home' ? colors.home.softBg : colors.brand.softBg,
          },
        };
      case 'default':
      default:
        return { color: colors.text.secondary };
    }
  };
}
