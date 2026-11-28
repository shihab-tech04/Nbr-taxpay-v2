import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AppTable } from './AppTable';
import { sortTableData, paginateTableData, resolveValidPage } from './tableUtils';
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

test('table utilities sort and paginate deterministically and reset invalid/empty pages', () => {
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

  // Empty data and out-of-bounds pages always reset cleanly to 0
  assert.equal(resolveValidPage(0, 2, 10), 0);
  assert.equal(resolveValidPage(3, 2, 5), 0);
  assert.equal(resolveValidPage(25, 2, 10), 2);
  assert.equal(resolveValidPage(25, -1, 10), 0);
  assert.deepEqual(paginateTableData([], 2, 10), []);
});

test('table utilities sort with custom accessors, numeric formatting, and dates', () => {
  interface ExtendedRow {
    id: string;
    date: string;
    formattedAmount: string;
    details: { code: string };
  }

  const complexData: ExtendedRow[] = [
    { id: '1', date: '2026-04-10', formattedAmount: '৳ 25,000', details: { code: 'C' } },
    { id: '2', date: '2025-01-15', formattedAmount: '৳ 100,000', details: { code: 'A' } },
    { id: '3', date: '2026-03-01', formattedAmount: '৳ 5,000', details: { code: 'B' } },
  ];

  const cols: AppColumn<ExtendedRow>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'formattedAmount', header: 'Amount', sortable: true },
    { key: 'code', header: 'Code', sortable: true, accessor: (r) => r.details.code },
  ];

  const byDate = sortTableData(complexData, 'date', 'asc', cols);
  assert.equal(byDate[0].id, '2');
  assert.equal(byDate[2].id, '1');

  const byAmount = sortTableData(complexData, 'formattedAmount', 'desc', cols);
  assert.equal(byAmount[0].formattedAmount, '৳ 100,000');
  assert.equal(byAmount[2].formattedAmount, '৳ 5,000');

  const byAccessor = sortTableData(complexData, 'code', 'asc', cols);
  assert.equal(byAccessor[0].details.code, 'A');
  assert.equal(byAccessor[2].details.code, 'C');
});

test('AppTable renders loading, error, empty, EN and BN pagination states correctly', async () => {
  await i18n.changeLanguage('en');
  const loadingHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} isLoading />
    </I18nextProvider>
  );
  assert.match(loadingHtml, /Loading data.../);

  const errorHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} isError errorMessage="Custom Error" />
    </I18nextProvider>
  );
  assert.match(errorHtml, /Custom Error/);

  const emptyHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppTable columns={columns} data={[]} keyExtractor={(r) => r.id} emptyMessage="No rows found" />
    </I18nextProvider>
  );
  assert.match(emptyHtml, /No rows found/);

  const dataHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppTable
        columns={columns}
        data={testData}
        keyExtractor={(r) => r.id}
        sortState={{ columnKey: 'name', direction: 'asc' }}
        pagination={{ page: 0, rowsPerPage: 2 }}
        totalRows={3}
      />
    </I18nextProvider>
  );
  assert.match(dataHtml, /Apple/);
  assert.match(dataHtml, /Zebra/);
  assert.match(dataHtml, /of 3/);

  await i18n.changeLanguage('bn');
  const bnHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppTable
        columns={columns}
        data={testData}
        keyExtractor={(r) => r.id}
        pagination={{ page: 0, rowsPerPage: 2 }}
        totalRows={3}
      />
    </I18nextProvider>
  );
  assert.match(bnHtml, /প্রতি পৃষ্ঠায় সারি:/);
  assert.match(bnHtml, /মোট 3/);
  await i18n.changeLanguage('en');
});
