import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AppColumn, TableSortState, TablePaginationState } from './tableTypes';
import { sortTableData, paginateTableData } from './tableUtils';

export interface UseTableStateOptions<T> {
  initialSort?: TableSortState<string>;
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

  // Auto-reset page if current page is beyond data range
  useEffect(() => {
    if (data.length > 0 && pagination.page * pagination.rowsPerPage >= data.length) {
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, [data.length, pagination.page, pagination.rowsPerPage]);

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
    return sortTableData(data, sortState.columnKey, sortState.direction, columns);
  }, [data, sortState, columns]);

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
