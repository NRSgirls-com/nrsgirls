import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/moderation/queue - Get content moderation queue
router.get('/queue', async (req: Request, res: Response) => {
  try {
    // Mock data - implement with actual database
    const queue = [
      {
        id: 'mod_1',
        contentType: 'mix',
        contentId: 'mix_123',
        status: 'pending',
        flagReason: 'copyright_claim',
        submittedAt: '2025-01-01T00:00:00Z',
        priority: 'high'
      }
    ];

    res.json({
      status: 'success',
      data: { queue }
    });
  } catch (error) {
    logger.error('Error fetching moderation queue:', error);
    res.status(500).json({ error: 'Failed to fetch moderation queue' });
  }
});

export { router as moderationRoutes };