import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createUser } from './factories';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';

export async function cleanDb() {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.attachment.deleteMany();
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  return token;
}

export async function generateInvalidToken() {
  const token = jwt.sign({ userId: faker.number.bigInt }, process.env.JWT_SECRET);

  return token;
}
