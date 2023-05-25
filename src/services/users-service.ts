import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { conflictError } from '@/errors';
import { CreateUserInput } from '@/schemas';
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

export const userService = {
  createUser,
};
