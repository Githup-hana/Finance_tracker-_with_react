import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Umgebungsvariablen laden
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Für Entwicklung: Alle localhost Origins erlauben
    if (!origin || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Storage für Development
let users: any[] = [];
let transactions: any[] = [];

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK - Local Development Mode',
    message: 'Backend läuft ohne MongoDB für lokale Entwicklung',
    timestamp: new Date().toISOString()
  });
});

// Mock Auth Routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  // Prüfe ob User bereits existiert
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Benutzer existiert bereits' });
  }
  
  // Erstelle neuen User
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production: hash the password!
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // Mock JWT Token
  const token = `mock-jwt-token-${newUser.id}`;
  
  return res.status(201).json({
    message: 'Benutzer erfolgreich registriert',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Finde User
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
  }
  
  // Mock JWT Token
  const token = `mock-jwt-token-${user.id}`;
  
  return res.json({
    message: 'Erfolgreich angemeldet',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Mock Transaction Routes
app.get('/api/transactions', (req: Request, res: Response) => {
  // In einer echten App würden wir hier den JWT Token prüfen
  const userTransactions = transactions; // Für Demo: alle Transaktionen
  res.json(userTransactions);
});

app.post('/api/transactions', (req: Request, res: Response) => {
  const { Kategorie, amount, Transaktionstyp, description, date } = req.body;
  
  const newTransaction = {
    _id: Date.now().toString(),
    Kategorie,
    amount: Number(amount),
    Transaktionstyp,
    description,
    date: date || new Date().toISOString(),
    userId: 'mock-user-id',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  transactions = transactions.filter(t => t._id !== id);
  res.json({ message: 'Transaktion gelöscht' });
});

app.get('/api/transactions/stats', (req: Request, res: Response) => {
  const totalIncome = transactions
    .filter(t => t.Transaktionstyp === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.Transaktionstyp === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  res.json({
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    categoryStats: {}
  });
});

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route nicht gefunden' });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Interner Serverfehler' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server läuft auf Port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5174`);
  console.log(`🔧 Backend URL: http://localhost:${PORT}`);
  console.log(`💾 Database: In-Memory Mock Storage`);
  console.log(`⚠️  Development Mode: Keine echte Datenbank!`);
});
