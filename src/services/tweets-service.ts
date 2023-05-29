import { getTweetsParams } from '@/protocols';
import { tweetRepository } from '@/repositories';
import { TweetInput } from '@/schemas';

export type createTweetParams = TweetInput & { author_id: number };

async function getTweetsForFeed({ page, userId }: getTweetsParams) {
  const tweets = await tweetRepository.getFeed({ page, userId });
  const totalPages = await tweetRepository.countPages(userId);

  return { totalPages, tweets };
}

async function createTweet({ content, files_urls, author_id }: createTweetParams) {
  const post = await tweetRepository.postTweet({ content, author_id });

  if (files_urls) {
    files_urls.map(async (file) => {
      await tweetRepository.postAttachment({ post_id: post.id, url: file });
    });
  }
}

export const tweetService = {
  getTweetsForFeed,
  createTweet,
};
