// Utility-Funktionen für Transaktions-Management
import { Transaction, TransactionStats } from '../types/Transaction';

export interface LocalStorageTransaction {
  id: string;
  Kategorie: string;
  amount: number;
  Transaktionstyp: 'income' | 'expense';
  description: string;
  date: string;
  userId?: string;
}

// API Base URL - Browser-kompatible Lösung
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service für Transaktionen
export class TransactionService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Alle Transaktionen vom Server abrufen
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen der Transaktionen:', error);
      throw error;
    }
  }

  // Neue Transaktion erstellen
  static async createTransaction(transaction: Omit<LocalStorageTransaction, 'id'>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(transaction)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Erstellen der Transaktion:', error);
      throw error;
    }
  }

  // Transaktion löschen
  static async deleteTransaction(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Transaktion:', error);
      throw error;
    }
  }

  // Transaktion aktualisieren
  static async updateTransaction(id: string, transaction: Partial<LocalStorageTransaction>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(transaction)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Transaktion:', error);
      throw error;
    }
  }

  // Statistiken abrufen
  static async getStats(): Promise<TransactionStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen der Statistiken:', error);
      throw error;
    }
  }

  // Migration: localStorage Daten zur Datenbank
  static async migrateLocalStorageToDatabase(userEmail: string): Promise<{
    success: boolean;
    migrated: number;
    errors: string[];
  }> {
    const result = {
      success: false,
      migrated: 0,
      errors: [] as string[]
    };

    try {
      // localStorage Transaktionen lesen
      const localStorageKey = `transactions_${userEmail}`;
      const localStorageData = localStorage.getItem(localStorageKey);
      
      if (!localStorageData) {
        result.errors.push('Keine localStorage Transaktionen gefunden');
        return result;
      }

      const localTransactions: LocalStorageTransaction[] = JSON.parse(localStorageData);
      
      if (!Array.isArray(localTransactions) || localTransactions.length === 0) {
        result.errors.push('Keine gültigen Transaktionen in localStorage gefunden');
        return result;
      }

      // Jede Transaktion zur Datenbank hinzufügen
      for (const transaction of localTransactions) {
        try {
          await this.createTransaction({
            Kategorie: transaction.Kategorie,
            amount: transaction.amount,
            Transaktionstyp: transaction.Transaktionstyp,
            description: transaction.description || 'Migriert aus localStorage',
            date: transaction.date
          });
          result.migrated++;
        } catch (error) {
          result.errors.push(`Fehler bei Transaktion ${transaction.id}: ${error}`);
        }
      }

      // localStorage nach erfolgreicher Migration leeren (optional)
      if (result.migrated > 0 && result.errors.length === 0) {
        localStorage.removeItem(localStorageKey);
        console.log(`✅ ${result.migrated} Transaktionen erfolgreich migriert`);
        result.success = true;
      }

      return result;
    } catch (error) {
      result.errors.push(`Allgemeiner Migrationsfehler: ${error}`);
      return result;
    }
  }

  // Backup: Alle Transaktionen als JSON exportieren
  static async exportTransactions(): Promise<string> {
    try {
      const transactions = await this.getTransactions();
      return JSON.stringify(transactions, null, 2);
    } catch (error) {
      console.error('Fehler beim Export:', error);
      throw error;
    }
  }

  // Import: Transaktionen aus JSON importieren
  static async importTransactions(jsonData: string): Promise<{
    success: boolean;
    imported: number;
    errors: string[];
  }> {
    const result = {
      success: false,
      imported: 0,
      errors: [] as string[]
    };

    try {
      const transactions = JSON.parse(jsonData);
      
      if (!Array.isArray(transactions)) {
        result.errors.push('Invalid JSON format: Expected array');
        return result;
      }

      for (const transaction of transactions) {
        try {
          await this.createTransaction(transaction);
          result.imported++;
        } catch (error) {
          result.errors.push(`Fehler beim Import: ${error}`);
        }
      }

      result.success = result.imported > 0;
      return result;
    } catch (error) {
      result.errors.push(`JSON Parse Fehler: ${error}`);
      return result;
    }
  }
}
