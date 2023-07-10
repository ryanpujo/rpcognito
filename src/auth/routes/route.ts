import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { validateReq } from '../../../middleware/validation-error.js';
import { authController } from '../controllers/index.js';

const route = Router();

const authenticate = passport.authenticate('jwt', { session: false });

route.post(
  '/users',
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

route.post('/signin', authController.signIn);
route.get('/signout', authenticate, authController.signOut);
route.get('/token', authController.getToken);

export default route;
