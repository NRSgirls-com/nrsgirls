import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, displayName } = req.body;

    // Basic validation
    if (!email || !password || !role) {
      throw createError('Email, password, and role are required', 400);
    }

    if (!['dj', 'performer'].includes(role)) {
      throw createError('Role must be either "dj" or "performer"', 400);
    }

    // Check if user already exists (mock - implement with actual database)
    // const existingUser = await User.findByEmail(email);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (mock response)
    const user = {
      id: `user_${Date.now()}`,
      email,
      role,
      displayName: displayName || email.split('@')[0],
      created_at: new Date().toISOString()
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    logger.info(`User registered: ${email} with role ${role}`);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          displayName: user.displayName
        },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    throw createError('Registration failed', 500);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Mock user lookup - implement with actual database
    const mockUser = {
      id: 'user_123',
      email: 'niel@nrsgirls.com',
      role: 'dj',
      displayName: 'Niel',
      hashedPassword: await bcrypt.hash('password123', 12) // Mock password
    };

    // Check password
    const isValidPassword = await bcrypt.compare(password, mockUser.hashedPassword);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        email: mockUser.email, 
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      status: 'success',
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          displayName: mockUser.displayName
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    throw createError('Login failed', 500);
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Mock user data - implement with actual database lookup
    const user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      displayName: 'Niel'
    };

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    logger.error('Auth verification error:', error);
    throw createError('Invalid token', 401);
  }
});

export { router as authRoutes };