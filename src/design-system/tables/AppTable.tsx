import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AppSkeleton, AppStateView } from '../feedback';
import type { AppColumn, TablePaginationState, TableSortState } from './tableTypes';

export interface AppTableProps<T> {
  columns: readonly AppColumn<T>[];
  data: readonly T[];
  keyExtractor: (row: T, index: number) => string;
  sortState?: TableSortState<string> | null;
  onSort?: (columnKey: string) => void;
  pagination?: TablePaginationState;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  totalRows?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function AppTable<T>({
  columns,
  data,
  keyExtractor,
  sortState,
  onSort,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  totalRows,
  isLoading = false,
  isError = false,
  errorMessage,
  emptyMessage,
  onRetry,
  retryLabel,
  className = '',
}: AppTableProps<T>) {
  const { i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const resolvedEmpty =
    emptyMessage ?? (isBn ? 'কোনো তথ্য পাওয়া যায়নি।' : 'No records found.');
  const resolvedError =
    errorMessage ?? (isBn ? 'তথ্য লোড করতে ব্যর্থ হয়েছে।' : 'Failed to load records.');
  const resolvedRetry =
    retryLabel ?? (isBn ? 'আবার চেষ্টা করুন' : 'Retry');

  const effectiveTotal = totalRows ?? data.length;
  const safePage = pagination
    ? effectiveTotal > 0 && pagination.page * pagination.rowsPerPage >= effectiveTotal
      ? Math.max(0, Math.ceil(effectiveTotal / pagination.rowsPerPage) - 1)
      : pagination.page
    : 0;

  return (
    <Paper
      elevation={0}
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 ${className}`}
    >
      <TableContainer className="overflow-x-auto">
        <Table size="small" aria-label="data table">
          <TableHead className="bg-slate-50 dark:bg-slate-800">
            <TableRow>
              {columns.map((col) => {
                const isSorted = sortState?.columnKey === col.key;
                const align = col.align ?? 'left';
                return (
                  <TableCell
                    key={String(col.key)}
                    align={align}
                    className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider py-3.5 px-4 whitespace-nowrap"
                  >
                    {col.sortable && onSort ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? sortState.direction : 'asc'}
                        onClick={() => onSort(String(col.key))}
                      >
                        {col.header}
                      </TableSortLabel>
                    ) : (
                      col.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4">
                  <span className="sr-only">
                    {isBn ? 'তথ্য লোড হচ্ছে...' : 'Loading data...'}
                  </span>
                  <AppSkeleton variant="table-row" count={3} />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4">
                  <AppStateView
                    variant="error"
                    title={resolvedError}
                    onRetry={onRetry}
                    retryLabel={resolvedRetry}
                    className="my-2"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={keyExtractor(row, idx)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => {
                    const align = col.align ?? 'left';
                    const cellContent = col.cell
                      ? col.cell(row, idx)
                      : col.accessor
                      ? String(col.accessor(row) ?? '')
                      : String((row as Record<string, unknown>)[col.key as string] ?? '');
                    return (
                      <TableCell
                        key={String(col.key)}
                        align={align}
                        className={`py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 ${col.className ?? ''}`}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!isLoading && !isError && data.length === 0 && resolvedEmpty && (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 italic">
            {resolvedEmpty}
          </div>
        )}
      </TableContainer>

      {pagination && !isLoading && !isError && (
        <TablePagination
          component="div"
          count={effectiveTotal}
          page={safePage}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={isBn ? 'প্রতি পৃষ্ঠায় সারি:' : 'Rows per page:'}
          labelDisplayedRows={({ from, to, count }) =>
            isBn
              ? `${from}–${to} / মোট ${count !== -1 ? count : 'অধিক'}`
              : `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
          className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs"
        />
      )}
    </Paper>
  );
}
