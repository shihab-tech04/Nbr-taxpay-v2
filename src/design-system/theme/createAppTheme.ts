import { createTheme } from '@mui/material/styles';
import { getAutocompleteComponents } from './autocompleteComponents';
import { getButtonComponents } from './buttonComponents';
import { getFormComponents } from './formComponents';
import { getThemeColors } from './palette';
import { getSelectionComponents } from './selectionComponents';
import { getSelectMenuComponents } from './selectMenuComponents';
import { FORM_TOKENS } from './spacingAndShape';
import { APP_TYPOGRAPHY } from './typography';

export const getTheme = (mode: 'light' | 'dark') => {
  const colors = getThemeColors(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.brand.main,
        light: colors.brand.light,
        dark: colors.brand.dark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0D9488',
        light: '#2DD4BF',
        dark: colors.brand.main,
        contrastText: '#ffffff',
      },
      error: {
        main: colors.error.main,
      },
      background: {
        default: colors.surface.background,
        paper: colors.surface.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },
    typography: APP_TYPOGRAPHY,
    shape: {
      borderRadius: FORM_TOKENS.borderRadius,
    },
    components: {
      ...getButtonComponents(colors),
      ...getFormComponents(colors),
      ...getSelectMenuComponents(colors),
      ...getAutocompleteComponents(colors),
      ...getSelectionComponents(colors),
    },
  });
};
