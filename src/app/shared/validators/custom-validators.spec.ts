import { FormControl, FormGroup } from '@angular/forms';
import {
  maxDecimalsValidator,
  pastOrTodayDateValidator,
  debitBalanceValidator
} from './custom-validators';

// ---------------------------------------------------------------------------
// maxDecimalsValidator
// ---------------------------------------------------------------------------
describe('maxDecimalsValidator', () => {
  describe('with default maxDecimals = 2', () => {
    const validator = maxDecimalsValidator();

    it('should return null for an integer value', () => {
      const ctrl = new FormControl(100);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return null for a value with exactly 2 decimal places', () => {
      const ctrl = new FormControl(99.99);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return null for a value with 1 decimal place', () => {
      const ctrl = new FormControl(10.5);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return { maxDecimals } error for a value with 3 decimal places', () => {
      const ctrl = new FormControl(1.123);
      const result = validator(ctrl);
      expect(result).not.toBeNull();
      expect(result!['maxDecimals']).toEqual({ max: 2, actual: 3 });
    });

    it('should return { maxDecimals } error for a value with 5 decimal places', () => {
      const ctrl = new FormControl(0.12345);
      const result = validator(ctrl);
      expect(result!['maxDecimals'].actual).toBe(5);
    });

    it('should return null for null control value', () => {
      const ctrl = new FormControl(null);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return null for undefined control value', () => {
      const ctrl = new FormControl(undefined);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return null for empty string control value', () => {
      const ctrl = new FormControl('');
      expect(validator(ctrl)).toBeNull();
    });

    it('should return null for a string integer value', () => {
      const ctrl = new FormControl('100');
      expect(validator(ctrl)).toBeNull();
    });
  });

  describe('with custom maxDecimals = 0', () => {
    const validator = maxDecimalsValidator(0);

    it('should return null for an integer', () => {
      const ctrl = new FormControl(42);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return error for any decimal value', () => {
      const ctrl = new FormControl(42.1);
      const result = validator(ctrl);
      expect(result).not.toBeNull();
      expect(result!['maxDecimals'].max).toBe(0);
    });
  });

  describe('with custom maxDecimals = 4', () => {
    const validator = maxDecimalsValidator(4);

    it('should return null for 4 decimal places', () => {
      const ctrl = new FormControl(1.2345);
      expect(validator(ctrl)).toBeNull();
    });

    it('should return error for 5 decimal places', () => {
      const ctrl = new FormControl(1.23456);
      expect(validator(ctrl)).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// pastOrTodayDateValidator
// ---------------------------------------------------------------------------
describe('pastOrTodayDateValidator', () => {
  const validator = pastOrTodayDateValidator();

  it('should return null for a Date object set to today', () => {
    const today = new Date();
    const ctrl = new FormControl(today);
    expect(validator(ctrl)).toBeNull();
  });

  it('should return null for a past Date object', () => {
    const past = new Date('2020-01-01');
    const ctrl = new FormControl(past);
    expect(validator(ctrl)).toBeNull();
  });

  it('should return null for a past date string', () => {
    const ctrl = new FormControl('2020-06-15');
    expect(validator(ctrl)).toBeNull();
  });

  it('should return { futureDate: true } for a Date object set to tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ctrl = new FormControl(tomorrow);
    const result = validator(ctrl);
    expect(result).not.toBeNull();
    expect(result!['futureDate']).toBeTrue();
  });

  it('should return { futureDate: true } for a date 30 days in the future', () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const ctrl = new FormControl(future);
    expect(validator(ctrl)!['futureDate']).toBeTrue();
  });

  it('should return null for null control value', () => {
    const ctrl = new FormControl(null);
    expect(validator(ctrl)).toBeNull();
  });

  it('should return null for undefined control value', () => {
    const ctrl = new FormControl(undefined);
    expect(validator(ctrl)).toBeNull();
  });

  it('should return null for empty string control value', () => {
    const ctrl = new FormControl('');
    expect(validator(ctrl)).toBeNull();
  });

  it('should return { invalidDate: true } for a non-parseable date string', () => {
    const ctrl = new FormControl('not-a-date');
    const result = validator(ctrl);
    expect(result).not.toBeNull();
    expect(result!['invalidDate']).toBeTrue();
  });

  it('should return null for today at end-of-day boundary', () => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 998);
    const ctrl = new FormControl(endOfToday);
    expect(validator(ctrl)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// debitBalanceValidator
// ---------------------------------------------------------------------------
describe('debitBalanceValidator', () => {
  function buildGroup(type: string, amount: number | null, getBalance: () => number | undefined): FormGroup {
    const group = new FormGroup({
      type: new FormControl(type),
      amount: new FormControl(amount)
    });
    group.setValidators(debitBalanceValidator(getBalance));
    group.updateValueAndValidity();
    return group;
  }

  it('should return null when Debit amount is within balance', () => {
    const group = buildGroup('Debit', 500, () => 1000);
    expect(group.errors).toBeNull();
  });

  it('should return null when Debit amount equals balance exactly', () => {
    const group = buildGroup('Debit', 1000, () => 1000);
    expect(group.errors).toBeNull();
  });

  it('should return { debitExceedsBalance } when Debit amount exceeds balance', () => {
    const group = buildGroup('Debit', 1500, () => 1000);
    expect(group.errors).not.toBeNull();
    expect(group.errors!['debitExceedsBalance']).toEqual({ balance: 1000, amount: 1500 });
  });

  it('should return null when type is Credit regardless of amount', () => {
    const group = buildGroup('Credit', 9999, () => 100);
    expect(group.errors).toBeNull();
  });

  it('should return null when balance is undefined', () => {
    const group = buildGroup('Debit', 1000, () => undefined);
    expect(group.errors).toBeNull();
  });

  it('should return null when amount is 0', () => {
    const group = buildGroup('Debit', 0, () => 500);
    expect(group.errors).toBeNull();
  });

  it('should return null when amount is null', () => {
    const group = buildGroup('Debit', null, () => 500);
    expect(group.errors).toBeNull();
  });

  it('should return null when type control is missing from the group', () => {
    const group = new FormGroup({ amount: new FormControl(500) });
    group.setValidators(debitBalanceValidator(() => 100));
    group.updateValueAndValidity();
    expect(group.errors).toBeNull();
  });

  it('should return null when amount control is missing from the group', () => {
    const group = new FormGroup({ type: new FormControl('Debit') });
    group.setValidators(debitBalanceValidator(() => 100));
    group.updateValueAndValidity();
    expect(group.errors).toBeNull();
  });

  it('should use the latest value from the dynamic balance getter', () => {
    let currentBalance = 1000;
    const getBalance = () => currentBalance;
    const group = buildGroup('Debit', 800, getBalance);
    expect(group.errors).toBeNull();

    currentBalance = 500;
    group.updateValueAndValidity();
    expect(group.errors!['debitExceedsBalance']).toBeDefined();
  });
});
