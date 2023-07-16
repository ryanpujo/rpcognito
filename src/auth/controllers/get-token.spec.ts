import { mockReq, mockRes } from 'sinon-express-mock';
import { REFRESH_TOKEN } from './sign-in.js';
import { authService } from '../services/index.js';
import getToken from './get-token.js';
import { Unauthorized } from '../../../types/error.js';
import { redisClient } from '../../../config/redisClient.js';
import jwt from 'jsonwebtoken';

describe('get token', () => {
  const idToken = 'skjdjjdsj';
  const signToken = 'skjdfjnfrj';
  const err = new Unauthorized();
  const res = mockRes();
  const next = import.meta.jest.fn((err) =>
    res.status(err.statusCode).json({ message: err.message })
  );
  it('should send the token to the response', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: {
          encrypted: 'ksnkdndnsd',
          iv: Buffer.from('kndnskdkd'),
        },
      },
    });
    import.meta.jest
      .spyOn(authService, 'getIdToken')
      .mockResolvedValueOnce(idToken);
    import.meta.jest
      .spyOn(authService, 'decryptMessage')
      .mockReturnValueOnce('sdjjsndjd');

    await getToken(req, res, next);

    expect(res.status.calledWith(200)).toBe(true);
    expect(res.json.calledWith({ idToken })).toBe(true);
  });

  it('should return 401 status code', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: null,
      },
    });

    await getToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(err);
    expect(res.status.calledWith(err.statusCode)).toBe(true);
    expect(res.json.calledWith({ message: err.message })).toBe(true);
  });

  it('should refresh the token', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: {
          encrypted: 'ksnkdndnsd',
          iv: Buffer.from('kndnskdkd'),
        },
      },
    });
    import.meta.jest
      .spyOn(authService, 'getIdToken')
      .mockImplementationOnce(() => {
        throw err;
      });
    import.meta.jest
      .spyOn(authService, 'decryptMessage')
      .mockReturnValueOnce('sdjjsndjd');
    import.meta.jest
      .spyOn(authService, 'generateToken')
      .mockResolvedValueOnce(idToken);
    import.meta.jest.spyOn(redisClient, 'setEx').mockResolvedValueOnce('OKE');
    import.meta.jest.spyOn(jwt, 'sign').mockImplementationOnce(() => signToken);

    await getToken(req, res, next);

    expect(res.status.calledWith(200)).toBe(true);
    expect(res.json.calledWith({ idToken: signToken })).toBe(true);
  });
});
