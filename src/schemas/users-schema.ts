import Joi from 'joi';
import { User } from '@prisma/client';

export const createUserSchema = Joi.object<CreateUserInput>({
  name: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object<LoginInput>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const followSchema = Joi.object<FollowInput>({
  id: Joi.number().required(),
});

export type FollowInput = {
  id: number;
};

export type CreateUserInput = Omit<User, 'id'>;

export type LoginInput = Pick<User, 'email' | 'password'>;
