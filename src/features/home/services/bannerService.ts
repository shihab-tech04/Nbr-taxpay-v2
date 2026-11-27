import type { CSSProperties } from 'react';
import { readPublicBackendConfig, type PublicBackendConfig } from '../../../config/publicBackend';
import { SLIDER2_FALLBACK_THEMES, isValidHexColor } from '../model/home.colors';
import { LAST_VERIFIED_PUBLISHED } from '../model/home.manifest';
import { findCategoryFallbackImage } from '../model/home.slides';
import type { BannerPaymentService, BannerSlide } from '../model/home.types';
import { noteBrandingResponse } from './brandingCmsHealth';

export interface CmsBannerRow {
  id: string;
  service_code?: BannerPaymentService | null;
  heading_en: string;
  heading_bn: string;
  mobile_heading_en: string;
  mobile_heading_bn: string;
  description_en: string;
  description_bn: string;
  mobile_description_en: string;
  mobile_description_bn: string;
  action_en: string;
  action_bn: string;
  desktop_image_path?: string | null;
  mobile_image_path?: string | null;
  background_color?: string | null;
  heading_color?: string | null;
  body_color?: string | null;
  outline_color?: string | null;
  published?: boolean;
  sort_order?: number;
}

export interface BannerEnvConfig {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  supabaseAnonKey?: string;
  supabaseDisabled?: boolean;
  isDev?: boolean;
  baseUrl?: string;
}

const VALID_SERVICE_CODES = new Set<BannerPaymentService>([
  'TAX_WITH_RETURN',
  'ADVANCE_TAX',
  'SOURCE_TAX_DEPOSIT',
  'TRAVEL_TAX',
]);

function toPublicBackendConfig(config?: BannerEnvConfig): PublicBackendConfig {
  if (!config) return readPublicBackendConfig();
  return readPublicBackendConfig({
    VITE_SUPABASE_URL: config.supabaseUrl ?? '',
    VITE_SUPABASE_PUBLISHABLE_KEY: config.supabasePublishableKey ?? '',
    VITE_SUPABASE_ANON_KEY: config.supabaseAnonKey ?? '',
    VITE_SUPABASE_DISABLED: config.supabaseDisabled ? 'true' : 'false',
    BASE_URL: config.baseUrl ?? '/',
    DEV: config.isDev === true,
  });
}

export function readBannerEnv(): BannerEnvConfig {
  const cfg = readPublicBackendConfig();
  return {
    supabaseUrl: cfg.url || undefined,
    supabasePublishableKey: cfg.publishableKey || undefined,
    supabaseDisabled: cfg.disabled,
    isDev: cfg.isDev,
    baseUrl: cfg.baseUrl,
  };
}

export function isBannerCmsConfigured(config?: BannerEnvConfig): boolean {
  return toPublicBackendConfig(config).configured;
}

export function slider2ThemeStyle(slide?: BannerSlide): CSSProperties {
  const values = [
    slide?.backgroundColor,
    slide?.headingColor,
    slide?.bodyColor,
    slide?.outlineColor,
  ];
  const hasCompletePalette = values.every((v) => isValidHexColor(v));
  const [background, heading, body, outline] = hasCompletePalette
    ? (values as [string, string, string, string])
    : SLIDER2_FALLBACK_THEMES[slide?.serviceCode || 'intro'] || SLIDER2_FALLBACK_THEMES.intro;
  return {
    '--slider2-bg': background,
    '--slider2-heading': heading,
    '--slider2-body': body,
    '--slider2-outline': outline,
  } as CSSProperties;
}

