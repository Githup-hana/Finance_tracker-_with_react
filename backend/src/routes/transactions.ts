import express from 'express';
import { 
  getTransactions, 
  createTransaction, 
  deleteTransaction, 
  updateTransaction, 
  getTransactionStats 
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Alle Routes benötigen Authentifizierung
router.use(authenticateToken);

// GET /api/transactions - Alle Transaktionen abrufen
router.get('/', getTransactions);

// POST /api/transactions - Neue Transaktion erstellen
router.post('/', createTransaction);

// GET /api/transactions/stats - Statistiken abrufen
router.get('/stats', getTransactionStats);

// PUT /api/transactions/:id - Transaktion bearbeiten
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id - Transaktion löschen
router.delete('/:id', deleteTransaction);

export default router;
