import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { createUser } from '../factories';
import { cleanDb } from '../helpers';
import { userService } from '@/services';
import { init } from '@/app';
import { conflictError, invalidCredentialsError, notFoundError } from '@/errors';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('userService', () => {
  describe('createUser', () => {
    it('should thorw conflictError if already there is a user with given email', async () => {
      const existingUser = await createUser();

      try {
        await userService.createUser({
          name: faker.person.fullName(),
          email: existingUser.email,
          username: faker.internet.userName(),
          password: faker.internet.password({ length: 6 }),
        });
        fail('should throw conflictError');
      } catch (error) {
        expect(error).toEqual(conflictError('Email already exists'));
      }
    });

    it('should thorw conflictError if already there is a user with given username', async () => {
      const existingUser = await createUser();

      try {
        await userService.createUser({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          username: existingUser.username,
          password: faker.internet.password({ length: 6 }),
        });
        fail('should throw conflictError');
      } catch (error) {
        expect(error).toEqual(conflictError('Username already exists'));
      }
    });

    it('should create a user when email and username are unique', async () => {
      const user = await createUser();

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

      expect(user).toEqual(
        expect.objectContaining({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          username: dbUser.username,
        }),
      );
    });

    it('should hash user password', async () => {
      const rawPassword = faker.internet.password({ length: 6 });

      const user = await userService.createUser({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: rawPassword,
      });

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

      expect(dbUser.password).not.toBe(rawPassword);
      expect(await bcrypt.compare(rawPassword, dbUser.password)).toBe(true);
    });
  });

  describe('login', () => {
    const generateParams = () => ({
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    });

    it('should throw invalidCredentialsError if email does not exist', async () => {
      const params = generateParams();
      try {
        await userService.login(params);
        fail('should throw invalidCredentialsError');
      } catch (error) {
        expect(error).toEqual(invalidCredentialsError('Invalid email or password'));
      }
    });

    it('should throw invalidCredentialsError if password is invalid', async () => {
      const user = await createUser();

      try {
        await userService.login({
          email: user.email,
          password: 'invalid-password',
        });
        fail('should throw invalidCredentialsError');
      } catch (error) {
        expect(error).toEqual(invalidCredentialsError('Invalid email or password'));
      }
    });

    describe('when email and password are valid', () => {
      it('should return user with token if email and password are correct', async () => {
        const rawPassword = faker.internet.password({ length: 6 });
        const user = await createUser({ password: rawPassword });

        const userWithToken = await userService.login({
          email: user.email,
          password: rawPassword,
        });

        expect(userWithToken).toEqual(
          expect.objectContaining({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: expect.any(String),
          }),
        );
      });

      it('should return a valid token', async () => {
        const rawPassword = faker.internet.password({ length: 6 });
        const user = await createUser({ password: rawPassword });

        const userWithToken = await userService.login({
          email: user.email,
          password: rawPassword,
        });

        const decodedToken = await jwt.verify(userWithToken.token, process.env.JWT_SECRET);

        expect(decodedToken).toEqual(
          expect.objectContaining({
            userId: user.id,
            iat: expect.any(Number),
            exp: expect.any(Number),
          }),
        );
      });
    });
  });

  async function checkFollow() {
    it('should throw conflictError if user tries to follow himself', async () => {
      const user = await createUser();

      try {
        await userService.followUser({ followed_user_id: user.id, following_user_id: user.id });
        fail('should throw conflictError');
      } catch (error) {
        expect(error).toEqual(conflictError('You cannot follow yourself'));
      }
    });

    it('should throw notFoundError if followed user does not exist', async () => {
      const user = await createUser();

      try {
        await userService.followUser({ following_user_id: user.id, followed_user_id: user.id + 1 });
        fail('should throw notFoundError');
      } catch (error) {
        expect(error).toEqual(notFoundError('User does not exist'));
      }
    });
  }

  describe('followUser', () => {
    checkFollow();

    it('should throw conflictError if user already follows another user', async () => {
      const user = await createUser();
      const followedUser = await createUser();

      try {
        await userService.followUser({ followed_user_id: followedUser.id, following_user_id: user.id });

        await userService.followUser({ followed_user_id: followedUser.id, following_user_id: user.id });
        fail('should throw conflictError');
      } catch (error) {
        expect(error).toEqual(conflictError('You already follow this user'));
      }
    });

    it('should follow user if user does not aleady follow this other user', async () => {
      const user = await createUser();
      const followedUser = await createUser();

      await userService.followUser({ followed_user_id: followedUser.id, following_user_id: user.id });

      const follow = await prisma.follow.findFirst({
        where: { followed_user_id: followedUser.id, following_user_id: user.id },
      });

      expect(follow).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          followed_user_id: followedUser.id,
          following_user_id: user.id,
        }),
      );
    });
  });

  describe('unfollowUser', () => {
    checkFollow();

    it('should throw conflictError if user does not follow the another user', async () => {
      const user = await createUser();
      const followedUser = await createUser();

      try {
        await userService.unfollowUser({ followed_user_id: followedUser.id, following_user_id: user.id });
        fail('should throw conflictError');
      } catch (error) {
        expect(error).toEqual(conflictError('You already do not follow this user'));
      }
    });

    it('should unfollow user if user follows this other user', async () => {
      const user = await createUser();
      const followedUser = await createUser();

      await userService.followUser({ followed_user_id: followedUser.id, following_user_id: user.id });

      await userService.unfollowUser({ followed_user_id: followedUser.id, following_user_id: user.id });

      const follow = await prisma.follow.findFirst({
        where: { followed_user_id: followedUser.id, following_user_id: user.id },
      });

      expect(follow).toBeNull();
    });
  });
});