export function publicBannerImage(
  path: string | null | undefined,
  fallback: string,
  config?: BannerEnvConfig
): string {
  const resolved = toPublicBackendConfig(config);
  if (!path || !resolved.url) return fallback;
  const snapshot = Object.values(LAST_VERIFIED_PUBLISHED).find((item) => item.path === path);
  const baseUrl = resolved.baseUrl || '/';
  if (snapshot) return `${baseUrl}branding/published/${snapshot.file}`;
  const cleanRoot = resolved.url.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanRoot}/storage/v1/object/public/taxpay-banners/${cleanPath}`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isOptionalNullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string';
}

export function parseCmsBannerRows(payload: unknown): CmsBannerRow[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid CMS banner response: expected an array of banner rows.');
  }

  return payload.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid CMS banner row at index ${idx}.`);
    }
    const row = item as Record<string, unknown>;
    const requiredTextKeys = [
      'id',
      'heading_en',
      'heading_bn',
      'mobile_heading_en',
      'mobile_heading_bn',
      'description_en',
      'description_bn',
      'mobile_description_en',
      'mobile_description_bn',
      'action_en',
      'action_bn',
    ] as const;

    for (const key of requiredTextKeys) {
      if (!isNonEmptyString(row[key])) {
        throw new Error(`Invalid CMS banner row at index ${idx}: missing string field "${key}".`);
      }
    }

    const rawService = row.service_code;
    if (
      rawService !== undefined &&
      rawService !== null &&
      (typeof rawService !== 'string' || !VALID_SERVICE_CODES.has(rawService as BannerPaymentService))
    ) {
      throw new Error(`Invalid CMS banner row at index ${idx}: unrecognized service_code.`);
    }

    const optionalNullableKeys = [
      'desktop_image_path',
      'mobile_image_path',
      'background_color',
      'heading_color',
      'body_color',
      'outline_color',
    ] as const;

    for (const key of optionalNullableKeys) {
      if (!isOptionalNullableString(row[key])) {
        throw new Error(`Invalid CMS banner row at index ${idx}: invalid field "${key}".`);
      }
    }

    return item as CmsBannerRow;
  });
}

export function mapCmsBannerRow(row: CmsBannerRow, config?: BannerEnvConfig): BannerSlide {
  const resolved = toPublicBackendConfig(config);
  const categoryImage = findCategoryFallbackImage(row.service_code, resolved.baseUrl);
  return {
    id: row.id,
    serviceCode: row.service_code || undefined,
    headingEn: row.heading_en,
    headingBn: row.heading_bn,
    mobileHeadingEn: row.mobile_heading_en,
    mobileHeadingBn: row.mobile_heading_bn,
    descriptionEn: row.description_en,
    descriptionBn: row.description_bn,
    mobileDescriptionEn: row.mobile_description_en,
    mobileDescriptionBn: row.mobile_description_bn,
    actionEn: row.action_en,
    actionBn: row.action_bn,
    image: publicBannerImage(row.desktop_image_path, categoryImage, config),
    mobileImage: row.mobile_image_path
      ? publicBannerImage(row.mobile_image_path, categoryImage, config)
      : undefined,
    backgroundColor: row.background_color,
    headingColor: row.heading_color,
    bodyColor: row.body_color,
    outlineColor: row.outline_color,
  };
}

export async function fetchPublishedBanners(options?: {
  config?: BannerEnvConfig;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
}): Promise<BannerSlide[]> {
  const resolved = toPublicBackendConfig(options?.config);
  if (!resolved.configured) {
    throw new Error('The public banner CMS is not configured.');
  }

  const fetcher = options?.fetcher ?? fetch;
  const root = resolved.url.replace(/\/+$/, '');
  const url = `${root}/rest/v1/taxpay_site_banners?select=*&published=eq.true&order=sort_order.asc`;

  const response = await fetcher(url, {
    method: 'GET',
    signal: options?.signal,
    headers: {
      apikey: resolved.publishableKey,
      Authorization: `Bearer ${resolved.publishableKey}`,
      Accept: 'application/json',
    },
  });

  noteBrandingResponse(response.status, !response.ok);

  if (!response.ok) {
    throw new Error(`Banner service returned HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rows = parseCmsBannerRows(payload);
  return rows.map((row) => mapCmsBannerRow(row, options?.config));
}
