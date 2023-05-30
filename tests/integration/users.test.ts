import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { generateInvalidToken } from '../helpers';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('UsersRouter /users', () => {
  describe('POST /signup', () => {
    it('should responde with status 400 if body is not given', async () => {
      const response = await server.post('/users/signup');

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should responde with status 400 if body is not valid', async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post('/users/signup').send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when body is valid', () => {
      const generateValidBody = {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      it('should responde with status 409 when email or username is already in use', async () => {
        const user = await createUser();

        const body = {
          name: faker.person.fullName(),
          username: user.username,
          email: user.email,
          password: faker.internet.password(),
        };

        const response = await server.post('/users/signup').send(body);

        expect(response.status).toBe(httpStatus.CONFLICT);
      });

      it('should responde with status 201 and create user when given email and username are unique', async () => {
        const body = generateValidBody;

        const response = await server.post('/users/signup').send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({ message: 'User created successfully' });
      });
    });
  });

  describe('POST /login', () => {
    it('should responde with status 400 if body is not given', async () => {
      const response = await server.post('/users/login');

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should responde with status 400 if body is not valid', async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post('/users/login').send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when body is valid', () => {
      const generateValidBody = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      it('should responde with status 401 when user is not found', async () => {
        const body = generateValidBody;

        const response = await server.post('/users/login').send(body);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
      });

      it('should responde with status 401 when password is incorrect', async () => {
        const user = await createUser();

        const body = {
          email: user.email,
          password: faker.internet.password(),
        };

        const response = await server.post('/users/login').send(body);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
      });

      it('should responde with status 200 and user when credentials are correct', async () => {
        const rawPassword = faker.internet.password();
        const user = await createUser({ password: rawPassword });

        const body = {
          email: user.email,
          password: rawPassword,
        };

        const response = await server.post('/users/login').send(body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
          }),
        );
      });
    });
  });

  describe('POST /:id/follow', () => {
    it('should responde with status 401 when user is not authenticated', async () => {
      await createUser();
      const response = await server.post('/users/follow/1');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should responde with status 401 if token is missing', async () => {
      await createUser();
      const anotherUser = await createUser();

      const response = await server.post(`/users/follow/${anotherUser.id}`).set('Authorization', '');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should responde with status 401 when if user not found by invalid token', async () => {
      await createUser();
      const anotherUser = await createUser();
      const invalidToken = await generateInvalidToken();

      const response = await server
        .post(`/users/follow/${anotherUser.id}`)
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should responde with status 404 when followed user is not found', async () => {
      const token = await generateValidToken();

      const response = await server.post('/users/follow/3').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toEqual({ message: 'User does not exist' });
    });

    it('should responde with status 200 and follow user', async () => {
      const user = await createUser();
      const userToFollow = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post(`/users/follow/${userToFollow.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ message: 'User followed successfully' });
    });
  });

  describe('DELETE /:id/unfollow', () => {
    it('should responde with status 401 when user is not authenticated', async () => {
      await createUser();
      const response = await server.delete('/users/unfollow/1');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should responde with status 404 when unfollowed user is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete('/users/unfollow/3').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toEqual({ message: 'User does not exist' });
    });

    it('should responde with status 200 and unfollow user', async () => {
      const user = await createUser();
      const userToUnfollow = await createUser();
      const token = await generateValidToken(user);

      await server.post(`/users/follow/${userToUnfollow.id}`).set('Authorization', `Bearer ${token}`);

      const response = await server
        .delete(`/users/unfollow/${userToUnfollow.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ message: 'User unfollowed successfully' });
    });
  });
});
