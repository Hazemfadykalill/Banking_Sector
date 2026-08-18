import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Account, Transaction, TransactionCategory, TransactionType } from '../../../core/models';
import { BankingFacadeService } from '../../../core/services/banking-facade.service';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { maxDecimalsValidator, pastOrTodayDateValidator, debitBalanceValidator } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTransactionComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(BankingFacadeService);

  @Input() categories: TransactionCategory[] = [];
  @Input() types: TransactionType[] = [];
  @Input() selectedAccount: Account | null = null;
  @Input() visible: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() transactionCreated = new EventEmitter<Transaction>();

  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  readonly txForm: FormGroup = this.fb.group(
    {
      type: ['Debit', [Validators.required]],
      amount: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(100000),
          maxDecimalsValidator(2)
        ]
      ],
      date: [new Date(), [Validators.required, pastOrTodayDateValidator()]],
      merchant: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          noWhitespaceValidator
        ]
      ],
      category: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]]
    },
    {
      validators: [debitBalanceValidator(() => this.selectedAccount?.balance)]
    }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && this.categories.length > 0 && !this.txForm.get('category')?.value) {
      this.txForm.get('category')?.setValue(this.categories[0].name);
    }
  }

  get categoryOptions() {
    return this.categories.map(c => ({ label: c.name, value: c.name }));
  }

  get typeOptions() {
    return [
      { label: 'Debit', value: 'Debit' },
      { label: 'Credit', value: 'Credit' }
    ];
  }

  onClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.submitError = null;
    this.submitSuccess = null;
  }

  onSubmit(): void {
    this.submitError = null;
    this.submitSuccess = null;

    if (this.txForm.invalid) {
      this.txForm.markAllAsTouched();
      if (this.txForm.errors?.['debitExceedsBalance']) {
        const err = this.txForm.errors['debitExceedsBalance'];
        this.submitError = `Debit amount ($${err.amount.toFixed(2)}) exceeds current account balance ($${err.balance.toFixed(2)}).`;
      }
      return;
    }

    if (!this.selectedAccount) {
      this.submitError = 'No target account selected for this transaction.';
      return;
    }

    this.isSubmitting = true;
    const rawVal = this.txForm.value;

    const formattedDate = rawVal.date instanceof Date
      ? rawVal.date.toISOString()
      : new Date(rawVal.date).toISOString();

    const res = this.facade.addTransaction({
      accountId: this.selectedAccount.id,
      type: rawVal.type,
      amount: Number(rawVal.amount),
      date: formattedDate,
      merchant: rawVal.merchant.trim(),
      category: rawVal.category,
      description: rawVal.description?.trim()
    });

    this.isSubmitting = false;

    if (res.success && res.transaction) {
      this.submitSuccess = 'Transaction recorded successfully!';
      this.transactionCreated.emit(res.transaction);
      
      // Reset form but retain defaults
      this.txForm.reset({
        type: 'Debit',
        amount: null,
        date: new Date(),
        merchant: '',
        category: this.categories.length > 0 ? this.categories[0].name : '',
        description: ''
      });

      // Auto close after brief display
      setTimeout(() => {
        this.onClose();
      }, 1000);
    } else {
      this.submitError = res.error || 'Failed to process transaction.';
    }
  }
}
