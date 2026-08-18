import { escapeCsvCell, generateCsv, formatTransactionCsv } from './csv-exporter';
import { Transaction } from '../../core/models';

describe('CSV Exporter Utility', () => {
  it('should escape CSV cell values with quotes if they contain commas or quotes', () => {
    expect(escapeCsvCell('Simple Text')).toBe('Simple Text');
    expect(escapeCsvCell('Hello, World')).toBe('"Hello, World"');
    expect(escapeCsvCell('Say "Hello"')).toBe('"Say ""Hello"""');
  });

  it('should prefix formula injection trigger characters with a single quote', () => {
    expect(escapeCsvCell('=1+2')).toBe("'=1+2");
    expect(escapeCsvCell('+123')).toBe("'+123");
    expect(escapeCsvCell('-456')).toBe("'-456");
    expect(escapeCsvCell('@SUM(A1:A10)')).toBe("'@SUM(A1:A10)");
    expect(escapeCsvCell('\tTabStart')).toBe("'\tTabStart");
    expect(escapeCsvCell('\rCRStart')).toBe('"\'\rCRStart"');
  });

  it('should format transaction data into valid CSV lines', () => {
    const mockTxs: Transaction[] = [
      {
        id: 'tx-1',
        accountId: 'acc-1',
        type: 'Debit',
        amount: 150.75,
        date: '2026-02-15T10:00:00Z',
        merchant: 'Whole Foods, Market',
        category: 'Groceries',
        balanceAfter: 849.25,
        description: 'Weekly "special" groceries'
      }
    ];

    const csv = formatTransactionCsv(mockTxs);
    const lines = csv.split('\r\n');

    expect(lines[0]).toContain('Transaction ID,Date,Merchant / Description,Type,Amount ($),Category,Balance After ($),Notes');
    expect(lines[1]).toContain('tx-1,2026-02-15T10:00:00Z,"Whole Foods, Market",Debit,150.75,Groceries,849.25,"Weekly ""special"" groceries"');
  });
});
