import 'reflect-metadata';
import 'express-async-errors';
import path from 'path';
import cors from 'cors';
import express, { Express } from 'express';
import { tweetsRouter, usersRouter } from './routers';
import { handleApplicationErrors } from './middlewares';
import { connectDb, disconnectDb, loadEnv } from '@/config';

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use('/users', usersRouter)
  .use('/tweets', tweetsRouter)
  .use('/uploads', express.static(path.resolve(process.cwd(), 'tmp', 'uploads')))
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDb();
}

export default app;
