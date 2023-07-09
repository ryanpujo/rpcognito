import { Request, Response } from 'express';
import { EncryptedMessage, decryptMessage } from '../services/encryption';
import { ENCRYPTION_KEY, JWT_KEY } from '../../../config/config.utils';
import Token from '../models/Token';
import { sign, verify } from 'jsonwebtoken';
import { signOpts } from '../services/sign-in';
import { authService } from '../services';

/**
 * this handler responds to POST request to the /api/auth/signin endpoint
 * @param {Express.Request} req is the express request object
 * @param {Express.Response} res is the express response object
 *
 * @example
 * POST /api/auth/token
 * { idToken: 'jwtid' }
 */
export default async (req: Request, res: Response) => {
  const refTokenEncrypted: EncryptedMessage = req.cookies.refreshing;
  if (!refTokenEncrypted) {
    return res.status(401).send('unauthorized');
  }
  const refToken = decryptMessage(refTokenEncrypted, `${ENCRYPTION_KEY}`);

  const tokenDoc = await Token.findOne({
    userId: refToken,
    revoke: false,
  });
  if (!tokenDoc) {
    return res.status(401).send('unauthorized');
  }
  let idToken: string;
  try {
    verify(`${tokenDoc?.token}`, `${JWT_KEY}`, signOpts);
    idToken = sign({ idToken: tokenDoc?.id }, `${JWT_KEY}`, signOpts);
  } catch (error) {
    tokenDoc.revoke = true;
    idToken = await authService.generateToken(refToken);
    await tokenDoc?.save();
  }
  res.status(200).json({ idToken });
};
