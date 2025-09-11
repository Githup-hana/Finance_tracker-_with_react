import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Zu viele Anfragen von dieser IP. Versuchen Sie es in 15 Minuten erneut.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Zu viele Anmeldeversuche. Versuchen Sie es in 15 Minuten erneut.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Zu viele Passwort-Reset-Anfragen. Versuchen Sie es in einer Stunde erneut.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Transaction creation rate limiter
export const transactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 transaction creations per minute
  message: {
    success: false,
    message: 'Zu viele Transaktionen erstellt. Versuchen Sie es in einer Minute erneut.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
