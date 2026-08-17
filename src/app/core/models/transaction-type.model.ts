export type TransactionTypeKind = 'Debit' | 'Credit';

export interface TransactionType {
  id: string;
  name: TransactionTypeKind;
  description?: string;
}
