import type { CSSProperties } from 'react';
import {
  FALLBACK_SLIDES,
  LAST_VERIFIED_PUBLISHED,
  SLIDER2_FALLBACK_THEMES,
  findCategoryFallbackImage,
  getBaseUrl,
} from '../model/home.tokens';
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
  supabaseAnonKey?: string;
  supabaseDisabled?: boolean;
  isDev?: boolean;
  baseUrl?: string;
}

export function readBannerEnv(): BannerEnvConfig {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, unknown>)
      : {};
  return {
    supabaseUrl: typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : undefined,
    supabaseAnonKey: typeof env.VITE_SUPABASE_ANON_KEY === 'string' ? env.VITE_SUPABASE_ANON_KEY.trim() : undefined,
    supabaseDisabled: env.VITE_SUPABASE_DISABLED === 'true',
    isDev: env.DEV === true,
    baseUrl: getBaseUrl(),
  };
}

export function isBannerCmsConfigured(config: BannerEnvConfig = readBannerEnv()): boolean {
  if (config.isDev && config.supabaseDisabled) return true;
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export function isValidHexColor(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function slider2ThemeStyle(slide?: BannerSlide): CSSProperties {
  const values = [slide?.backgroundColor, slide?.headingColor, slide?.bodyColor, slide?.outlineColor];
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
  config: BannerEnvConfig = readBannerEnv()
): string {
  if (!path || !config.supabaseUrl) return fallback;
  const snapshot = Object.values(LAST_VERIFIED_PUBLISHED).find((item) => item.path === path);
  const baseUrl = config.baseUrl || '/';
  if (snapshot) return `${baseUrl}branding/published/${snapshot.file}`;
  const cleanRoot = config.supabaseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanRoot}/storage/v1/object/public/taxpay-banners/${cleanPath}`;
}

export function mapCmsBannerRow(row: CmsBannerRow, config: BannerEnvConfig = readBannerEnv()): BannerSlide {
  const categoryImage = findCategoryFallbackImage(row.service_code, config.baseUrl);
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
}): Promise<BannerSlide[]> {
  const config = options?.config ?? readBannerEnv();
  if (config.isDev && config.supabaseDisabled) {
    return FALLBACK_SLIDES.map((s) => ({ ...s }));
  }
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error('The public banner service is unavailable.');
  }

  const fetcher = options?.fetcher ?? fetch;
  const root = config.supabaseUrl.replace(/\/+$/, '');
  const url = `${root}/rest/v1/taxpay_site_banners?select=*&published=eq.true&order=sort_order.asc`;

  const response = await fetcher(url, {
    method: 'GET',
    headers: {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${config.supabaseAnonKey}`,
      Accept: 'application/json',
    },
  });

  noteBrandingResponse(response.status, !response.ok);

  if (!response.ok) {
    throw new Error(`Banner service returned HTTP ${response.status}`);
  }

  const rows = (await response.json()) as CmsBannerRow[];
  return (rows || []).map((row) => mapCmsBannerRow(row, config));
}
