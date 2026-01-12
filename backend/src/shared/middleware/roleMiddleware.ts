import { Role } from '@prisma/client';
import { AuthRequest } from './authMiddleware';
import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/AppError';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};
