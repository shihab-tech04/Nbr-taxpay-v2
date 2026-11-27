import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Search, X } from 'lucide-react';

export type AppSearchFieldProps = AppTextFieldProps & {
  onClear?: () => void;
};

export const AppSearchField: React.FC<AppSearchFieldProps> = (allProps) => {
  const { value, onClear, InputProps, ...props } = allProps as any;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <AppTextField
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search className="w-4 h-4 text-slate-400" />
          </InputAdornment>
        ),
        endAdornment: hasValue && onClear ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={onClear}
              edge="end"
              size="small"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </IconButton>
          </InputAdornment>
        ) : undefined,
        ...InputProps,
      }}
      {...props}
    />
  );
};
