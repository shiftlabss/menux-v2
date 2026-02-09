import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors';
import { logger } from '@shared/logger';
import { ZodError } from 'zod';
import { config } from '@shared/config';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log the error
  logger.error(
    {
      err,
      requestId: req.requestId,
      url: req.url,
      method: req.method,
      ip: req.ip,
    },
    'Request failed',
  );

  // App Errors (Expected)
  if (err instanceof AppError) {
    return res.status(err.code).json({
      status: 'error',
      message: err.message,
      requestId: req.requestId,
      ...(err instanceof Object && 'details' in err ? { details: (err as any).details } : {}),
    });
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      details: err.errors,
      requestId: req.requestId,
    });
  }

  // TypeORM Errors
  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found',
      requestId: req.requestId,
    });
  }

  if (err instanceof QueryFailedError) {
    // Check for specific DB errors if needed (e.g. duplicate key)
    // Postgres unique violation code: 23505
    if ((err as any).code === '23505') {
      return res.status(409).json({
        status: 'error',
        message: 'Duplicate entry: resource already exists',
        requestId: req.requestId,
      });
    }

    // Postgres invalid input syntax for type uuid: 22P02
    if ((err as any).code === '22P02') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input syntax (e.g. invalid UUID)',
        requestId: req.requestId
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Database Query Error',
      // detailed message might expose DB structure, prefer generic in prod
      debug_message: config.env === 'development' ? err.message : undefined,
      requestId: req.requestId,
    });
  }

  // JSON Parse Error
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload',
      requestId: req.requestId
    })
  }

  // Fallback (Internal Server Error)
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    requestId: req.requestId,
    ...(config.env === 'development' ? { stack: err.stack } : {}),
  });
};
