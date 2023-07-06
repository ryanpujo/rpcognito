import { validate } from 'email-validator';
import { NextFunction, Request, Response } from 'express';
import User, { UserDocument } from '../models/User';
import { BadRequest, NotFound } from '../../../types/error';
import { authService } from '../services';
import { TOKEN_ID, redisClient } from '../../../config/redisClient';
import Token from '../models/Token';
import { encryptMessage } from '../services/encryption';
import { ENCRYPTION_KEY } from '../../../config/config.utils';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user: UserDocument | undefined | null;
  if (validate(email)) {
    user = await User.findOne({ email: email });
  } else {
    user = await User.findOne({ username: email });
  }

  if (!user) {
    const notFound = new NotFound('user not found');
    return next(notFound);
  }

  user.comparePassword(password, async (err, isMatch) => {
    if (err) {
      console.log('failed');
      return next(err);
    }
    if (!isMatch) {
      const badRequest = new BadRequest('wrong password');
      return next(badRequest);
    }
    if (!user) {
      const notFound = new NotFound('user not found');
      return next(notFound);
    }
    const token = authService.signIn({ email: user.email, id: user.id });
    const idToken = await saveToken(token);
    const encryp = encryptMessage(idToken, `${ENCRYPTION_KEY}`);
    await redisClient.set(`${TOKEN_ID}:${user.username}`, token);
    res
      .status(200)
      .cookie('username', user.username)
      .json({ idToken: encryp.encrypted });
  });
};

const saveToken = async (token: string) => {
  const newToken = new Token({ token, revoke: false });
  const saved = await newToken.save();
  return saved.id;
};
