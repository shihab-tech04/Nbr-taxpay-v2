import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import { Eye, EyeOff } from 'lucide-react';
import { isFieldLockedByPreviewPolicy } from '../../shared/previewPolicy';
import { AppIconButton } from '../buttons';
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

  const isButtonDisabled = Boolean(
    disabled || readOnly || isFieldLockedByPreviewPolicy({ publicCapability: 'none' })
  );

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
          <AppIconButton
            aria-label={toggleLabel}
            aria-pressed={showPassword}
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            disabled={isButtonDisabled}
            edge="end"
            size="small"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </AppIconButton>
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
