import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';

// Alle Transaktionen eines Users abrufen
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Nicht autorisiert' });
      return;
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Fehler beim Abrufen der Transaktionen:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Transaktionen' });
  }
};

// Neue Transaktion erstellen
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Nicht autorisiert' });
      return;
    }

    const { Kategorie, amount, Transaktionstyp, description, date } = req.body;

    // Validierung
    if (!Kategorie || !amount || !Transaktionstyp || !description) {
      res.status(400).json({ message: 'Alle Felder sind erforderlich' });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: 'Betrag muss größer als 0 sein' });
      return;
    }

    if (!['income', 'expense'].includes(Transaktionstyp)) {
      res.status(400).json({ message: 'Ungültiger Transaktionstyp' });
      return;
    }

    const newTransaction = new Transaction({
      userId,
      Kategorie: Kategorie.trim(),
      amount: Number(amount),
      Transaktionstyp,
      description: description.trim(),
      date: date ? new Date(date) : new Date()
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Fehler beim Erstellen der Transaktion:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen der Transaktion' });
  }
};

// Transaktion löschen
export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const transactionId = req.params.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Nicht autorisiert' });
      return;
    }

    const transaction = await Transaction.findOne({ _id: transactionId, userId });
    
    if (!transaction) {
      res.status(404).json({ message: 'Transaktion nicht gefunden' });
      return;
    }

    await Transaction.findByIdAndDelete(transactionId);
    res.json({ message: 'Transaktion erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Transaktion:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen der Transaktion' });
  }
};

// Transaktion bearbeiten
export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const transactionId = req.params.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Nicht autorisiert' });
      return;
    }

    const { Kategorie, amount, Transaktionstyp, description, date } = req.body;

    // Validierung
    if (amount && amount <= 0) {
      res.status(400).json({ message: 'Betrag muss größer als 0 sein' });
      return;
    }

    if (Transaktionstyp && !['income', 'expense'].includes(Transaktionstyp)) {
      res.status(400).json({ message: 'Ungültiger Transaktionstyp' });
      return;
    }

    const updateData: any = {};
    if (Kategorie) updateData.Kategorie = Kategorie.trim();
    if (amount) updateData.amount = Number(amount);
    if (Transaktionstyp) updateData.Transaktionstyp = Transaktionstyp;
    if (description) updateData.description = description.trim();
    if (date) updateData.date = new Date(date);

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      updateData,
      { new: true }
    );
    
    if (!updatedTransaction) {
      res.status(404).json({ message: 'Transaktion nicht gefunden' });
      return;
    }

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Transaktion:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Transaktion' });
  }
};

// Statistiken abrufen
export const getTransactionStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Nicht autorisiert' });
      return;
    }

    const transactions = await Transaction.find({ userId });
    
    const totalIncome = transactions
      .filter(t => t.Transaktionstyp === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.Transaktionstyp === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    const categoryStats = transactions.reduce((acc, transaction) => {
      const category = transaction.Kategorie;
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0, total: 0 };
      }
      
      if (transaction.Transaktionstyp === 'income') {
        acc[category].income += transaction.amount;
      } else {
        acc[category].expense += transaction.amount;
      }
      
      acc[category].total = acc[category].income - acc[category].expense;
      return acc;
    }, {} as Record<string, { income: number; expense: number; total: number }>);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      categoryStats
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Statistiken:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Statistiken' });
  }
};
