import mongoose from 'mongoose';
import { MONGO_URI } from './config.utils.js';

export const connect = async () => {
  await mongoose.connect(`${MONGO_URI}`, {
    dbName: 'mydatabase',
  });
  console.log('connected to mongo');
};
