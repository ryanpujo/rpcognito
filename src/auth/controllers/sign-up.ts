import { NextFunction, Request, Response } from 'express';
import { authService } from '../services';

export default async (req: Request, res: Response, next: NextFunction) => {
  const either = await authService.signUp(req.body);

  either.fold(
    (l) => next(l),
    (r) => res.status(201).json(r)
  );
};
