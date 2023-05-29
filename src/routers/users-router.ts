import { Router } from 'express';
import { authValidation, validateBody, validateParams } from '@/middlewares';
import { createUserSchema, followSchema, loginSchema } from '@/schemas';
import { createUser, login, followUser, unfollowUser } from '@/controllers';

const usersRouter = Router();

usersRouter
  .post('/signup', validateBody(createUserSchema), createUser)
  .post('/login', validateBody(loginSchema), login)
  .all('/*', authValidation)
  .post('/follow/:id', validateParams(followSchema), followUser)
  .delete('/unfollow/:id', validateParams(followSchema), unfollowUser);

export { usersRouter };
