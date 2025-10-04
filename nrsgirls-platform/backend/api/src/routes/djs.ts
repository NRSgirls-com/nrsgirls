import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/djs - List all DJs
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock data - implement with actual database
    const djs = [
      {
        id: 'dj_1',
        displayName: 'DJ Niel',
        email: 'niel@nrsgirls.com',
        bio: 'Professional DJ from Fresno',
        mixCount: 12,
        totalPlays: 1534,
        createdAt: '2025-01-01T00:00:00Z'
      }
    ];

    res.json({
      status: 'success',
      data: { djs }
    });
  } catch (error) {
    logger.error('Error fetching DJs:', error);
    res.status(500).json({ error: 'Failed to fetch DJs' });
  }
});

// GET /api/djs/:id - Get DJ profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data - implement with actual database
    const dj = {
      id,
      displayName: 'DJ Niel',
      email: 'niel@nrsgirls.com',
      bio: 'Professional DJ from Fresno',
      mixCount: 12,
      totalPlays: 1534,
      createdAt: '2025-01-01T00:00:00Z'
    };

    res.json({
      status: 'success',
      data: { dj }
    });
  } catch (error) {
    logger.error('Error fetching DJ:', error);
    res.status(500).json({ error: 'Failed to fetch DJ' });
  }
});

export { router as djRoutes };