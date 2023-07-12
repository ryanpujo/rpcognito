import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import signIn from './sign.js';

describe('test sign in', () => {
  const testToken = 'jnrjenndjndfjdj';
  it('should return an arbitrary string', () => {
    import.meta.jest.spyOn(jwt, 'sign').mockImplementationOnce(() => testToken);
    const token = signIn({
      id: new mongoose.Types.ObjectId('64a8d7bcdb16603beb929a22'),
    });

    expect(token).toEqual(testToken);
  });
});
