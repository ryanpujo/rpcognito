import { validate } from 'email-validator';
import { ENCRYPTION_KEY, JWT_KEY } from '../../../config/config.utils.js';
import { redisClient } from '../../../config/redisClient.js';
import { NotFound, BadRequest, GeneralError } from '../../../types/error.js';
import User from '../models/User.js';
import { authService } from './index.js';
import { signOpts } from './sign.js';
import jwt from 'jsonwebtoken';
import { Either, Left, Right } from '../../../utils/either.js';
import { EncryptedMessage } from './encryption.js';

/**
 * this function use as user sign in method it return both access token and refresh token
 * in a form of either type
 * @param {{email: string,password: string}} body is the input required for user to sign in
 * @returns {Token} return both access and refresh token in a form of either type
 */
export type Token = { jwtId: string; refToken: EncryptedMessage };
export default async (body: {
  email: string;
  password: string;
}): Promise<Either<GeneralError, Token>> => {
  const { email, password } = body;
  let user = await User.findOne({
    email: email,
  });
  if (!validate(email)) {
    user = await User.findOne({ username: email });
  }

  if (!user) {
    const notFound = new NotFound('user not found');
    return new Left(notFound);
  }
  try {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const badReq = new BadRequest('wrong password');
      return new Left(badReq);
    }
    const idToken = await authService.generateToken(user.id.toString());
    const refToken = authService.encryptMessage(
      user.id.toString(),
      `${ENCRYPTION_KEY}`
    );
    const isStored = await redisClient.setEx(user.id.toString(), idToken);
    if (isStored != 'OK') {
      const err = new GeneralError('internal error');
      return new Left(err);
    }

    const jwtId = jwt.sign({ idToken }, `${JWT_KEY}`, signOpts);

    return new Right({ jwtId, refToken });
  } catch (error: any) {
    const err = new GeneralError(error.message);
    return new Left(err);
  }
};
