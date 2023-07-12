import { redisClient } from '../../../config/redisClient.js';
import { authService } from './index.js';

describe('generate token', () => {
  it('should return id token', async () => {
    import.meta.jest.spyOn(redisClient, 'setEx').mockResolvedValueOnce('OKE');
    const actual = await authService.generateToken('64ae01524b41f28604933938');

    expect(actual).toBeDefined();
  });
});
