import mongoose from 'mongoose';
import { UserDocument } from '../src/auth/models/User.js';
import { GeneralError, BadRequest } from './../types/error.js';
import { UserInfo } from '../types/user.js';
import { Left, Either, Right } from './either.js';

describe('test either', () => {
  it('left', () => {
    const left = new Left<GeneralError, UserDocument>(
      new BadRequest('bad error')
    );
    expect(left).toBeInstanceOf(Either);
    const l = left.fold(
      (l) => l,
      (r) => r
    );
    expect(l).toBeInstanceOf(GeneralError);
    expect(l.message).toEqual('bad error');
    expect(l.statusCode).toEqual(400);
  });

  it('right', () => {
    const userTest: UserInfo = {
      id: new mongoose.Types.ObjectId(),
      firstName: 'ryan',
      lastName: 'pujo',
      email: 'ryanpujo@yahoo.com',
      username: 'ryanpujo',
    };
    const right = new Right<GeneralError, UserInfo>(userTest);
    expect(right).toBeInstanceOf(Either);
    const r = right.fold(
      (l) => l,
      (r) => r
    );
    expect(r).toEqual(userTest);
  });
});
