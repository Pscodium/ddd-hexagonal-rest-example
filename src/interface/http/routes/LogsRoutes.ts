/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import { injectController } from '@/interface/http/middlewares/InjectController';

const logsRoutes = Router();

logsRoutes.get('/logs/get', injectController('logsController', 'get'));
logsRoutes.get('/logs/get/format', injectController('logsController','getWithFormat'));

export default logsRoutes;