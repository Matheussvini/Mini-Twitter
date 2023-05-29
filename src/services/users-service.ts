import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { conflictError, invalidCredentialsError } from '@/errors';
import { CreateUserInput, LoginInput } from '@/schemas';
import { userRepository } from '@/repositories';
import { FollowUserParams } from '@/protocols';

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

  const data = { userId: user.id };
  const token = jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  delete user.password;

  return { ...user, token };
}

async function checkFollow({ following_user_id, followed_user_id }: FollowUserParams) {
  if (following_user_id === followed_user_id) throw conflictError('You cannot follow yourself');

  return await userRepository.checkIfUserAlreadyFollowed({
    following_user_id,
    followed_user_id,
  });
}

async function followUser({ following_user_id, followed_user_id }: FollowUserParams): Promise<void> {
  const follow = await checkFollow({ following_user_id, followed_user_id });
  if (follow) throw conflictError('You already follow this user');

  await userRepository.followUser({ following_user_id, followed_user_id });
}

async function unfollowUser({ following_user_id, followed_user_id }: FollowUserParams) {
  const follow = await checkFollow({ following_user_id, followed_user_id });
  if (!follow) throw conflictError('You already do not follow this user');

  await userRepository.unfollowUser(follow.id);
}

export type UserWithToken = Omit<User, 'password'> & { token: string };

export const userService = {
  createUser,
  login,
  followUser,
  unfollowUser,
};
