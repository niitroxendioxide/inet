import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

interface ErrorWithCode extends Error {
  code?: string;
}

export const errorHandler = (
  err: ErrorWithCode,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  console.error('Error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 