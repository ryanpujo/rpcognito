import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { nanoid } from 'nanoid';
import { JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { authService } from './index.js';
import { signOpts } from './sign-in.js';

/**
 * return a newly created acces token
 * @param {string} userID is the refresh token use to refresh the acces token
 * @returns {string} the newly created acces token
 */
export default async (userID: string): Promise<string> => {
  const token = authService.signIn({ id: new mongoose.Types.ObjectId(userID) });
  const idToken = nanoid(10);
  await redisClient.setEx(idToken, token);
  return idToken;
};
