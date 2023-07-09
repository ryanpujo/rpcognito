import { validate } from 'email-validator';
import { NextFunction, Request, Response } from 'express';
import User, { UserDocument } from '../models/User';
import { BadRequest, NotFound } from '../../../types/error';
import { authService } from '../services';
import { encryptMessage } from '../services/encryption';
import { ENCRYPTION_KEY } from '../../../config/config.utils';

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
  const { email, password } = req.body;
  let user: UserDocument | undefined | null;
  if (validate(email)) {
    user = await User.findOne({ email: email });
  } else {
    user = await User.findOne({ username: email });
  }

  if (!user) {
    const notFound = new NotFound('user not found');
    return next(notFound);
  }

  user.comparePassword(password, async (err, isMatch) => {
    if (err) {
      return next(err);
    }
    if (!isMatch) {
      const badRequest = new BadRequest('wrong password');
      return next(badRequest);
    }
    if (!user) {
      const notFound = new NotFound('user not found');
      return next(notFound);
    }

    const jwtId = await authService.generateToken(user.id.toString());
    const refToken = encryptMessage(user.id.toString(), `${ENCRYPTION_KEY}`);
    const date = new Date();
    date.setDate(date.getDate() + 30);
    res
      .status(200)
      .cookie(REFRESH_TOKEN, refToken, {
        httpOnly: true,
        sameSite: true,
        secure: true,
        expires: date,
      })
      .json({ idToken: jwtId });
  });
};
