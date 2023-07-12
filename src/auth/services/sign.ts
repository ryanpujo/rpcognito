import jwt from 'jsonwebtoken';
import {
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_KEY,
} from '../../../config/config.utils.js';
import mongoose from 'mongoose';

export type Payload = {
  id: mongoose.Types.ObjectId;
};

export const signOpts: jwt.SignOptions = {
  expiresIn: 3 * 60,
  audience: JWT_AUDIENCE,
  issuer: JWT_ISSUER,
};

/**
 * this function will generate a new access token
 * @param {Payload} payload is a credebtial of the user that will logged in
 * @returns {string} the generated access token
 */
export default (payload: Payload) => {
  return jwt.sign(payload, `${JWT_KEY}`, signOpts);
};
