import { Request, Response } from 'express';
import { ENCRYPTION_KEY } from '../../../config/config.utils';
import Token from '../models/Token';
import { EncryptedMessage, decryptMessage } from '../services/encryption';
import { redisClient } from '../../../config/redisClient';
import { REFRESH_TOKEN } from './sign-in';

export default async (req: Request, res: Response) => {
  const refTokenEncrypted: EncryptedMessage = req.cookies.refreshing;
  if (!refTokenEncrypted) {
    return res.status(401).send('unauthorized');
  }
  const refToken = decryptMessage(refTokenEncrypted, `${ENCRYPTION_KEY}`);
  const idToken = await Token.findOneAndUpdate(
    { userId: refToken, revoke: false },
    { $set: { revoke: true } }
  ).select('_id');
  await redisClient.del(`${idToken?.id}`);
  res.clearCookie(REFRESH_TOKEN).status(200).send('logged out');
};
