export type TableSortDirection = 'asc' | 'desc';

export interface TableSortState<T = string> {
  columnKey: T;
  direction: TableSortDirection;
}

export interface TablePaginationState {
  page: number;
  rowsPerPage: number;
}

export interface AppColumn<T, K extends keyof T | string = string> {
  key: K;
  header: string | React.ReactNode;
  accessor?: (row: T) => unknown;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
