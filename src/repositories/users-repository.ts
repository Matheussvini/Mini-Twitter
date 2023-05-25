import { prisma } from '@/config';
import { CreateUserInput } from '@/schemas';

async function findByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

async function findByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}

async function create(data: CreateUserInput) {
  return await prisma.user.create({ data });
}

export const userRepository = {
  findByEmail,
  findByUsername,
  create,
};
