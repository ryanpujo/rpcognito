import mongoose from 'mongoose';
import { redisClient } from '../../../config/redisClient.js';
import User from '../models/User.js';
import { authService } from './index.js';
import signIn, { Token } from './sign-in.js';
import jwt from 'jsonwebtoken';
import { NotFound } from '../../../types/error.js';

describe('sign in', () => {
  const userTest = {
    comparePassword: import.meta.jest.fn(),
    id: new mongoose.Types.ObjectId(),
  };
  const refToken = {
    encrypted: 'sjndjnsd',
    iv: Buffer.from('sjsnjnsdjndjk'),
  };
  const token: Token = {
    jwtId: 'sdsdsdd',
    refToken: refToken,
  };
  it('should return refresh token and acces token', async () => {
    import.meta.jest
      .spyOn(User, 'findOne')
      .mockResolvedValueOnce({})
      .mockResolvedValue(userTest);
    userTest.comparePassword.mockImplementationOnce(() => true);

    import.meta.jest
      .spyOn(authService, 'generateToken')
      .mockResolvedValueOnce('jksndjnsdj');
    import.meta.jest.spyOn(redisClient, 'setEx').mockResolvedValueOnce('OKE');
    import.meta.jest
      .spyOn(jwt, 'sign')
      .mockImplementationOnce(() => token.jwtId);
    import.meta.jest
      .spyOn(authService, 'encryptMessage')
      .mockImplementationOnce(() => refToken);

    const actual = await signIn({ email: '', password: '' });
    const errorOrToken = actual.fold(
      (l) => l,
      (r) => r
    );
    expect(errorOrToken).toMatchObject(token);
    expect((errorOrToken as Token).jwtId).toEqual(token.jwtId);
    expect((errorOrToken as Token).refToken).toMatchObject(refToken);
  });

  it('should return left', async () => {
    import.meta.jest
      .spyOn(User, 'findOne')
      .mockResolvedValueOnce({})
      .mockResolvedValue(null);
    userTest.comparePassword.mockImplementationOnce(() => true);

    const actual = await signIn({ email: '', password: '' });
    const errorOrToken = actual.fold(
      (l) => l,
      (r) => r
    );

    expect(errorOrToken).toBeInstanceOf(NotFound);
  });
});
