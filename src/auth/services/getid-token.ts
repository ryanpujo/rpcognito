import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { Unauthorized } from '../../../types/error.js';
import { signOpts } from './sign.js';

/**
 * return an idToken or throw an error if the token associated with
 * the id is not valid anymore
 * @param {string} refToken is key to get the idToken
 * @returns {string} return the idToken
 * @throws {Error} throw an error if the access token is not valid
 */
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
