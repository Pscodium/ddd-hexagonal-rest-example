/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import { injectController } from '@/interface/http/middlewares/InjectController';

const userRoutes = Router();

userRoutes.post('/register', injectController('userController', 'create'));
userRoutes.get('/user/:id', injectController('userController', 'findOne'));

export default userRoutes;