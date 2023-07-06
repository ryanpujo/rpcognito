import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { handleError } from '../middleware/error';
import { connect } from '../config/db';
import { authRoutes } from './auth/routes';
import passport from 'passport';
import './../config/passport';
import { connectToRedis } from '../config/redisClient';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/hello', (req: Request, res: Response) => {
  res.send('hello world');
});

app.use(authRoutes);

app.use(handleError);

app.listen(3000, () => {
  connect();
  connectToRedis();
  console.log('server started');
});
