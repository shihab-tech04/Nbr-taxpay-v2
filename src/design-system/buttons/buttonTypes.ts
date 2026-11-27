import type React from 'react';
import type { ButtonProps } from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import type { PublicCapability } from '../../shared/previewPolicy';

export type ButtonActionType = 'primary' | 'secondary';
export type ButtonIntent = 'default' | 'confirm' | 'destructive';
export type ButtonPalette = 'brand' | 'home';
export type SecondarySurface = 'outlined' | 'soft' | 'ghost';
export type ButtonGeometry = 'standard' | 'hero' | 'compact' | 'pill';
export type IconButtonSurface = 'default' | 'tinted' | 'arrow' | 'submit' | 'clear';

export interface ResolvedButtonStyle {
  variant: NonNullable<ButtonProps['variant']>;
  color: NonNullable<ButtonProps['color']>;
  sx: SxProps<Theme>;
}

export type ButtonActionVariantProps =
  | {
      actionType?: 'primary';
      intent?: 'default' | 'confirm' | 'destructive';
      surface?: never;
    }
  | {
      actionType: 'secondary';
      intent?: 'default' | 'destructive';
      surface?: SecondarySurface;
    };

export interface SharedAppButtonProps {
  palette?: ButtonPalette;
  geometry?: ButtonGeometry;
  size?: ButtonProps['size'];
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  previewRestricted?: boolean;
  publicCapability?: PublicCapability;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

type ButtonNativeOmitted = 'color' | 'children' | 'className' | 'disabled' | 'sx' | 'onClick' | 'href';

export type AppButtonAsButtonProps = ButtonActionVariantProps &
  SharedAppButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonNativeOmitted> & {
    href?: never;
    to?: never;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

export type AppButtonAsAnchorProps = ButtonActionVariantProps &
  SharedAppButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, ButtonNativeOmitted | 'type'> & {
    href: string;
    to?: never;
    type?: never;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

export type AppButtonAsRouterLinkProps = ButtonActionVariantProps &
  SharedAppButtonProps &
  Omit<RouterLinkProps, ButtonNativeOmitted | 'to' | 'type'> & {
    to: RouterLinkProps['to'];
    href?: never;
    type?: never;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

export type AppButtonProps =
  | AppButtonAsButtonProps
  | AppButtonAsAnchorProps
  | AppButtonAsRouterLinkProps;

export interface AppButtonComponent {
  (props: AppButtonAsAnchorProps & { ref?: React.Ref<HTMLAnchorElement> }): React.ReactElement | null;
  (
    props: AppButtonAsRouterLinkProps & { ref?: React.Ref<HTMLAnchorElement> }
  ): React.ReactElement | null;
  (props: AppButtonAsButtonProps & { ref?: React.Ref<HTMLButtonElement> }): React.ReactElement | null;
}
