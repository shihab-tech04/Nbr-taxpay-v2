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
  CircularProgress,
  Typography,
} from '@mui/material';
import { AppButton } from '../buttons';
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
  errorMessage = 'Failed to load records.',
  emptyMessage = 'No records found.',
  onRetry,
  retryLabel = 'Retry',
  className = '',
}: AppTableProps<T>) {
  const effectiveTotal = totalRows ?? data.length;

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
                    className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider py-3.5 px-4"
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
                <TableCell colSpan={columns.length} align="center" className="py-12">
                  <div className="flex items-center justify-center gap-1.5">
                    <CircularProgress size={20} className="text-teal-600" />
                    <Typography variant="body2" className="text-slate-500">Loading data...</Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" className="py-12">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Typography variant="body2" className="text-rose-600 font-medium">
                      {errorMessage}
                    </Typography>
                    {onRetry && (
                      <AppButton actionType="secondary" size="small" onClick={onRetry}>
                        {retryLabel}
                      </AppButton>
                    )}
                  </div>
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
                      <TableCell key={String(col.key)} align={align} className={`py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 ${col.className ?? ''}`}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!isLoading && !isError && data.length === 0 && emptyMessage && (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 italic">
            {emptyMessage}
          </div>
        )}
      </TableContainer>

      {pagination && !isLoading && !isError && (
        <TablePagination
          component="div"
          count={effectiveTotal}
          page={pagination.page}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs"
        />
      )}
    </Paper>
  );
}
