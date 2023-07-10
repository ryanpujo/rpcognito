import { validate } from 'email-validator';
import { NextFunction, Request, Response } from 'express';
import { ENCRYPTION_KEY, JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { NotFound, BadRequest } from '../../../types/error.js';
import User, { UserDocument } from '../models/User.js';
import { EncryptedMessage, encryptMessage } from '../services/encryption.js';
import { authService } from '../services/index.js';
import jwt from 'jsonwebtoken';
import { signOpts } from '../services/sign-in.js';

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
  const refTokenEncrypted: EncryptedMessage = req.cookies.refreshing;
  if (refTokenEncrypted) {
    return res.status(200).json('you are logged in');
  }
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

    const idToken = await authService.generateToken(user.id.toString());
    const refToken = encryptMessage(user.id.toString(), `${ENCRYPTION_KEY}`);
    await redisClient.setEx(user.id.toString(), idToken);
    const jwtId = jwt.sign({ idToken }, `${JWT_KEY}`, signOpts);
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
