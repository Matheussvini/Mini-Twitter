import { tweetService } from '@/services';
import { tweetRepository } from '@/repositories';

describe('tweetService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTweetsForFeed', () => {
    it('should return tweets for feed', async () => {
      const userId = 1;
      const page = 1;
      const mockTweets = [
        {
          id: 1,
          content: 'Tweet 1',
          author_id: 1,
          createdAt: new Date(),
          files_urls: ['https://example.com/image.png'],
        },
      ];

      const mockTotalPages = 1;

      jest.spyOn(tweetRepository, 'getFeed').mockResolvedValue(mockTweets as any);
      jest.spyOn(tweetRepository, 'countPages').mockResolvedValue(mockTotalPages);

      const result = await tweetService.getTweetsForFeed({ userId, page });

      expect(result.tweets).toEqual(mockTweets);
      expect(result.totalPages).toEqual(mockTotalPages);

      expect(tweetRepository.getFeed).toHaveBeenCalledWith({ userId, page });
      expect(tweetRepository.countPages).toHaveBeenCalledWith(userId);
    });
  });

  describe('createTweet', () => {
    it('should create tweet without files urls', async () => {
      const mockTweetInput = {
        content: 'Tweet 1',
        author_id: 1,
      };

      jest.spyOn(tweetRepository, 'postTweet').mockResolvedValue(mockTweetInput as any);
      jest.spyOn(tweetRepository, 'postAttachment').mockResolvedValue({} as any);

      const params = { content: 'Tweet 1', author_id: 1 };

      await tweetService.createTweet(params);

      expect(tweetRepository.postTweet).toHaveBeenCalledWith(params);
      expect(tweetRepository.postAttachment).not.toHaveBeenCalled();
    });

    it('should create tweet with files urls', async () => {
      const mockTweetInput = {
        content: 'Tweet 1',
        author_id: 1,
        files_urls: ['https://example.com/image.png'],
      };

      jest.spyOn(tweetRepository, 'postTweet').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(tweetRepository, 'postAttachment').mockResolvedValue({} as any);

      await tweetService.createTweet(mockTweetInput);

      const expectedTweetWithoutUrls = {
        content: 'Tweet 1',
        author_id: 1,
      };

      expect(tweetRepository.postTweet).toHaveBeenCalledWith(expectedTweetWithoutUrls);
      expect(tweetRepository.postAttachment).toHaveBeenCalledWith({
        post_id: 1,
        url: mockTweetInput.files_urls[0],
      });
    });
  });
});
