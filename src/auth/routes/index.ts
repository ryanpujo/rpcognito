import { Router } from 'express';
import signUpRoute from './route.js';

export const authRoutes = Router();

authRoutes.use('/auth', signUpRoute);
