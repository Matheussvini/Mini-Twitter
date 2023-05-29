import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '@/services';
import { LoginInput } from '@/schemas';
import { AuthenticatedRequest } from '@/middlewares';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
  const { name, username, email, password } = req.body;

  try {
    await userService.createUser({ name, username, email, password });
    return res.status(httpStatus.CREATED).send({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<Response> {
  const { email, password } = req.body as LoginInput;

  try {
    const user = await userService.login({ email, password });
    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    next(error);
  }
}

export async function followUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const userId = req.user.id;
  const paramsId = req.params.id;

  try {
    await userService.followUser({ following_user_id: userId, followed_user_id: Number(paramsId) });
    return res.status(httpStatus.OK).send({ message: 'User followed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const userId = req.user.id;
  const paramsId = req.params.id;

  try {
    await userService.unfollowUser({ following_user_id: userId, followed_user_id: Number(paramsId) });
    return res.status(httpStatus.OK).send({ message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
}
