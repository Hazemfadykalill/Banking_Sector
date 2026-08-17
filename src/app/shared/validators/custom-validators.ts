import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that a numeric input does not exceed a maximum number of decimal places.
 */
export function maxDecimalsValidator(maxDecimals: number = 2): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const valueStr = control.value.toString();
    const decimalIndex = valueStr.indexOf('.');
    
    if (decimalIndex !== -1) {
      const decimalPlaces = valueStr.length - decimalIndex - 1;
      if (decimalPlaces > maxDecimals) {
        return { maxDecimals: { max: maxDecimals, actual: decimalPlaces } };
      }
    }

    return null;
  };
}

/**
 * Validates that a date is not in the future (compared using local start-of-day comparison).
 */
export function pastOrTodayDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = control.value instanceof Date ? control.value : new Date(control.value);
    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Allow any time today

    if (selectedDate > today) {
      return { futureDate: true };
    }

    return null;
  };
}

/**
 * Cross-field validator ensuring Debit amount does not exceed target account balance.
 */
export function debitBalanceValidator(getBalance: () => number | undefined): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const typeControl = group.get('type');
    const amountControl = group.get('amount');

    if (!typeControl || !amountControl) {
      return null;
    }

    const type = typeControl.value;
    const amount = Number(amountControl.value);
    const balance = getBalance();

    if (type === 'Debit' && amount > 0 && balance !== undefined && amount > balance) {
      return { debitExceedsBalance: { balance, amount } };
    }

    return null;
  };
}
