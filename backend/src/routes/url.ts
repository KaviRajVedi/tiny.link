// backend/src/routes/url.ts
import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import prisma from '../db';

const router = express.Router();

/**
 * GET /user-urls
 * Fetches all short URLs created by the authenticated user.
 */
router.get('/user-urls', authenticateToken, async (req: AuthRequest, res): Promise<void> => {
  try {
    if (!req.user)  res.status(403).json({ message: 'Unauthorized' });

    const urls = await prisma.url.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(urls);
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    res.status(500).json({ message: 'Error retrieving URLs' });
  }
});

/**
 * POST /shorten
 * Creates a new short URL for the authenticated user.
 */
router.post('/shorten', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const { originalUrl, customShortCode, expiration } = req.body;
    const userId: number = req.user.id; // ✅ Ensures userId is a number

    // Default expiration time: 1 day from now if not provided
    const expirationDate = expiration
      ? new Date(expiration)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Ensure user has not exceeded URL limit
    const userUrlsCount = await prisma.url.count({ where: { userId } });
    if (userUrlsCount >= 10) {
      res.status(400).json({ message: 'You have reached the maximum of 10 short URLs.' });
      return;
    }

    // Generate unique short code
    let shortCode = customShortCode || Math.random().toString(36).substring(2, 8);
    let existingUrl = await prisma.url.findUnique({ where: { shortCode } });

    while (existingUrl) {
      shortCode = Math.random().toString(36).substring(2, 8);
      existingUrl = await prisma.url.findUnique({ where: { shortCode } });
    }

    // ✅ Fix: Ensures `userId` is always a number
    const newUrl = await prisma.url.create({
      data: { originalUrl, shortCode, expiration: expirationDate, userId },
    });

    res.json({ shortUrl: `http://localhost:5000/${newUrl.shortCode}` });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


/**
 * DELETE /url/:id
 * Deletes a short URL if it belongs to the authenticated user.
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user)  res.status(403).json({ message: 'Unauthorized' });
  try {
    const urlId = parseInt(req.params.id);
    const url = await prisma.url.findUnique({ where: { id: urlId } });

    if (!url)  res.status(404).json({ message: 'URL not found' });
    if (url?.userId !== req.user?.id)  res.status(403).json({ message: 'Not authorized to delete this URL' });

    await prisma.url.delete({ where: { id: urlId } });
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/:id/set-expiration', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
     res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const urlId = parseInt(req.params.id);
    const { expiration } = req.body;

    if (!expiration || isNaN(new Date(expiration).getTime())) {
       res.status(400).json({ message: 'Invalid expiration date format' });
    }

    const url = await prisma.url.findUnique({ where: { id: urlId } });

    if (!url) {
       res.status(404).json({ message: 'URL not found' });
    }

    if (url?.userId !== req.user?.id) {
       res.status(403).json({ message: 'Not authorized to update this URL' });
    }

    const updatedUrl = await prisma.url.update({
      where: { id: urlId },
      data: { expiration: new Date(expiration) },
    });

    res.json({ message: 'Expiration updated successfully', url: updatedUrl });
  } catch (error) {
    console.error('Error updating expiration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




/**
 * PATCH /url/:id
 * Updates the expiration date for a short URL if it belongs to the authenticated user.
 */

router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  // Ensure user is authenticated
  if (!req.user) {
     res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const urlId = parseInt(req.params.id);
    const { expiration } = req.body;

    // Check if expiration date is provided and valid
    if (!expiration || isNaN(new Date(expiration).getTime())) {
       res.status(400).json({ message: 'Invalid expiration date format' });
    }

    const url = await prisma.url.findUnique({ where: { id: urlId } });

    // Check if the URL exists
    if (!url) {
       res.status(404).json({ message: 'URL not found' });
    }

    // Check if the authenticated user is authorized to update this URL
    if (url?.userId !== req.user?.id) {
       res.status(403).json({ message: 'Not authorized to update this URL' });
    }

    // Update expiration date for the URL
    const updatedUrl = await prisma.url.update({
      where: { id: urlId },
      data: { expiration: new Date(expiration) },
    });

    res.json({ message: 'Expiration updated successfully', url: updatedUrl });
  } catch (error) {
    console.error('Error updating expiration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * GET /:shortCode
 * Redirects the user to the original URL and increments the click count.
 */
router.get('/:shortCode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const url = await prisma.url.findUnique({ where: { shortCode } });

    if (!url) {
      res.status(404).json({ message: 'Shortened URL not found' });
      return;
    }

    // Increment click count safely
    await prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error handling short URL redirect:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
