import { Request, Response } from 'express';
import { TOKEN_ID, redisClient } from '../../../config/redisClient';

export default async (req: Request, res: Response) => {
  const username = req.cookies.username;
  if (!username) {
    return res.status(401).send('unauthorized');
  }
  const token = await redisClient.get(`${TOKEN_ID}:${username}`);
  res.status(200).json({ token });
};
