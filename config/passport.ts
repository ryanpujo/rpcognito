import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { verify } from 'jsonwebtoken';
import User from '../src/auth/models/User.js';
import { signOpts } from '../src/auth/services/sign-in.js';
import { Unauthorized } from '../types/error.js';
import { JWT_KEY, JWT_AUDIENCE, JWT_ISSUER } from './config.utils.js';
import { redisClient } from './redisClient.js';

const JwtStrategy = Strategy;
const currentTime = new Date().getTime();

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `${JWT_KEY}`,
  jsonWebTokenOptions: {
    maxAge: new Date(currentTime + 10 * 60000).getTime(),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  },
};

passport.use(
  new JwtStrategy(opts, async function (payload, done) {
    const jwtToken = await redisClient.get(`${payload.idToken}`);
    if (!jwtToken) {
      const unauthorized = new Unauthorized();
      return done(unauthorized, false);
    }
    try {
      const jwt_payload = verify(jwtToken, `${JWT_KEY}`, signOpts);
      User.findOne({ id: jwt_payload?.sub })
        .then((user) => {
          if (user) {
            return done(null, {
              id: user.id,
            });
          } else {
            return done(null, false);
            // or you could create a new account
          }
        })
        .catch((err) => {
          if (err) {
            return done(err, false);
          }
        });
    } catch (error) {
      return done(error, false);
    }
  })
);
