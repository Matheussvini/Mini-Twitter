import 'reflect-metadata';
import 'express-async-errors';
import cors from 'cors';
import express, { Express } from 'express';
import { usersRouter } from './routers';
import { connectDb, disconnectDb, loadEnv } from '@/config';
import { handleApplicationErrors } from './middlewares';

loadEnv();

const app = express();
app.use(cors()).use(express.json()).use('/users', usersRouter).use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDb();
}

export default app;
