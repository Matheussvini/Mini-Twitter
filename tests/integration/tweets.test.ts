import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser, followUser } from '../factories';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('TweetsRouter /tweets', () => {
  describe('GET /:page', () => {
    it('should return 401 if token is not provided', async () => {
      const response = await server.get('/tweets/1');

      expect(response.status).toEqual(401);
    });

    it('should return 400 if page is not a number', async () => {
      const token = await generateValidToken();
      const response = await server.get('/tweets/invalid').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(400);
    });

    it('should return 200 and an empty array if there are no tweets', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const followedUser = await createUser();
      await followUser({ following_user_id: user.id, followed_user_id: followedUser.id });
      const response = await server.get('/tweets/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        totalPages: 0,
        tweets: [],
      });
    });

    it('should return 200 and tweets with files urls', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const followedUser = await createUser();
      await followUser({ following_user_id: user.id, followed_user_id: followedUser.id });

      const post = await prisma.post.create({ data: { content: faker.lorem.paragraph(), author_id: followedUser.id } });
      const attachment = await prisma.attachment.create({ data: { post_id: post.id, url: faker.image.url() } });

      const response = await server.get('/tweets/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        totalPages: 1,
        tweets: [
          {
            id: post.id,
            content: post.content,
            author_id: post.author_id,
            createdAt: post.createdAt.toISOString(),
            files_urls: [attachment.url],
          },
        ],
      });
    });
  });

  describe('POST /', () => {
    it('should return 401 if token is not provided', async () => {
      const response = await server.post('/tweets');

      expect(response.status).toEqual(401);
    });

    it('should return 400 if content is not provided', async () => {
      const token = await generateValidToken();
      const response = await server.post('/tweets').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(400);
    });

    it('should return 201 and the created tweet', async () => {
      const token = await generateValidToken();
      const content = faker.lorem.paragraph();
      const response = await server.post('/tweets').send({ content }).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ message: 'Tweet created sucessfully!' });
    });

    it('should return 201 and the created tweet with files urls', async () => {
      const token = await generateValidToken();
      const content = faker.lorem.paragraph();
      const files_urls = [faker.image.url()];
      const response = await server
        .post('/tweets')
        .send({ content, files_urls })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({ message: 'Tweet created sucessfully!' });
    });
  });
});
