import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import '../config/passport.js';
import passport from 'passport';
import { handleError } from '../middleware/error.js';
import { authRoutes } from './auth/routes/index.js';
import { connect } from '../config/db.js';
import { connectToRedis } from '../config/redisClient.js';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
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

app.use('/api', authRoutes);

app.use(handleError);

app.listen(3000, () => {
  connect();
  connectToRedis();
  console.log('server started');
});
