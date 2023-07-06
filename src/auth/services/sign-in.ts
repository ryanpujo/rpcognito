import { sign } from 'jsonwebtoken';
import {
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_KEY,
} from '../../../config/config.utils';
import mongoose from 'mongoose';

type Payload = {
  id: mongoose.Types.ObjectId;
  email: string;
};
export default (payload: Payload) => {
  return sign(payload, `${JWT_KEY}`, {
    expiresIn: 10 * 60,
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  });
};
