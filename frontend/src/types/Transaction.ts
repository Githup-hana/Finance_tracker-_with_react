// Frontend Transaction Types
export interface Transaction {
  _id?: string;
  id?: string;
  userId?: string;
  Kategorie: string;
  amount: number;
  Transaktionstyp: 'income' | 'expense';
  description: string;
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoryStats: Record<string, {
    income: number;
    expense: number;
    total: number;
  }>;
}
