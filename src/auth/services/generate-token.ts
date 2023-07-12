import mongoose from 'mongoose';

import { nanoid } from 'nanoid';
import { redisClient } from '../../../config/redisClient.js';
import { authService } from './index.js';

/**
 * return a newly created acces token
 * @param {string} userID is the refresh token use to refresh the acces token
 * @returns {string} the newly created acces token
 */
export default async (userID: string): Promise<string> => {
  const token = authService.sign({ id: new mongoose.Types.ObjectId(userID) });
  const idToken = nanoid(10);
  await redisClient.setEx(idToken, token);
  return idToken;
};
