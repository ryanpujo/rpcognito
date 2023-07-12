import { redisClient } from '../../../config/redisClient.js';
import jwt from 'jsonwebtoken';
import { authService } from './index.js';
import { Unauthorized } from '../../../types/error.js';

describe('get id token', () => {
  const token = 'shdbs';
  const idToken = 'sdssmmn';
  const signIdToken = 'sjknsjndj';
  it('return id token', async () => {
    import.meta.jest.spyOn(redisClient, 'get').mockResolvedValueOnce(idToken);
    import.meta.jest.spyOn(redisClient, 'get').mockResolvedValueOnce(token);
    import.meta.jest.spyOn(jwt, 'verify').mockImplementationOnce(() => 'dslk');
    import.meta.jest
      .spyOn(jwt, 'sign')
      .mockImplementationOnce(() => signIdToken);

    const actual = await authService.getIdToken('');
    expect(actual).toEqual(signIdToken);
  });

  it('should throw an error', async () => {
    import.meta.jest.spyOn(redisClient, 'get').mockResolvedValueOnce('');

    expect(async () => await authService.getIdToken('')).rejects.toThrow(
      Unauthorized
    );
  });
});
