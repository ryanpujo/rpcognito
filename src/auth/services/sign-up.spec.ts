// jest.mock('../models/User.ts', () => require('../__mocks__/user'));

import mongoose from 'mongoose';
import { GeneralError } from '../../../types/error';
import { UserInfo } from '../../../types/user';
import { Either } from '../../../utils/either';
import signUp from './sign-up';
import User from '../models/User';

describe('test save', () => {
  const userTest: UserInfo = {
    id: new mongoose.Types.ObjectId(),
    email: 'sdsd@sds.fdf',
    firstName: 'ryan',
    lastName: 'pujo',
    username: 'ryanpujo',
  };

  it('should succes', async () => {
    jest
      .spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve(userTest));

    const either = await signUp({});

    expect(either).toBeInstanceOf(Either);
    const actual = either.fold(
      (l) => console.log(l),
      (r) => r
    );
    expect(actual).toEqual(userTest);
  });

  it('should failed', async () => {
    jest
      .spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => Promise.reject(new GeneralError('failed')));

    const either = await signUp({});
    expect(either).toBeInstanceOf(Either);
    const actual = either.fold(
      (l) => l,
      (r) => r
    );
    expect(actual).toBeInstanceOf(GeneralError);
    expect((actual as GeneralError).message).toEqual('failed');
  });
});
