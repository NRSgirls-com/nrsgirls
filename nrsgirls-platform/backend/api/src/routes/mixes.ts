import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/mixes - List all public mixes
router.get('/', async (req: Request, res: Response) => {
  try {
    // Mock data - implement with actual database
    const mixes = [
      {
        id: 'mix_1',
        title: 'Summer House Mix 2025',
        djId: 'dj_1',
        djName: 'DJ Niel',
        duration: 3600, // seconds
        uploadedAt: '2025-01-01T00:00:00Z',
        playCount: 234,
        isPublic: true,
        streamUrl: 'https://cdn.nrsgirls.com/mixes/mix_1.mp3',
        rightsCleared: true
      }
    ];

    res.json({
      status: 'success',
      data: { mixes }
    });
  } catch (error) {
    logger.error('Error fetching mixes:', error);
    res.status(500).json({ error: 'Failed to fetch mixes' });
  }
});

// POST /api/mixes - Upload a new mix (requires auth)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, rightsMetadata } = req.body;

    // Mock upload response - implement with actual file processing
    const mix = {
      id: `mix_${Date.now()}`,
      title,
      description,
      djId: 'dj_1', // from auth token
      status: 'processing',
      uploadedAt: new Date().toISOString(),
      rightsMetadata
    };

    logger.info(`Mix uploaded: ${title} by DJ ${mix.djId}`);

    res.status(201).json({
      status: 'success',
      data: { mix }
    });
  } catch (error) {
    logger.error('Error uploading mix:', error);
    res.status(500).json({ error: 'Failed to upload mix' });
  }
});

export { router as mixRoutes };