import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { bnBD, enUS } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/bn-bd';
import 'dayjs/locale/en';

export interface AppDateLocalizationProviderProps {
  children: React.ReactNode;
}

export const AppDateLocalizationProvider: React.FC<AppDateLocalizationProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language.toLowerCase().startsWith('bn');
  const localeText = (isBengali ? bnBD : enUS).components.MuiLocalizationProvider.defaultProps
    .localeText;

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={isBengali ? 'bn-bd' : 'en'}
      localeText={localeText}
    >
      {children}
    </LocalizationProvider>
  );
};
