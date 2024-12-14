/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import express from 'express';
import '@/config/container/index';
import userRoutes from './routes/UserRoutes';
import logsRoutes from './routes/LogsRoutes';

import container from '@/config/container/index';
import { environment } from '@/config/Environment';

const app = express();
const PORT = environment.port || 3000;

app.locals.container = container;

app.use(express.json());
app.use('/api', [userRoutes, logsRoutes]);

async function start() {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();