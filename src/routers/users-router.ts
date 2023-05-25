import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createUserSchema } from '@/schemas';
import { createUser } from '@/controllers';

const usersRouter = Router();

usersRouter.post('/signup', validateBody(createUserSchema), createUser);

export { usersRouter };
