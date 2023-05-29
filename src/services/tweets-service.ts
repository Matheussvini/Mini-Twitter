import { getTweetsParams } from '@/protocols';
import { tweetRepository } from '@/repositories';

async function getTweetsForFeed({ page, userId }: getTweetsParams) {
  const tweets = await tweetRepository.getFeed({ page, userId });
  const totalPages = await tweetRepository.countPages(userId);

  return { tweets, totalPages };
}

export const tweetService = {
  getTweetsForFeed,
};
