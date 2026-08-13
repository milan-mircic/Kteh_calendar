import type { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME, verifyToken } from '../lib/auth';

// Attaches `req.user = { id }` when the auth cookie is present and valid,
// otherwise responds 401. Every protected route uses this.
//
// Augments `Express.User` (not `Request.user` directly) so this merges
// cleanly with @types/passport's own `Request.user?: Express.User` — the
// Google OAuth strategy's verify callback returns the same `{ id }` shape.
declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
