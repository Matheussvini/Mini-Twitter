import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { conflictError, invalidCredentialsError } from '@/errors';
import { CreateUserInput, LoginInput } from '@/schemas';
import { userRepository } from '@/repositories';

async function validateUniqueUserData({ username, email }: Pick<User, 'username' | 'email'>) {
  const checkUsername = await userRepository.findByUsername(username);
  if (checkUsername) throw conflictError('Username already exists');

  const checkEmail = await userRepository.findByEmail(email);
  if (checkEmail) throw conflictError('Email already exists');
}

async function createUser({ name, username, email, password }: CreateUserInput): Promise<void> {
  await validateUniqueUserData({ username, email });

  const hashedPassword = await bcrypt.hash(password, 12);

  await userRepository.create({ name, username, email, password: hashedPassword });
}

async function login({ email, password }: LoginInput): Promise<UserWithToken> {
  const user = await userRepository.findByEmail(email);
  if (!user) throw invalidCredentialsError('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw invalidCredentialsError('Invalid email or password');

  const data = { user_id: user.id };
  const token = jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  delete user.password;

  return { ...user, token };
}

export type UserWithToken = Omit<User, 'password'> & { token: string };

export const userService = {
  createUser,
  login,
};
