import { escapeCsvCell, generateCsv, formatTransactionCsv, downloadCsvFile } from './csv-exporter';
import { Transaction } from '../../core/models';

describe('CSV Exporter Utility', () => {
  // -------------------------------------------------------------------------
  // escapeCsvCell
  // -------------------------------------------------------------------------
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
    expect(escapeCsvCell('\rCRStart')).toBe("\"'\rCRStart\"");
  });

  it('should return empty quotes for null input', () => {
    expect(escapeCsvCell(null)).toBe('""');
  });

  it('should return empty quotes for undefined input', () => {
    expect(escapeCsvCell(undefined)).toBe('""');
  });

  it('should convert a number to its string representation without quoting', () => {
    expect(escapeCsvCell(42)).toBe('42');
    expect(escapeCsvCell(3.14)).toBe('3.14');
  });

  // -------------------------------------------------------------------------
  // generateCsv
  // -------------------------------------------------------------------------
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

  it('should produce only a header row for an empty transaction array', () => {
    const csv = formatTransactionCsv([]);
    const lines = csv.split('\r\n');
    // Only the header line — no data rows
    expect(lines.length).toBe(1);
    expect(lines[0]).toContain('Transaction ID');
  });

  it('should produce correct CSV for multiple transactions', () => {
    const txs: Transaction[] = [
      { id: 'tx-a', accountId: 'a1', type: 'Credit', amount: 500, date: '2026-01-10', merchant: 'Salary', category: 'Income', balanceAfter: 1500 },
      { id: 'tx-b', accountId: 'a1', type: 'Debit', amount: 100, date: '2026-01-11', merchant: 'Store', category: 'Groceries', balanceAfter: 1400 }
    ];
    const csv = formatTransactionCsv(txs);
    const lines = csv.split('\r\n');
    expect(lines.length).toBe(3); // header + 2 data rows
    expect(lines[1]).toContain('tx-a');
    expect(lines[2]).toContain('tx-b');
  });

  it('generateCsv should handle custom column definitions', () => {
    const data = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
    const columns = [
      { header: 'Full Name', accessor: (d: any) => d.name },
      { header: 'Age', accessor: (d: any) => d.age }
    ];
    const csv = generateCsv(data, columns);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('Full Name,Age');
    expect(lines[1]).toBe('Alice,30');
    expect(lines[2]).toBe('Bob,25');
  });

  // -------------------------------------------------------------------------
  // downloadCsvFile — DOM mock test
  // -------------------------------------------------------------------------
  describe('downloadCsvFile', () => {
    let mockAnchor: HTMLAnchorElement;
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let removeChildSpy: jasmine.Spy;
    let createObjectUrlSpy: jasmine.Spy;
    let revokeObjectUrlSpy: jasmine.Spy;
    let clickSpy: jasmine.Spy;

    beforeEach(() => {
      // Create a real anchor-like stub
      mockAnchor = document.createElement('a');
      clickSpy = spyOn(mockAnchor, 'click');

      // Spy on document.createElement and return our stub only for 'a'
      createElementSpy = spyOn(document, 'createElement').and.callFake((tagName: string) => {
        if (tagName === 'a') return mockAnchor;
        return document.createElement(tagName);
      });

      appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
      removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

      // Stub URL APIs
      createObjectUrlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
      revokeObjectUrlSpy = spyOn(URL, 'revokeObjectURL');
    });

    it('should create a Blob with the CSV content and correct MIME type', () => {
      const csvContent = 'ID,Name\r\ntx-1,Alice';
      downloadCsvFile(csvContent, 'test.csv');

      expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
      const blob: Blob = createObjectUrlSpy.calls.first().args[0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });

    it('should set href and download attribute on the anchor element', () => {
      downloadCsvFile('ID,Name\r\n1,Alice', 'export.csv');

      expect(mockAnchor.getAttribute('href')).toBe('blob:mock-url');
      expect(mockAnchor.getAttribute('download')).toBe('export.csv');
    });

    it('should append the anchor to body, click it, then remove it', () => {
      downloadCsvFile('col1,col2\r\nval1,val2', 'output.csv');

      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
    });

    it('should revoke the object URL after the click to free memory', () => {
      downloadCsvFile('data', 'file.csv');

      expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should use the provided filename as the download attribute', () => {
      downloadCsvFile('content', 'transactions_2026-08-20.csv');

      expect(mockAnchor.getAttribute('download')).toBe('transactions_2026-08-20.csv');
    });
  });
});
