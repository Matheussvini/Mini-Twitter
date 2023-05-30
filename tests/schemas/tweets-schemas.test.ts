import { faker } from '@faker-js/faker';
import { tweetSchema } from '@/schemas';

describe('tweetSchema', () => {
  const generateValidInput = () => ({
    content: faker.lorem.words(5),
    files_urls: [faker.image.url()],
  });

  describe('when content is invalid', () => {
    it('should return an error if content is not present', async () => {
      const input = generateValidInput();
      delete input.content;

      const { error } = tweetSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return an error if content is not a valid content format', async () => {
      const input = generateValidInput();
      input.content = faker.number.int() as any;

      const { error } = tweetSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('when contains files_urls is invalid', () => {
    it('should return an error if files_urls is not a valid url', async () => {
      const input = generateValidInput();
      input.files_urls = [faker.number.int()] as any;

      const { error } = tweetSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it('should return no error if input is valid', async () => {
    const input = generateValidInput();

    const { error } = tweetSchema.validate(input);

    expect(error).toBeFalsy();
  });
});
