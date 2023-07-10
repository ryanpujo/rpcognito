import mongoose from 'mongoose';
import { redisClient } from '../../../config/redisClient.js';
import { authService } from './index.js';


/**
 * return a newly created acces token
 * @param {string} token is the refresh token use to refresh the acces token
 * @returns {string} the newly created acces token
 */
export default async (token: string): Promise<string> => {
  const newToken = authService.signIn({
    id: new mongoose.Types.ObjectId(token),
  });
  const idToken = await authService.saveToken(
    newToken,
    new mongoose.Types.ObjectId(token)
  );
  await redisClient.setEx(`${idToken}`, newToken);
  return idToken;
};
