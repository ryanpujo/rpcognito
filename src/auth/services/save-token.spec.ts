import mongoose from 'mongoose';
import saveToken from './save-token.js';
import Token from '../models/Token.js';

describe('saveToken', () => {
  const tokenTest = {
    id: '64a8d7bcdb16603beb929a22',
    token: 'djnfjdnjdknf',
  };
  it('it should return an arbitrary string', async () => {
    jest
      .spyOn(Token.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve(tokenTest));

    const token = await saveToken(
      tokenTest.token,
      new mongoose.Types.ObjectId('64a8d7bcdb16603beb429a22')
    );

    expect(token).toBeTruthy();
    expect(token).toEqual(tokenTest.id);
  });
});
