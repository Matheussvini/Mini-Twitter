import { prisma } from '@/config';
import { getTweetsParams } from '@/protocols';

const pageSize = 10;

async function getFeed({ page, userId }: getTweetsParams) {
  const skip = (page - 1) * pageSize;

  const tweets = await prisma.post.findMany({
    take: pageSize,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      author: {
        followers: {
          some: {
            followingUser: {
              id: userId,
            },
          },
        },
        NOT: {
          id: userId,
        },
      },
    },
  });
  return tweets;
}

async function countPages(userId: number) {
  const total = await prisma.post.count({
    where: {
      author: {
        followers: {
          some: {
            followingUser: {
              id: userId,
            },
          },
        },
        NOT: {
          id: userId,
        },
      },
    },
  });
  return Math.ceil(total / pageSize);
}

export const tweetRepository = {
  getFeed,
  countPages,
};
