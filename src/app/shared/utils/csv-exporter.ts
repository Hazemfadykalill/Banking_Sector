import { Transaction } from '../../core/models';

export interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number | null | undefined;
}

/**
 * Escapes a single CSV cell value according to RFC 4180 rules.
 */
export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const str = String(value);
  // If the value contains quotes, commas, or newlines, wrap in quotes and double internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Serializes an array of objects into an RFC 4180 compliant CSV string.
 */
export function generateCsv<T>(data: T[], columns: CsvColumn<T>[]): string {
  const headerRow = columns.map(col => escapeCsvCell(col.header)).join(',');
  const dataRows = data.map(item =>
    columns.map(col => escapeCsvCell(col.accessor(item))).join(',')
  );

  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Formats transaction records into standard banking CSV output.
 */
export function formatTransactionCsv(transactions: Transaction[]): string {
  const columns: CsvColumn<Transaction>[] = [
    { header: 'Transaction ID', accessor: t => t.id },
    { header: 'Date', accessor: t => t.date },
    { header: 'Merchant / Description', accessor: t => t.merchant },
    { header: 'Type', accessor: t => t.type },
    { header: 'Amount ($)', accessor: t => t.amount.toFixed(2) },
    { header: 'Category', accessor: t => t.category },
    { header: 'Balance After ($)', accessor: t => t.balanceAfter.toFixed(2) },
    { header: 'Notes', accessor: t => t.description || '' }
  ];

  return generateCsv(transactions, columns);
}

/**
 * Triggers a browser download of a CSV file and cleans up Blob URL resources.
 */
export function downloadCsvFile(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
