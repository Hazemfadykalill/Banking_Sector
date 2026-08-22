import { FormControl } from '@angular/forms';
import { noWhitespaceValidator } from './no-whitespace.validator';

describe('noWhitespaceValidator', () => {
  it('should return null for a valid non-whitespace string', () => {
    const ctrl = new FormControl('Hello World');
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for a string with only non-whitespace characters', () => {
    const ctrl = new FormControl('abc123');
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for a string with leading and trailing spaces but non-empty trimmed content', () => {
    const ctrl = new FormControl('  hello  ');
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return { whitespace: true } for a whitespace-only string (spaces)', () => {
    const ctrl = new FormControl('   ');
    const result = noWhitespaceValidator(ctrl);
    expect(result).not.toBeNull();
    expect(result!['whitespace']).toBeTrue();
  });

  it('should return { whitespace: true } for a single space', () => {
    const ctrl = new FormControl(' ');
    expect(noWhitespaceValidator(ctrl)!['whitespace']).toBeTrue();
  });

  it('should return { whitespace: true } for a tab-only string', () => {
    const ctrl = new FormControl('\t\t');
    expect(noWhitespaceValidator(ctrl)!['whitespace']).toBeTrue();
  });

  it('should return { whitespace: true } for a newline-only string', () => {
    const ctrl = new FormControl('\n\n');
    expect(noWhitespaceValidator(ctrl)!['whitespace']).toBeTrue();
  });

  it('should return null for a null control value (treated as no input)', () => {
    const ctrl = new FormControl(null);
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for an undefined control value', () => {
    const ctrl = new FormControl(undefined);
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for an empty string (empty string is falsy, treated as no input)', () => {
    const ctrl = new FormControl('');
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for a numeric value (non-whitespace)', () => {
    const ctrl = new FormControl(42);
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });

  it('should return null for zero (falsy numeric, treated as no input)', () => {
    const ctrl = new FormControl(0);
    // 0 is falsy so the guard returns null before the trim check
    expect(noWhitespaceValidator(ctrl)).toBeNull();
  });
});
