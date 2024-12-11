/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import express from 'express';
import '@/config/Container';
import userRoutes from './routes/UserRoutes';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/api', userRoutes);

async function start() {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();