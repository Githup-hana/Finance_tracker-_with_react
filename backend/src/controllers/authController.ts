import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  ErrorResponse,
  JWTPayload 
} from '../types/auth';

// JWT Token generieren
const generateToken = (userId: string, email: string): string => {
  const payload: JWTPayload = { userId, email };
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET ist nicht definiert');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// User registrieren
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validierung
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        message: 'Alle Felder sind erforderlich'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: 'Passwort muss mindestens 6 Zeichen haben'
      });
      return;
    }

    // Prüfen ob User bereits existiert
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        message: 'Ein Benutzer mit dieser E-Mail existiert bereits'
      });
      return;
    }

    // Passwort hashen
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Neuen User erstellen
    const newUser: IUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName
    });

    await newUser.save();

    // JWT Token generieren
    const token = generateToken(newUser._id.toString(), newUser.email);

    // JWT Token als HTTP-Only Cookie setzen
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
    });

    // Response senden (ohne Passwort)
    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({
      message: 'Interner Serverfehler bei der Registrierung'
    });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validierung
    if (!email || !password) {
      res.status(400).json({
        message: 'E-Mail und Passwort sind erforderlich'
      });
      return;
    }

    // User finden
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        message: 'Ungültige Anmeldedaten'
      });
      return;
    }

    // Passwort überprüfen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: 'Ungültige Anmeldedaten'
      });
      return;
    }

    // JWT Token generieren
    const token = generateToken(user._id.toString(), user.email);

    // JWT Token als HTTP-Only Cookie setzen
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
    });

    // Response senden
    res.status(200).json({
      message: 'Erfolgreich angemeldet',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({
      message: 'Interner Serverfehler beim Login'
    });
  }
};

// User Profile abrufen (für authentifizierte Routes)
export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user wird durch das auth middleware gesetzt
    const user = (req as any).user as IUser;
    
    res.status(200).json({
      message: 'Profil erfolgreich abgerufen',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Profil-Fehler:', error);
    res.status(500).json({
      message: 'Fehler beim Abrufen des Profils'
    });
  }
};

// User logout
export const logout = async (req: Request, res: Response) => {
  try {
    // Cookie löschen
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      message: 'Erfolgreich abgemeldet'
    });

  } catch (error) {
    console.error('Logout-Fehler:', error);
    res.status(500).json({
      message: 'Fehler beim Abmelden'
    });
  }
};
