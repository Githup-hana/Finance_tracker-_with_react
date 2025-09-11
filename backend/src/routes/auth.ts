import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

// Öffentliche Routes mit Rate Limiting und Validation
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);

// Geschützte Routes (benötigen Authentication)
router.get('/profile', authenticateToken, getProfile);

// Test Route für Token-Validierung
router.get('/verify', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: 'Token ist gültig',
    valid: true,
    user: req.user
  });
});

export default router;
