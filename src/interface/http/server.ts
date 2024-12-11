/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import express from 'express';
import '@/config/container/index';
import userRoutes from './routes/UserRoutes';
import container from '@/config/container/index';
import { environment } from '@/config/Env';

const app = express();
const PORT = environment.port || 3000;

app.locals.container = container;

app.use(express.json());
app.use('/api', [userRoutes]);

async function start() {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();