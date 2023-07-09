import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { authService } from '.';
import { JWT_KEY } from '../../../config/config.utils';
import { redisClient } from '../../../config/redisClient';
import { signOpts } from './sign-in';

/**
 * return a newly created acces token
 * @param {string} userId is the refresh token use to refresh the acces token
 * @returns {string} the newly created acces token
 */
export default async (userID: string): Promise<string> => {
  const token = authService.signIn({ id: new mongoose.Types.ObjectId(userID) });
  const idToken = await authService.saveToken(
    token,
    new mongoose.Types.ObjectId(userID)
  );
  const jwtId = sign({ idToken }, `${JWT_KEY}`, signOpts);
  await redisClient.setEx(`${idToken}`, token);
  return jwtId;
};
