import type { BannerPaymentService } from '../model/home.types';

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

const VALID_SERVICE_CODES = new Set<BannerPaymentService>([
  'TAX_WITH_RETURN',
  'ADVANCE_TAX',
  'SOURCE_TAX_DEPOSIT',
  'TRAVEL_TAX',
]);

const REQUIRED_TEXT_KEYS = [
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

const OPTIONAL_NULLABLE_KEYS = [
  'desktop_image_path',
  'mobile_image_path',
  'background_color',
  'heading_color',
  'body_color',
  'outline_color',
] as const;

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

    for (const key of REQUIRED_TEXT_KEYS) {
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

    for (const key of OPTIONAL_NULLABLE_KEYS) {
      if (!isOptionalNullableString(row[key])) {
        throw new Error(`Invalid CMS banner row at index ${idx}: invalid field "${key}".`);
      }
    }

    return item as CmsBannerRow;
  });
}
