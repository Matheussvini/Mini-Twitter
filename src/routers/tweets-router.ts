import { Router } from 'express';
import { authValidation, validateParams } from '@/middlewares';
import { getTweets } from '@/controllers';
import { pageSchema } from '@/schemas';

const tweetsRouter = Router();

tweetsRouter.all('/*', authValidation).get('/:page', validateParams(pageSchema), getTweets);

export { tweetsRouter };
