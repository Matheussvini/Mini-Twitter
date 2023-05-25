import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '@/services';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
  const { name, username, email, password } = req.body;

  try {
    await userService.createUser({ name, username, email, password });
    return res.status(httpStatus.CREATED).send({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
}
