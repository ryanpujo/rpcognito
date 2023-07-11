import mongoose from 'mongoose';
import Sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import { BadRequest } from '../../../types/error.js';
import { UserInfo } from '../../../types/user.js';
import { Right, Left } from '../../../utils/either.js';
import { authService } from '../services/index.js';
import signUp from './sign-up.js';

describe('sign up handler', () => {
  const userTest: UserInfo = {
    id: new mongoose.Types.ObjectId(),
    email: 'fkdfk@dkfd.dfd',
    firstName: 'ryan',
    lastName: 'pujo',
    username: 'ryanpujo',
  };
  it('should return user obj', async () => {
    import.meta.jest
      .spyOn(authService, 'signUp')
      .mockImplementationOnce(async () => new Right(userTest));
    const req = mockReq();
    const res = mockRes();
    const next = Sinon.spy();

    await signUp(req, res, next);

    expect(res.status.calledWith(201)).toBe(true);
    expect(res.json.calledWith(userTest)).toBe(true);
    expect(next.neverCalledWith()).toBe(true);
  });

  it('should recieve an erro', async () => {
    const badReq = new BadRequest('an error');
    import.meta.jest
      .spyOn(authService, 'signUp')
      .mockImplementationOnce(async () => new Left(badReq));

    const req = mockReq();
    const res = mockRes();
    const next = Sinon.spy();

    await signUp(req, res, next);

    expect(next.calledWith(badReq)).toBe(true);
  });
});
