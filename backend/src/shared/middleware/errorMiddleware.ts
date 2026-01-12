import { Logger } from '../utils/logger';
import { AppError } from '../errors/AppError';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    Logger.warn(err.message, { 
      path: req.path, 
      method: req.method,
      statusCode: err.statusCode 
    });
    
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  Logger.error('Internal server error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
