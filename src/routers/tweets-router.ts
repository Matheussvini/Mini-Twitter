import { Router } from 'express';
import multer from 'multer';
import { authValidation, validateBody, validateParams } from '@/middlewares';
import { getTweets, uploadFile, postTweet } from '@/controllers';
import { pageSchema, tweetSchema } from '@/schemas';
import { multerConfig } from '@/config';

const tweetsRouter = Router();

tweetsRouter
  .all('/*', authValidation)
  .get('/:page', validateParams(pageSchema), getTweets)
  .post('/upload', multer(multerConfig).single('file'), uploadFile)
  .post('/', validateBody(tweetSchema), postTweet);

export { tweetsRouter };
