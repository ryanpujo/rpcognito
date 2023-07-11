import { mockReq, mockRes } from 'sinon-express-mock';
import User from '../models/User.js';
import signIn, { REFRESH_TOKEN } from './sign-in.js';
import { authService } from '../services/index.js';
import { redisClient } from '../../../config/redisClient.js';
import jwt from 'jsonwebtoken';

describe('sign in', () => {
  it('should send an access token', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: null,
      },
      body: {
        email: 'kjsjds',
        password: 'kjdnfjdf',
      },
    });
    const res = mockRes();
    const next = import.meta.jest.fn();
    import.meta.jest
      .spyOn(User, 'findOne')
      .mockResolvedValueOnce({ password: 'slknsndksdn' });
    import.meta.jest
      .spyOn(User.prototype, 'comparePassword')
      .mockImplementationOnce(async () => true);
    import.meta.jest
      .spyOn(authService, 'generateToken')
      .mockResolvedValueOnce('jksndjnsdj');
    import.meta.jest.spyOn(redisClient, 'setEx').mockResolvedValueOnce('OKE');
    import.meta.jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'dfdfd');
    import.meta.jest
      .spyOn(authService, 'encryptMessage')
      .mockImplementationOnce(() => ({
        encrypted: 'sjndjnsd',
        iv: Buffer.from('sjsnjnsdjndjk'),
      }));

    await signIn(req, res, next);
    expect(res.status.calledWith(200)).toBe(true);
  });
});
