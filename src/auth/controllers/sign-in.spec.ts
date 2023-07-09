// import mongoose, { model } from 'mongoose';
// import User, { UserDocument, comparePassword } from '../models/User';
// import Sinon from 'sinon';
// import { mockReq, mockRes } from 'sinon-express-mock';
// import signIn from './sign-in';
// import { authService } from '../services';

// describe('sign in', () => {
//   const userTest = {
//     id: new mongoose.Types.ObjectId(),
//     email: 'fkdfk@dkfd.dfd',
//     firstName: 'ryan',
//     lastName: 'pujo',
//     username: 'ryanpujo',
//     password: 'lsdklsmmekmeefdk',
//     comparePassword: comparePassword,
//   };
//   const req = mockReq();
//   const res = mockRes();
//   const next = jest.fn();
//   it('should send an access token', async () => {
//     jest.spyOn(model('User'), 'findOne').mockResolvedValueOnce(userTest);
//     jest.spyOn(authService, 'generateToken').mockResolvedValueOnce('skjdsjd');
//     const callback = jest.fn();
//     await signIn(req, res, next);
//     jest.setTimeout(2000);
//     expect(res.status.calledWith(200)).toBe(true);
//   });
// });
