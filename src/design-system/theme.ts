import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#0F766E', // Emerald / Teal
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
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0F172A',
        paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
        secondary: mode === 'light' ? '#475569' : '#94A3B8',
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
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px 0 rgb(0 0_0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            backgroundImage: 'none',
          },
        },
      },
    },
  });
