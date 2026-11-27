import type { TableSortDirection } from './tableTypes';

export function sortTableData<T>(
  data: readonly T[],
  sortKey: keyof T | string | null,
  direction: TableSortDirection
): T[] {
  if (!sortKey) return [...data];
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortKey as string];
    const bVal = (b as Record<string, unknown>)[sortKey as string];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    const cmp = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? cmp : -cmp;
  });
}

export function paginateTableData<T>(
  data: readonly T[],
  page: number,
  rowsPerPage: number
): T[] {
  const start = page * rowsPerPage;
  return data.slice(start, start + rowsPerPage);
}
