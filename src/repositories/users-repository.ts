import { prisma } from '@/config';
import { FollowUserParams } from '@/protocols';
import { CreateUserInput } from '@/schemas';

async function findByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

async function findByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}

async function findById(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

async function create(data: CreateUserInput) {
  return await prisma.user.create({ data });
}

async function checkIfUserAlreadyFollowed({ following_user_id, followed_user_id }: FollowUserParams) {
  return await prisma.follow.findFirst({
    where: { following_user_id, followed_user_id },
  });
}

async function followUser({ following_user_id, followed_user_id }: FollowUserParams) {
  await prisma.follow.create({
    data: { following_user_id, followed_user_id },
  });
}

async function unfollowUser(id: number) {
  await prisma.follow.delete({
    where: { id },
  });
}

export const userRepository = {
  findByEmail,
  findByUsername,
  findById,
  create,
  checkIfUserAlreadyFollowed,
  followUser,
  unfollowUser,
};
