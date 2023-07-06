import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../types/error';

export const validateReq = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const verr = new RequestValidationError(errors.array(), 'validation error');
    return next(verr);
  }
  next();
};
