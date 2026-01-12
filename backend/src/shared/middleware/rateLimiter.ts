import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/AppError';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: 'Too many attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new BadRequestError('Too many authentication attempts. Please try again later.'));
  },
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new BadRequestError('Too many requests. Rate limit exceeded.'));
  },
});
