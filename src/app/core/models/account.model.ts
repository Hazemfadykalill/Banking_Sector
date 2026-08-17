export type AccountType = 'Checking' | 'Savings' | 'Investment' | 'Loan';
export type AccountStatus = 'Active' | 'Dormant' | 'Frozen' | 'Closed';

export interface Account {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: string;
}
