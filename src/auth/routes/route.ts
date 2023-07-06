import { Router } from 'express';
import { authController } from '../controllers';
import { body } from 'express-validator';
import { validateReq } from '../../../middleware/validation-error';
import passport from 'passport';

const route = Router();

const authenticate = passport.authenticate('jwt', { session: false });

route.post(
  '/api/users/',
  authenticate,
  [
    body('email').isEmail().withMessage('not a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('password minimum is 8 chars'),
  ],
  validateReq,
  authController.signUp
);

route.post('/api/auth/signin', authController.signIn);
route.get('/api/token', authController.getToken);

export default route;
