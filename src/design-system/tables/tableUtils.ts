import type { AppColumn, TableSortDirection } from './tableTypes';

function extractSortValue<T>(
  item: T,
  sortKey: string,
  columns?: readonly AppColumn<T>[]
): unknown {
  if (columns) {
    const col = columns.find((c) => String(c.key) === sortKey);
    if (col?.accessor) {
      return col.accessor(item);
    }
  }
  return (item as Record<string, unknown>)[sortKey];
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === undefined || a === null) return 1;
  if (b === undefined || b === null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    const aNum = Number(a.replace(/[^0-9.-]+/g, ''));
    const bNum = Number(b.replace(/[^0-9.-]+/g, ''));
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && /^\s*[৳$]?\s*[\d,]+(\.\d+)?\s*$/.test(a)) {
      return aNum - bNum;
    }

    const aTime = Date.parse(a);
    const bTime = Date.parse(b);
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && /^\d{4}-\d{2}-\d{2}/.test(a)) {
      return aTime - bTime;
    }

    return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
  }

  return String(a).localeCompare(String(b));
}

export function sortTableData<T>(
  data: readonly T[],
  sortKey: keyof T | string | null,
  direction: TableSortDirection,
  columns?: readonly AppColumn<T>[]
): T[] {
  if (!sortKey) return [...data];
  const keyStr = String(sortKey);
  return [...data].sort((a, b) => {
    const aVal = extractSortValue(a, keyStr, columns);
    const bVal = extractSortValue(b, keyStr, columns);
    const diff = compareValues(aVal, bVal);
    return direction === 'asc' ? diff : -diff;
  });
}

export function paginateTableData<T>(
  data: readonly T[],
  page: number,
  rowsPerPage: number
): T[] {
  const start = Math.max(0, page) * Math.max(1, rowsPerPage);
  return data.slice(start, start + rowsPerPage);
}

