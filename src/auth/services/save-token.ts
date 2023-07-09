import mongoose from 'mongoose';
import Token from '../models/Token';

/**
 * this function will return an access token id that just being saved
 * @param {string} token is the newly created access token that will be save
 * @param {mongoose.Types.ObjectId} userId is the id of the owner of the access token
 * @returns {string} the newly saved acces token id
 */
export default async (
  token: string,
  userId: mongoose.Types.ObjectId
): Promise<string> => {
  const newToken = new Token({ token, revoke: false, userId });
  const saved = await newToken.save();
  return saved.id;
};
