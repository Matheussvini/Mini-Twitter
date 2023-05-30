import { faker } from '@faker-js/faker';
import { createUserSchema, followSchema, loginSchema } from '@/schemas';

describe('UserSchemas', () => {
  describe('createUserSchema', () => {
    const generateValidInput = () => ({
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    });

    describe('when email is invalid', () => {
      it('should return an error if email is not present', async () => {
        const input = generateValidInput();
        delete input.email;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if email is not a valid email format', async () => {
        const input = generateValidInput();
        input.email = faker.lorem.word();

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe('when password is invalid', () => {
      it('should return an error if password is not present', async () => {
        const input = generateValidInput();
        delete input.password;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if password is shorter than 6 characters', async () => {
        const input = generateValidInput();
        input.password = faker.lorem.word(5);

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe('when username is invalid', () => {
      it('should return an error if username is not present', async () => {
        const input = generateValidInput();
        delete input.username;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if username is not a valid username format', async () => {
        const input = generateValidInput();
        input.username = faker.number.int() as any;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe('when name is invalid', () => {
      it('should return an error if name is not present', async () => {
        const input = generateValidInput();
        delete input.name;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if name is not a valid name format', async () => {
        const input = generateValidInput();
        input.name = faker.number.int() as any;

        const { error } = createUserSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    it('should return no error if input is valid', async () => {
      const input = generateValidInput();

      const { error } = createUserSchema.validate(input);

      expect(error).toBeFalsy();
    });
  });

  describe('loginSchema', () => {
    const generateValidInput = () => ({
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    });

    describe('when email is invalid', () => {
      it('should return an error if email is not present', async () => {
        const input = generateValidInput();
        delete input.email;

        const { error } = loginSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if email is not a valid email format', async () => {
        const input = generateValidInput();
        input.email = faker.lorem.word();

        const { error } = loginSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe('when password is invalid', () => {
      it('should return an error if password is not present', async () => {
        const input = generateValidInput();
        delete input.password;

        const { error } = loginSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return an error if password is shorter than 6 characters', async () => {
        const input = generateValidInput();
        input.password = faker.lorem.word(5);

        const { error } = loginSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    it('should return no error if input is valid', async () => {
      const input = generateValidInput();

      const { error } = loginSchema.validate(input);

      expect(error).toBeFalsy();
    });
  });

  describe('followUserSchema', () => {
    it('should return an error if id is not present', async () => {
      const { error } = followSchema.validate({});

      expect(error).toBeDefined();
    });

    it('should return an error if id is not a valid id format', async () => {
      const { error } = followSchema.validate({ id: faker.lorem.word() });

      expect(error).toBeDefined();
    });

    it('should return no error if input is valid', async () => {
      const { error } = followSchema.validate({ id: faker.number.int() });

      expect(error).toBeFalsy();
    });
  });
});
