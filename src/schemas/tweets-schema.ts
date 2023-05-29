import Joi from 'joi';

export const pageSchema = Joi.object<PageInput>({
  page: Joi.number().min(1).required(),
});

export type PageInput = {
  page: number;
};
