import { NextFunction, Request, Response } from 'express';
import { EncryptedMessage } from '../services/encryption.js';
import { authService } from '../services/index.js';

export const REFRESH_TOKEN = 'refreshing';

/**
 * this handler responds to POST request to the /api/auth/signin endpoint
 * @param {Express.Request} req is the express request object
 * @param {Express.Response} res is the express response object
 *
 * @example
 * POST /api/auth/signin
 * { idToken: 'jwtid' }
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const refTokenEncrypted: EncryptedMessage = req.cookies[REFRESH_TOKEN];
  if (refTokenEncrypted) {
    return res.status(200).json('you are logged in');
  }
  const errorOrToken = await authService.signIn(req.body);
  const date = new Date();
  date.setDate(date.getDate() + 30);
  errorOrToken.fold(
    (l) => next(l),
    (r) =>
      res
        .status(200)
        .cookie(REFRESH_TOKEN, r.refToken, {
          sameSite: true,
          httpOnly: true,
          secure: true,
          expires: date,
        })
        .json({ idToken: r.jwtId })
  );
};
