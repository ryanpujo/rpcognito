import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import User from '../src/auth/models/User';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_KEY } from './config.utils';

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
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub })
      .then((user) => {
        if (user) {
          return done(null, {
            email: user.email,
            id: user.id,
            username: user.username,
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
  })
);
