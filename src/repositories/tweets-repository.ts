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
    include: {
      attachments: true,
    },
  });

  const tweetsWithAttachments = tweets.map((tweet) => {
    const files_urls = tweet.attachments.map((attachment) => attachment.url);
    delete tweet.attachments;
    return { ...tweet, files_urls };
  });

  return tweetsWithAttachments;
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

async function postTweet({ content, author_id }: { content: string; author_id: number }) {
  const tweet = await prisma.post.create({
    data: {
      content,
      author_id,
    },
  });

  return tweet;
}

async function postAttachment({ post_id, url }: { post_id: number; url: string }) {
  const attachment = await prisma.attachment.create({
    data: {
      url,
      post_id,
    },
  });

  return attachment;
}

export const tweetRepository = {
  getFeed,
  countPages,
  postTweet,
  postAttachment,
};
