import { Transaction } from "../types/transactions";

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem("transactions");
  return data ? JSON.parse(data) : [];
}
