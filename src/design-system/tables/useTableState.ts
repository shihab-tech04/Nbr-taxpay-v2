import { useState, useMemo, useCallback } from 'react';
import type { TableSortState, TablePaginationState } from './tableTypes';
import { sortTableData, paginateTableData } from './tableUtils';

export interface UseTableStateOptions {
  initialSort?: TableSortState<string>;
  initialRowsPerPage?: number;
}

export function useTableState<T>(
  data: readonly T[],
  options?: UseTableStateOptions
) {
  const [sortState, setSortState] = useState<TableSortState<string> | null>(
    options?.initialSort ?? null
  );
  const [pagination, setPagination] = useState<TablePaginationState>({
    page: 0,
    rowsPerPage: options?.initialRowsPerPage ?? 10,
  });

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
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setPagination({ page: 0, rowsPerPage: newRowsPerPage });
  }, []);

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const sortedData = useMemo(() => {
    if (!sortState) return [...data];
    return sortTableData(data, sortState.columnKey, sortState.direction);
  }, [data, sortState]);

  const pagedData = useMemo(() => {
    return paginateTableData(sortedData, pagination.page, pagination.rowsPerPage);
  }, [sortedData, pagination.page, pagination.rowsPerPage]);

  return {
    sortState,
    setSortState,
    handleSort,
    pagination,
    setPagination,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,
    sortedData,
    pagedData,
    totalRows: data.length,
  };
}
