import { NextFunction, Request, Response } from 'express';
import { authService } from '../services';

/**
 * this handler responds to POST request to the /api/auth/users endpoint
 * @param {Express.Request} req is the express request object
 * @param {Express.Response} res is the express response object
 *
 * @example
 * POST /api/auth/users
 * {
 *  id: created.id,
 *  firstName: created.firstName,
 *  lastName: created.lastName,
 *  email: created.email,
 *  username: created.username,
 * }
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const either = await authService.signUp(req.body);

  either.fold(
    (l) => next(l),
    (r) => res.status(201).json(r)
  );
};
