// Legacy transaction type for backward compatibility
export type Transaction = {
  Kategorie:
    | "Gehalt"
    | "Miete"
    | "Investitionen"
    | "Lebensmittel"
    | "Shopping"
    | "Freizeit"
    | "Sonstiges";
  amount: number;
  Transaktionstyp: "income" | "expense";
  date?: string;
};

// Enhanced transaction types
export interface EnhancedTransaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface TransactionFilters {
  category?: string;
  type?: 'income' | 'expense';
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  averageTransactionAmount: number;
  largestIncome: number;
  largestExpense: number;
  mostCommonCategory: string;
}

export interface CategoryStats {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  type: 'income' | 'expense';
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

// Form data for creating/editing transactions
export interface TransactionFormData {
  amount: string;
  category: string;
  type: 'income' | 'expense';
  description: string;
  date: string;
  tags: string[];
}

// API response types
export interface TransactionResponse {
  success: boolean;
  transaction?: EnhancedTransaction;
  message?: string;
}

export interface TransactionsResponse {
  success: boolean;
  transactions?: EnhancedTransaction[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

export interface TransactionStatsResponse {
  success: boolean;
  stats?: TransactionStats;
  categoryStats?: CategoryStats[];
  monthlyStats?: MonthlyStats[];
  message?: string;
}
