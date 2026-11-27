import type { CSSProperties } from 'react';
import { readPublicBackendConfig, type PublicBackendConfig } from '../../../config/publicBackend';
import { SLIDER2_FALLBACK_THEMES, isValidHexColor } from '../model/home.colors';
import { LAST_VERIFIED_PUBLISHED } from '../model/home.manifest';
import { findCategoryFallbackImage } from '../model/home.slides';
import type { BannerSlide } from '../model/home.types';
import { parseCmsBannerRows, type CmsBannerRow } from './bannerValidation';
import { noteBrandingResponse } from './brandingCmsHealth';

export type { CmsBannerRow };
export { parseCmsBannerRows };

export interface BannerEnvConfig {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  supabaseAnonKey?: string;
  supabaseDisabled?: boolean;
  isDev?: boolean;
  baseUrl?: string;
}

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
