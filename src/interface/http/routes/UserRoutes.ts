/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import { injectController } from '@/interface/http/middlewares/InjectController';
import { UserController } from '@/interface/http/controllers/UserController';

const userRoutes = Router();

userRoutes.post('/user', injectController(UserController, 'create'));

export default userRoutes;