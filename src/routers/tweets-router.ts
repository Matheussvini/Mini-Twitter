import { Router } from 'express';
import multer from 'multer';
import { authValidation, validateParams } from '@/middlewares';
import { getTweets, uploadFile } from '@/controllers';
import { pageSchema } from '@/schemas';
import { multerConfig } from '@/config';

const tweetsRouter = Router();

tweetsRouter
  .all('/*', authValidation)
  .get('/:page', validateParams(pageSchema), getTweets)
  .post('/upload', multer(multerConfig).single('file'), uploadFile);

export { tweetsRouter };
