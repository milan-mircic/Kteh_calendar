import type { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME, verifyToken } from '../lib/auth';

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Proverava da li token uopste postoji
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  // Proverava vrednost tokena
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
