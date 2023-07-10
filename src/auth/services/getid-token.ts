import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { Unauthorized } from '../../../types/error.js';
import { signOpts } from './sign-in.js';

export default async (refToken: string): Promise<string> => {
  const idToken = await redisClient.get(refToken);
  if (!idToken) {
    throw new Unauthorized();
  }

  try {
    const signToken = await redisClient.get(`${idToken}`);

    if (!signToken) {
      throw new Unauthorized();
    }
    jwt.verify(signToken, `${JWT_KEY}`, signOpts);
    const signIdToken = jwt.sign({ idToken }, `${JWT_KEY}`, signOpts);
    return signIdToken;
  } catch (error) {
    throw error;
  }
};
