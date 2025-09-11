import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import { globalErrorHandler, handleNotFound } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

// Umgebungsvariablen laden
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Rate limiting
app.use('/api/', apiLimiter);

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Erlaubt Requests ohne Origin (z.B. mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Für Entwicklung: Alle localhost Origins erlauben
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
        return callback(null, true);
      }
    }
    
    // Produktions-Domains aus Umgebungsvariablen
    const allowedDomains = [
      process.env.FRONTEND_URL,           // z.B. https://ihr-domain.com
      process.env.PRODUCTION_FRONTEND_URL, // z.B. https://www.ihr-domain.com
      // Weitere Domains können hier hinzugefügt werden
    ].filter(Boolean);
    
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    
    // Fallback für Entwicklung (nur wenn NODE_ENV nicht production ist)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`⚠️  CORS: Unbekannte Origin erlaubt (Entwicklung): ${origin}`);
      return callback(null, true);
    }
    
    // Produktions-Sicherheit: Unbekannte Origins ablehnen
    console.log(`🚫 CORS: Origin abgelehnt: ${origin}`);
    callback(new Error(`CORS: Origin ${origin} ist nicht erlaubt`));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB Verbindung
const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGODB_URL;
    
    if (!mongoURL) {
      throw new Error('MONGODB_URL ist nicht in den Umgebungsvariablen definiert');
    }

    console.log('🔄 Verbinde mit MongoDB...');
    console.log('📍 Database URL:', mongoURL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Verstecke Passwort
    
    await mongoose.connect(mongoURL, {
      // Moderne MongoDB Verbindungsoptionen
      serverSelectionTimeoutMS: 10000, // 10 Sekunden Timeout
      socketTimeoutMS: 45000,
      family: 4 // IPv4 verwenden
    });
    
    console.log('✅ MongoDB erfolgreich verbunden');
    console.log('📊 Database Name:', mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error('❌ MongoDB Verbindungsfehler:');
    
    if (error instanceof Error) {
      console.error('Fehler-Details:', error.message);
      
      // Spezifische Fehlermeldungen
      if (error.message.includes('IP')) {
        console.error('💡 Lösungsvorschlag: Füge deine IP-Adresse zur MongoDB Atlas Whitelist hinzu');
        console.error('🔗 Gehe zu: https://cloud.mongodb.com/ → Network Access → Add IP Address');
      }
      
      if (error.message.includes('authentication')) {
        console.error('💡 Lösungsvorschlag: Prüfe Username und Passwort in der Verbindungszeichenfolge');
      }
    }
    
    console.error('⚠️  Server startet ohne Datenbank. Einige Features funktionieren möglicherweise nicht.');
    // Nicht beenden, damit der Server trotzdem läuft
    // process.exit(1);
  }
};

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Finance Tracker API läuft!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unhandled routes
app.use(handleNotFound);

// Global error handler
app.use(globalErrorHandler);

// Server starten
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf Port ${PORT}`);
      console.log(`📱 Frontend URL: http://localhost:5173`);
      console.log(`🔧 Backend URL: http://localhost:${PORT}`);
      console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    });
  } catch (error) {
    console.error('❌ Server Start Fehler:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM Signal empfangen. Server wird heruntergefahren...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT Signal empfangen. Server wird heruntergefahren...');
  await mongoose.connection.close();
  process.exit(0);
});

// Server starten
startServer();
