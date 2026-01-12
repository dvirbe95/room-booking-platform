import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from '../errors/AppError';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new BadRequestError(message));
      }
      next(error);
    }
  };
};
