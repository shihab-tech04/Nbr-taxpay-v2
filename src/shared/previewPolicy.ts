import { PUBLIC_PREVIEW } from './previewMode';

export type PublicCapability =
  | 'none'
  | 'public_help_question'
  | 'experimental_record_search';

export type RestrictedOperation =
  | 'sign_in'
  | 'payment_submit'
  | 'beneficiary_write'
  | 'draft_write'
  | 'correction_write'
  | 'support_ticket_write';

const ALLOWED_PREVIEW_CAPABILITIES: ReadonlySet<PublicCapability> = new Set([
  'public_help_question',
  'experimental_record_search',
]);

export function isPublicCapabilityAllowed(
  capability: PublicCapability = 'none',
  isPreview = PUBLIC_PREVIEW
): boolean {
  if (!isPreview) return true;
  return ALLOWED_PREVIEW_CAPABILITIES.has(capability);
}

export function isFieldLockedByPreviewPolicy(
  options: {
    publicCapability?: PublicCapability;
    previewRestricted?: boolean;
  } = {},
  isPreview = PUBLIC_PREVIEW
): boolean {
  if (!isPreview) return false;
  if (options.previewRestricted) return true;
  return !isPublicCapabilityAllowed(options.publicCapability ?? 'none', isPreview);
}

export function isActionBlockedByPreviewPolicy(
  options: {
    previewRestricted?: boolean;
    publicCapability?: PublicCapability;
  } = {},
  isPreview = PUBLIC_PREVIEW
): boolean {
  if (!isPreview) return false;
  if (options.previewRestricted) return true;
  if (options.publicCapability !== undefined) {
    return !isPublicCapabilityAllowed(options.publicCapability, isPreview);
  }
  return false;
}

export function isRestrictedOperationAllowed(
  _operation: RestrictedOperation,
  isPreview = PUBLIC_PREVIEW
): boolean {
  return !isPreview;
}
