import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

export function handleApplicationErrors(
  err: ApplicationError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.name === 'ConflictError') {
    return res.status(httpStatus.CONFLICT).send({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: err.message });
  }

  if (err.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send({ message: err.message });
  }

  if (err.name === 'InvalidCredentialsError') {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: err.message });
  }

  if (err.name === 'UnprocessableEntityError') {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ message: err.message });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'Internal Server Error',
    message: err.message,
  });
}
