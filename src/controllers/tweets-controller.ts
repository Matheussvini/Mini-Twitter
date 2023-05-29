import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { tweetService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';
import { getTweetsParams } from '@/protocols';

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
