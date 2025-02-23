import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { User } from '@prisma/client';

const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({ message: 'User registered successfully.', token, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        password: true,
        urls: {
          select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            clicks: true,
            expiration: true,
            createdAt: true,
            userId: true,
          }
        }
      }
    });

    if (!user) {
       res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userData } = user as User & {
      urls: {
        id: number;
        originalUrl: string;
        shortCode: string;
        clicks: number;
        expiration: Date;
        createdAt: Date;
        userId: number;
      }[];
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
