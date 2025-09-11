import { Request } from 'express';
import { IUser } from '../models/User';

// Request/Response Types für Authentifizierung
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}

// Erweiterte Request Interface für authentifizierte Routes
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// JWT Payload Type
export interface JWTPayload {
  userId: string;
  email: string;
}

// Validation Error Type
export interface ValidationError {
  field: string;
  message: string;
}
