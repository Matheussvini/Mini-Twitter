import Joi from 'joi';

export const pageSchema = Joi.object<PageInput>({
  page: Joi.number().min(1).required(),
});

export type PageInput = {
  page: number;
};

export const tweetSchema = Joi.object<TweetInput>({
  content: Joi.string().max(280).required(),
  files_urls: Joi.array().items(Joi.string().uri()),
});

export type TweetInput = {
  content: string;
  files_urls?: string[];
};
