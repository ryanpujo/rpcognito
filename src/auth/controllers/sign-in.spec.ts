import { mockReq, mockRes } from 'sinon-express-mock';
import { authService } from '../services/index.js';
import { Left, Right } from '../../../utils/either.js';
import signIn, { REFRESH_TOKEN } from './sign-in.js';
import { BadRequest } from '../../../types/error.js';

describe('sign in middleware', () => {
  const err = new BadRequest('an error');
  const token = {
    jwtId: 'dfdfdfdf',
    refToken: { encrypted: 'sdsdsd', iv: Buffer.from('dfdfdfdf') },
  };
  it('it should succeed logged in', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: null,
      },
    });
    const res = mockRes();
    const next = import.meta.jest.fn();
    import.meta.jest
      .spyOn(authService, 'signIn')
      .mockResolvedValueOnce(new Right(token));

    await signIn(req, res, next);

    expect(res.status.calledOnceWith(200)).toBe(true);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should failed', async () => {
    const req = mockReq({
      cookies: {
        [REFRESH_TOKEN]: null,
      },
    });
    const res = mockRes();
    const next = import.meta.jest.fn();
    import.meta.jest
      .spyOn(authService, 'signIn')
      .mockResolvedValueOnce(new Left(err));

    await signIn(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(err);
  });
});
