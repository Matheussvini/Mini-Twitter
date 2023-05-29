import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { tweetService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';
import { getTweetsParams } from '@/protocols';
import { TweetInput } from '@/schemas';

export async function getTweets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const { user } = req;
  const { page } = req.params as Record<string, string>;

  try {
    const tweets = await tweetService.getTweetsForFeed({ page: Number(page), userId: user.id } as getTweetsParams);
    return res.status(httpStatus.OK).send(tweets);
  } catch (error) {
    next(error);
  }
}
interface MulterFileWithLocation extends Express.Multer.File {
  location: string;
  key: string;
}

export async function uploadFile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { location, key } = req.file as MulterFileWithLocation;
  let url = '';
  if (location) url = location;
  else {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = req.file.filename;
    url = `${baseUrl}/uploads/${relativePath}`;
  }

  try {
    return res.status(httpStatus.CREATED).send({ message: 'Imagem enviada com sucesso!', url, key });
  } catch (error) {
    next(error);
  }
}

export async function postTweet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { user } = req;
  const { content, files_urls } = req.body as TweetInput;

  try {
    await tweetService.createTweet({ content, files_urls, author_id: user.id });
    return res.status(httpStatus.CREATED).send({ message: 'Tweet created sucessfully!' });
  } catch (error) {
    next(error);
  }
}
