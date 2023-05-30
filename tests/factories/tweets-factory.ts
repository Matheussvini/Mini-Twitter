import { faker } from '@faker-js/faker';
import { Attachment, Post } from '@prisma/client';
import { prisma } from '@/config';

export async function createTweet(params: Partial<Post> = {}) {
  return prisma.post.create({
    data: {
      content: params.content || faker.lorem.paragraph(),
      author_id: params.author_id,
    },
  });
}

export async function createAttachment(params: Partial<Attachment> = {}) {
  return prisma.attachment.create({
    data: {
      post_id: params.post_id,
      url: params.url || faker.image.url(),
    },
  });
}
