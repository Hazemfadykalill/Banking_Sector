export type AccountStatus = 'Active' | 'Dormant' | 'Frozen' | 'Closed';

export interface Account {
  id: string;
  customerId: string; // References Customer.CIF
  type: string;
  currency: string;
  balance: number;
  iban: string;
  status: AccountStatus;
  createdAt?: string;
}

