import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AppColumn, TableSortState, TablePaginationState } from './tableTypes';
import { sortTableData, paginateTableData, resolveValidPage } from './tableUtils';

export interface UseTableStateOptions<T> {
  initialSort?: TableSortState<string> | null;
  initialRowsPerPage?: number;
  columns?: readonly AppColumn<T>[];
}

export function useTableState<T>(
  data: readonly T[],
  options?: UseTableStateOptions<T>
) {
  const [sortState, setSortState] = useState<TableSortState<string> | null>(
    options?.initialSort ?? null
  );
  const [pagination, setPagination] = useState<TablePaginationState>({
    page: 0,
    rowsPerPage: options?.initialRowsPerPage ?? 10,
  });

  const columns = options?.columns;
  const effectivePage = resolveValidPage(data.length, pagination.page, pagination.rowsPerPage);

  // Sync state when filtered data shrinks, becomes empty, or leaves page out of bounds
  useEffect(() => {
    if (pagination.page !== effectivePage) {
      setPagination((prev) => ({ ...prev, page: effectivePage }));
    }
  }, [effectivePage, pagination.page]);

  const handleSort = useCallback((columnKey: string) => {
    setSortState((prev) => {
      if (prev?.columnKey === columnKey) {
        return {
          columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { columnKey, direction: 'asc' };
    });
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: resolveValidPage(data.length, newPage, prev.rowsPerPage),
    }));
  }, [data.length]);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setPagination({ page: 0, rowsPerPage: newRowsPerPage });
  }, []);

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const sortedData = useMemo(() => {
    if (!sortState) return [...data];
    return sortTableData(data, sortState.columnKey, sortState.direction, columns);
  }, [data, sortState, columns]);

  const normalizedPagination = useMemo<TablePaginationState>(
    () => ({ page: effectivePage, rowsPerPage: pagination.rowsPerPage }),
    [effectivePage, pagination.rowsPerPage]
  );

  const pagedData = useMemo(() => {
    return paginateTableData(sortedData, effectivePage, pagination.rowsPerPage);
  }, [sortedData, effectivePage, pagination.rowsPerPage]);

  return {
    sortState,
    setSortState,
    handleSort,
    pagination: normalizedPagination,
    setPagination,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,
    sortedData,
    pagedData,
    totalRows: data.length,
  };
}
