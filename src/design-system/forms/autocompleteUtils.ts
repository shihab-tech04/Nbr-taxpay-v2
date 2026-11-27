export interface AppAutocompleteOption {
  value: string;
  label: string;
  code?: string;
  group?: string;
  secondary?: string;
  disabled?: boolean;
}

export function matchAutocompleteOptions(
  options: readonly AppAutocompleteOption[],
  query: string
): AppAutocompleteOption[] {
  const term = query.trim().toLocaleLowerCase();
  return options.filter((option) => {
    if (option.value === '') return false;
    if (!term) return true;
    return [option.label, option.secondary, option.group, option.value, option.code].some((field) =>
      field?.toLocaleLowerCase().includes(term)
    );
  });
}

export function groupAutocompleteOptionsPreserveOrder(
  options: readonly AppAutocompleteOption[]
): AppAutocompleteOption[] {
  const hasGroups = options.some((option) => Boolean(option.group));
  if (!hasGroups) return [...options];

  const buckets = new Map<string, AppAutocompleteOption[]>();
  for (const option of options) {
    if (option.value === '') continue;
    const key = option.group ?? '';
    const existing = buckets.get(key);
    if (existing) existing.push(option);
    else buckets.set(key, [option]);
  }
  return Array.from(buckets.values()).flat();
}

export function findSelectedAutocompleteOption(
  options: readonly AppAutocompleteOption[],
  value: string | null | undefined
): AppAutocompleteOption | null {
  if (!value) return null;
  return options.find((option) => option.value === value && option.value !== '') ?? null;
}
