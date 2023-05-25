import Joi from 'joi';
import { User } from '@prisma/client';

export const createUserSchema = Joi.object<CreateUserInput>({
  name: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export type CreateUserInput = Omit<User, 'id'>;
