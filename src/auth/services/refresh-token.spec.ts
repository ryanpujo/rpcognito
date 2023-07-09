import { authService } from '.';
import { redisClient } from '../../../config/redisClient';
import refreshToken from './refresh-token';
describe('refresh token', () => {
  const tokenTest = 'dd,mdmndmndrndm';
  jest.mock('redis', () => jest.requireActual('redis-mock'));
  it('should return a new token', async () => {
    jest
      .spyOn(authService, 'saveToken')
      .mockImplementationOnce(() => Promise.resolve(tokenTest));
    jest.spyOn(redisClient, 'setEx').mockImplementationOnce(async () => '');

    const token = await refreshToken('64a8d7bcdb16603beb929a22');

    expect(token).toEqual(tokenTest);
  });
});
