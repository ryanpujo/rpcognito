import mongoose from 'mongoose';
import { MONGO_URI } from './config.utils.js';

export const connect = () => {
  let isConnected = false;
  for (let i = 0; i < 2; i++) {
    setTimeout(async () => {
      try {
        console.log(process.env.MONGO_URI);

        await mongoose.connect(`${MONGO_URI}`, {
          dbName: 'mydatabase',
        });
        console.log('connected to mongo');
        isConnected = true;
      } catch (error) {
        console.log(error);
      }
    }, 3000);
    if (isConnected) {
      console.log('break out');
      break;
    }
  }
};
