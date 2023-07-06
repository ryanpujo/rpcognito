/* eslint-disable @typescript-eslint/no-unused-vars */

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { GeneralError, DuplicateError, BadRequest } from '../../../types/error';
import { UserInfo } from '../../../types/user';
import User from '../models/User';
import { Either, Right, Left } from '../../../utils/either';

export default async (body: any): Promise<Either<GeneralError, UserInfo>> => {
  const newUser = new User(body);
  try {
    const created = await newUser.save();

    const user: UserInfo = {
      id: created.id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      username: created.username,
    };
    return new Right(user);
  } catch (error: any) {
    let err: GeneralError = new GeneralError(error.message);

    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        err = new DuplicateError(error.message, error.code);
      }
    } else if (error instanceof mongoose.Error.ValidationError) {
      err = new BadRequest(error.message);
    }

    return new Left(err);
  }
};