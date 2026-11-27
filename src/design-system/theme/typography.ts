import type { ThemeOptions } from '@mui/material/styles';

export const APP_TYPOGRAPHY: NonNullable<ThemeOptions['typography']> = {
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
};
