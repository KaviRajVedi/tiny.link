import express, { Request, Response } from 'express';
import prisma from '../db';

const router = express.Router();

router.get('/:shortCode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      res.status(404).json({ message: 'Shortened URL not found' });
      return;
    }

    await prisma.url.update({
        where: { shortCode },
        data: { clicks: { increment: 1 } },
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
