import { Request, Response } from 'express';
import { ENCRYPTION_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { EncryptedMessage, decryptMessage } from '../services/encryption.js';
import { REFRESH_TOKEN } from './sign-in.js';

export default async (req: Request, res: Response) => {
  const refTokenEncrypted: EncryptedMessage = req.cookies.refreshing;
  if (!refTokenEncrypted) {
    return res.status(401).send('unauthorized');
  }
  const refToken = decryptMessage(refTokenEncrypted, `${ENCRYPTION_KEY}`);
  const idToken = await redisClient.get(refToken);
  await redisClient.del(refToken);
  await redisClient.del(`${idToken}`);
  res.clearCookie(REFRESH_TOKEN).status(200).json('logged out');
};
