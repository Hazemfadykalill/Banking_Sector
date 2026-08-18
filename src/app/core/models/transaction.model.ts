import { TransactionTypeKind } from './transaction-type.model';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionTypeKind;
  amount: number;
  date: string; // ISO String
  merchant: string;
  category: string;
  balanceAfter: number;
  description?: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  type: TransactionTypeKind;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  description?: string;
}

export interface TransactionFilter {
  startDate?: Date | null;
  endDate?: Date | null;
  type?: TransactionTypeKind | 'ALL';
  category?: string | 'ALL';
  searchQuery?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}
