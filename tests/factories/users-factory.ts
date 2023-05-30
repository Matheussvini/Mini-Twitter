import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { prisma } from '@/config';
import { FollowUserParams } from '@/protocols';

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const incomingPassword = params.password || faker.internet.password({ length: 6 });
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hashedPassword,
      name: params.name || faker.person.fullName(),
      username: params.username || faker.internet.userName(),
    },
  });
}

export async function followUser({ following_user_id, followed_user_id }: FollowUserParams): Promise<void> {
  await prisma.follow.create({
    data: {
      following_user_id,
      followed_user_id,
    },
  });
}
