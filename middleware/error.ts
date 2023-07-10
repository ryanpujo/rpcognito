/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { GeneralError, RequestValidationError } from '../types/error.js';

export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof GeneralError)) {
    return res.status(500).json({
      message: err.message,
    });
  }
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).json({
      message: err.serializeError(),
    });
  }
  res.status(err.statusCode).json({
    message: err.message,
  });
};
