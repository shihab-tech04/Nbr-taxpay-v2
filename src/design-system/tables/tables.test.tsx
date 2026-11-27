import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppTable } from './AppTable';
import { sortTableData, paginateTableData } from './tableUtils';
import type { AppColumn } from './tableTypes';

interface TestRow {
  id: string;
  name: string;
  amount: number;
}

const testData: TestRow[] = [
  { id: '1', name: 'Zebra', amount: 500 },
  { id: '2', name: 'Apple', amount: 100 },
  { id: '3', name: 'Mango', amount: 300 },
];

const columns: AppColumn<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, align: 'right' },
];

test('table utilities sort and paginate deterministically', () => {
  const sortedAsc = sortTableData(testData, 'name', 'asc');
  assert.equal(sortedAsc[0].name, 'Apple');
  assert.equal(sortedAsc[2].name, 'Zebra');

  const sortedDesc = sortTableData(testData, 'amount', 'desc');
  assert.equal(sortedDesc[0].amount, 500);
  assert.equal(sortedDesc[2].amount, 100);

  const paginated = paginateTableData(sortedAsc, 0, 2);
  assert.equal(paginated.length, 2);
  assert.equal(paginated[0].name, 'Apple');
  assert.equal(paginated[1].name, 'Mango');
});

test('AppTable renders loading, error, empty, and data states correctly', () => {
  const loadingHtml = renderToStaticMarkup(
    <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} isLoading />
  );
  assert.match(loadingHtml, /Loading data.../);

  const errorHtml = renderToStaticMarkup(
    <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} isError errorMessage="Custom Error" />
  );
  assert.match(errorHtml, /Custom Error/);

  const emptyHtml = renderToStaticMarkup(
    <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} emptyMessage="No rows found" />
  );
  assert.match(emptyHtml, /No rows found/);

  const dataHtml = renderToStaticMarkup(
    <AppTable
      columns={columns}
      data={testData}
      keyExtractor={(r) => r.id}
      sortState={{ columnKey: 'name', direction: 'asc' }}
      pagination={{ page: 0, rowsPerPage: 2 }}
      totalRows={3}
    />
  );
  assert.match(dataHtml, /Apple/);
  assert.match(dataHtml, /Zebra/);
  assert.match(dataHtml, /of 3/);
});
