import { Router } from 'express';
import signUpRoute from './route';

export const authRoutes = Router();

authRoutes.use(signUpRoute);
