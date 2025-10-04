import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/performers - List performers (respecting privacy settings)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock data - implement with actual database
    const performers = [
      {
        id: 'performer_1',
        displayName: 'Artist_Anonymous',
        isAnonymous: true,
        bio: 'Electronic music performer',
        claimsCount: 3,
        createdAt: '2025-01-01T00:00:00Z'
      }
    ];

    res.json({
      status: 'success',
      data: { performers }
    });
  } catch (error) {
    logger.error('Error fetching performers:', error);
    res.status(500).json({ error: 'Failed to fetch performers' });
  }
});

export { router as performerRoutes };