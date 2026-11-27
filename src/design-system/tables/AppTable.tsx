import React from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import type { AppColumn, TablePaginationState, TableSortState } from './tableTypes';

interface AppTableProps<T> {
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
  className = '',
}: AppTableProps<T>) {
  const effectiveTotal = totalRows ?? data.length;
  const totalPages = pagination ? Math.max(1, Math.ceil(effectiveTotal / pagination.rowsPerPage)) : 1;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.map((col) => {
                const isSorted = sortState?.columnKey === col.key;
                const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className={`p-4 ${alignClass} ${col.className ?? ''}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(String(col.key))}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                        aria-sort={isSorted ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <span>{col.header}</span>
                        <span className="flex flex-col text-slate-400">
                          <ChevronUp size={12} className={isSorted && sortState.direction === 'asc' ? 'text-teal-600' : 'opacity-40'} />
                          <ChevronDown size={12} className={isSorted && sortState.direction === 'desc' ? 'text-teal-600' : '-mt-1 opacity-40'} />
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-teal-600" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-rose-600 font-medium">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={keyExtractor(row, idx)} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {columns.map((col) => {
                    const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                    return (
                      <td key={String(col.key)} className={`p-4 ${alignClass} ${col.className ?? ''}`}>
                        {col.cell ? col.cell(row, idx) : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && !isError && effectiveTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pagination.rowsPerPage}
              onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              aria-label="Rows per page"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              Showing {Math.min(effectiveTotal, pagination.page * pagination.rowsPerPage + 1)}–
              {Math.min(effectiveTotal, (pagination.page + 1) * pagination.rowsPerPage)} of {effectiveTotal}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 0}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= totalPages - 1}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
