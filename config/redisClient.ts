import { RedisClientType, createClient } from 'redis';

export let redis: RedisClientType;

export const connectToRedis = async () => {
  redis = createClient({ url: 'redis://redis:6379' });
  redis.on('connect', () => {
    console.log('connected to redis');
  });
  await redis.connect();
};

export const TOKEN_ID = 'TOKEN';

const setEx = async (key: string, value: string) => {
  return await redis.setEx(`${TOKEN_ID}:${key}`, 600, value);
};

const get = async (key: string) => {
  return await redis.get(`${TOKEN_ID}:${key}`);
};

const del = async (key: string) => {
  return await redis.del(`${TOKEN_ID}:${key}`);
};
export const redisClient = {
  setEx,
  get,
  del,
};
