import { RedisClientType, createClient } from 'redis';

export let redisClient: RedisClientType;

export const connectToRedis = async () => {
  redisClient = createClient({ url: 'redis://redis:6379' });
  redisClient.on('connect', () => {
    console.log('connected to redis');
  });
  await redisClient.connect();
};

export const TOKEN_ID = 'TOKEN';
