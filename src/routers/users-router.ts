import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createUserSchema, loginSchema } from '@/schemas';
import { createUser, login } from '@/controllers';

const usersRouter = Router();

usersRouter
  .post('/signup', validateBody(createUserSchema), createUser)
  .post('/login', validateBody(loginSchema), login);

export { usersRouter };
