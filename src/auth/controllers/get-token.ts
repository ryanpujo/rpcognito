import { NextFunction, Request, Response } from 'express';
import { ENCRYPTION_KEY, JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { EncryptedMessage } from '../services/encryption.js';
import { authService } from '../services/index.js';
import { signOpts } from '../services/sign.js';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../../../types/error.js';
import { REFRESH_TOKEN } from './sign-in.js';

/**
 * this handler responds to POST request to the /api/auth/signin endpoint
 * @param {Express.Request} req is the express request object
 * @param {Express.Response} res is the express response object
 *
 * @example
 * POST /api/auth/token
 * { idToken: 'jwtid' }
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const refTokenEncrypted: EncryptedMessage = req.cookies[REFRESH_TOKEN];
  let jwtId: string;
  if (!refTokenEncrypted) {
    const unauthorized = new Unauthorized();
    return next(unauthorized);
  }
  const refToken = authService.decryptMessage(
    refTokenEncrypted,
    `${ENCRYPTION_KEY}`
  );
  try {
    jwtId = await authService.getIdToken(refToken);
  } catch (error) {
    const idToken = await authService.generateToken(refToken);
    await redisClient.setEx(refToken, idToken);
    jwtId = jwt.sign({ idToken }, `${JWT_KEY}`, signOpts);
  }
  res.status(200).json({ idToken: jwtId });
};
