import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

// Global error handler
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Development error response
const sendErrorDev = (err: any, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    message: err.message,
    error: err.name,
    stack: err.stack
  };

  res.status(err.statusCode).json(errorResponse);
};

// Production error response
const sendErrorProd = (err: any, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: err.message
    };
    res.status(err.statusCode).json(errorResponse);
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Etwas ist schief gelaufen!'
    };
    res.status(500).json(errorResponse);
  }
};

// Handle MongoDB CastError
const handleCastErrorDB = (err: any): AppError => {
  const message = `Ungültige ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle MongoDB duplicate field error
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Doppelter Feldwert: ${value}. Bitte verwenden Sie einen anderen Wert!`;
  return new AppError(message, 400);
};

// Handle MongoDB validation error
const handleValidationErrorDB = (err: MongooseError.ValidationError): AppError => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Ungültige Eingabedaten. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT error
const handleJWTError = (): AppError =>
  new AppError('Ungültiges Token. Bitte melden Sie sich erneut an!', 401);

// Handle JWT expired error
const handleJWTExpiredError = (): AppError =>
  new AppError('Ihr Token ist abgelaufen! Bitte melden Sie sich erneut an.', 401);

// Async error catcher
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler for unhandled routes
export const handleNotFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Route ${req.originalUrl} wurde nicht gefunden`, 404);
  next(err);
};

// Log errors to console with timestamp
export const logError = (err: any): void => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode
  });
};
