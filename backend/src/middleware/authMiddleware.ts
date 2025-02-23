import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// Extend Express Request to Include `user`

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    isAdmin: boolean;
  };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access Denied' });
    return;  // ✅ Explicitly return after sending response
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid Token' });
      return;  // ✅ Explicitly return after sending response
    }
    
    req.user = decoded as { id: number; username: string; isAdmin: boolean };
    next();  // ✅ Ensure `next()` is always called when authentication is successful
  });
};

export { authenticateToken };
