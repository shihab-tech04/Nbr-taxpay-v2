export interface ThemeColorTokens {
  isLight: boolean;
  brand: {
    main: string;
    light: string;
    dark: string;
    hover: string;
    softBg: string;
    softHoverBg: string;
  };
  home: {
    primary: string;
    primaryHover: string;
    accentText: string;
    accentBorder: string;
    accentBgHover: string;
    softBg: string;
    softHoverBg: string;
    ghostText: string;
    ghostHoverText: string;
    ghostHoverBg: string;
    radioBorder: string;
    radioSelectedBorder: string;
    radioSelectedBg: string;
    radioHoverBorder: string;
  };
  confirm: {
    main: string;
    hover: string;
    text: string;
  };
  error: {
    main: string;
    hover: string;
    focusRing: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    readOnly: string;
  };
  surface: {
    background: string;
    paper: string;
    input: string;
    disabled: string;
    readOnly: string;
    neutral: string;
    neutralHover: string;
  };
  border: {
    default: string;
    hover: string;
    focus: string;
    neutral: string;
  };
  focus: {
    outline: string;
    ring: string;
    homeOutline: string;
  };
  adornment: string;
  selectedItemBg: string;
  selectedItemHoverBg: string;
  switchTrackOff: string;
  switchThumbDisabled: string;
  tin: {
    cellBg: string;
    cellBorder: string;
    cellFilledBorder: string;
    cellActiveBorder: string;
    cellActiveBg: string;
    cellActiveText: string;
    cellText: string;
    focusOutline: string;
    cardBorder: string;
    heading: string;
    label: string;
    divider: string;
    suggestionBorder: string;
    suggestionHoverBg: string;
  };
}

export function getThemeColors(mode: 'light' | 'dark'): ThemeColorTokens {
  const isLight = mode === 'light';
  return {
    isLight,
    brand: {
      main: '#0F766E',
      light: '#14B8A6',
      dark: '#115E59',
      hover: '#115E59',
      softBg: isLight ? 'rgba(15, 118, 110, 0.08)' : 'rgba(20, 184, 166, 0.14)',
      softHoverBg: isLight ? 'rgba(15, 118, 110, 0.14)' : 'rgba(20, 184, 166, 0.22)',
    },
    home: {
      primary: '#2F55A4',
      primaryHover: '#1F3C7A',
      accentText: '#1C3D70',
      accentBorder: '#CAD8EF',
      accentBgHover: '#F4F7FC',
      softBg: '#E6EDF8',
      softHoverBg: '#CAD8EF',
      ghostText: '#3E4B62',
      ghostHoverText: '#0F1D34',
      ghostHoverBg: '#F4F6FA',
      radioBorder: isLight ? '#DCE5F0' : '#334155',
      radioSelectedBorder: isLight ? '#2C5EAD' : '#60A5FA',
      radioSelectedBg: isLight ? '#EEF5FF' : 'rgba(44, 94, 173, 0.22)',
      radioHoverBorder: isLight ? '#8AABD9' : '#60A5FA',
    },
    confirm: {
      main: '#10B981',
      hover: '#059669',
      text: '#022C22',
    },
    error: {
      main: isLight ? '#E11D48' : '#FB7185',
      hover: isLight ? '#BE123C' : '#F43F5E',
      focusRing: isLight ? 'rgba(225, 29, 72, 0.14)' : 'rgba(251, 113, 133, 0.22)',
    },
    text: {
      primary: isLight ? '#0F172A' : '#F8FAFC',
      secondary: isLight ? '#475569' : '#94A3B8',
      disabled: isLight ? '#64748B' : '#94A3B8',
      readOnly: isLight ? '#334155' : '#CBD5E1',
    },
    surface: {
      background: isLight ? '#F8FAFC' : '#0F172A',
      paper: isLight ? '#FFFFFF' : '#1E293B',
      input: isLight ? '#FFFFFF' : '#0F172A',
      disabled: isLight ? '#F1F5F9' : 'rgba(15, 23, 42, 0.72)',
      readOnly: isLight ? '#F8FAFC' : 'rgba(30, 41, 59, 0.65)',
      neutral: isLight ? '#F1F5F9' : '#1E293B',
      neutralHover: isLight ? '#E2E8F0' : '#334155',
    },
    border: {
      default: isLight ? '#CBD5E1' : '#334155',
      hover: isLight ? '#0F766E' : '#2DD4BF',
      focus: isLight ? '#0F766E' : '#14B8A6',
      neutral: isLight ? '#CBD5E1' : '#334155',
    },
    focus: {
      outline: isLight ? '#0F766E' : '#2DD4BF',
      ring: isLight ? 'rgba(15, 118, 110, 0.14)' : 'rgba(20, 184, 166, 0.22)',
      homeOutline: '#2C5EAD',
    },
    adornment: isLight ? '#64748B' : '#94A3B8',
    selectedItemBg: isLight ? 'rgba(15, 118, 110, 0.1)' : 'rgba(20, 184, 166, 0.18)',
    selectedItemHoverBg: isLight ? 'rgba(15, 118, 110, 0.16)' : 'rgba(20, 184, 166, 0.26)',
    switchTrackOff: isLight ? '#94A3B8' : '#475569',
    switchThumbDisabled: isLight ? '#CBD5E1' : '#475569',
    tin: {
      cellBg: isLight ? '#FFFFFF' : '#0F172A',
      cellBorder: isLight ? '#D0D9E3' : '#334155',
      cellFilledBorder: isLight ? '#BFCBD8' : '#475569',
      cellActiveBorder: isLight ? '#2C5EAD' : '#60A5FA',
      cellActiveBg: isLight ? '#EAF2FF' : 'rgba(44, 94, 173, 0.25)',
      cellActiveText: isLight ? '#143C79' : '#DBEAFE',
      cellText: isLight ? '#17345A' : '#F8FAFC',
      focusOutline: isLight ? '#085587' : '#60A5FA',
      cardBorder: isLight ? '#DCE5F0' : '#334155',
      heading: isLight ? '#172B4D' : '#F1F5F9',
      label: isLight ? '#334B6C' : '#CBD5E1',
      divider: isLight ? '#ECF0F5' : '#334155',
      suggestionBorder: isLight ? '#C7D4E7' : '#334155',
      suggestionHoverBg: isLight ? '#EDF4FF' : 'rgba(44, 94, 173, 0.22)',
    },
  };
}
