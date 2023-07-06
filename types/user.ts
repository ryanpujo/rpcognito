import mongoose from 'mongoose';

export interface UserInfo {
  id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}
