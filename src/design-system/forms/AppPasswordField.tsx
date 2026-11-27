import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Eye, EyeOff } from 'lucide-react';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry } from './fieldUtils';

export type AppPasswordFieldProps = Omit<AppTextFieldProps, 'type'>;

export const AppPasswordField: React.FC<AppPasswordFieldProps> = ({
  disabled = false,
  readOnly = false,
  autoComplete = 'current-password',
  slotProps,
  ...props
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const isButtonDisabled = Boolean(disabled || readOnly || PUBLIC_PREVIEW);

  const handleClickShowPassword = () => {
    if (isButtonDisabled) return;
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const toggleLabel = showPassword
    ? t('hidePassword', { defaultValue: 'Hide password' })
    : t('showPassword', { defaultValue: 'Show password' });

  const mergedInputSlot = mergeSlotEntry(
    'input',
    {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            type="button"
            aria-label={toggleLabel}
            aria-pressed={showPassword}
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            disabled={isButtonDisabled}
            edge="end"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </IconButton>
        </InputAdornment>
      ),
    },
    slotProps?.input
  );

  return (
    <AppTextField
      type={showPassword && !isButtonDisabled ? 'text' : 'password'}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      slotProps={{
        ...slotProps,
        input: mergedInputSlot,
      }}
      {...props}
    />
  );
};
