import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { JWTPayload, AuthenticatedRequest } from '../types/auth';

// JWT Token verifizieren
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Token aus Authorization Header extrahieren
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        message: 'Zugangstoken erforderlich'
      });
      return;
    }

    // JWT Secret prüfen
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET ist nicht definiert');
      res.status(500).json({
        message: 'Server-Konfigurationsfehler'
      });
      return;
    }

    // Token verifizieren
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // User aus Datenbank laden
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        message: 'Ungültiger Token - Benutzer nicht gefunden'
      });
      return;
    }

    // User zu Request hinzufügen
    req.user = user;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: 'Ungültiger Token'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: 'Token ist abgelaufen'
      });
      return;
    }

    console.error('Auth Middleware Fehler:', error);
    res.status(500).json({
      message: 'Interner Serverfehler bei der Authentifizierung'
    });
  }
};

// Optionale Authentifizierung (für öffentliche Routes mit optionalen User-Daten)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Kein Token, aber das ist OK - fortfahren ohne User
      next();
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    } catch (tokenError) {
      // Token ist ungültig, aber das ist OK für optionale Auth
      console.log('Optionale Auth: Ungültiger Token ignoriert');
    }

    next();

  } catch (error) {
    console.error('Optionale Auth Fehler:', error);
    next(); // Trotz Fehler fortfahren
  }
};
