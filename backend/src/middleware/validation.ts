import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Error handler for validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error: any) => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg
      }))
    });
    return;
  }
  next();
};

// Validation rules for user registration
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Das Passwort muss mindestens 8 Zeichen lang sein')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben und eine Zahl enthalten'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Der Vorname muss zwischen 2 und 50 Zeichen lang sein')
    .matches(/^[a-zA-ZäöüÄÖÜß\s]+$/)
    .withMessage('Der Vorname darf nur Buchstaben enthalten'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Der Nachname muss zwischen 2 und 50 Zeichen lang sein')
    .matches(/^[a-zA-ZäöüÄÖÜß\s]+$/)
    .withMessage('Der Nachname darf nur Buchstaben enthalten'),
  
  handleValidationErrors
];

// Validation rules for user login
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  
  body('password')
    .notEmpty()
    .withMessage('Das Passwort ist erforderlich'),
  
  handleValidationErrors
];

// Validation rules for transaction creation
export const validateTransaction = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Der Betrag muss eine positive Zahl sein'),
  
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Die Kategorie ist erforderlich und darf maximal 50 Zeichen lang sein'),
  
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Der Typ muss entweder "income" oder "expense" sein'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Die Beschreibung darf maximal 200 Zeichen lang sein'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Das Datum muss im gültigen Format sein'),
  
  handleValidationErrors
];

// Rate limiting helper
export const createRateLimitMessage = (retryAfter?: number) => {
  if (retryAfter) {
    return `Zu viele Anfragen. Versuchen Sie es in ${Math.ceil(retryAfter / 60)} Minuten erneut.`;
  }
  return 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.';
};

// Custom validation for strong passwords
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
