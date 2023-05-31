export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Mini-Twitter API Documentation',
    description:
      'In this documentation you will be able to consult the API end-points and also test all available routes. Do not forget to register and carry out the authentication.',
    contact: {
      email: 'matheussvini@outlook.com',
      linkedin: 'https://www.linkedin.com/in/mvsd/',
    },
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://mini-twitter-api.onrender.com',
      description: 'Render Server',
    },
    {
      url: 'http://localhost:4000',
      description: 'Local Server',
    },
  ],
  paths: {
    '/users/signup': {
      post: {
        summary: 'Register a new user',
        description: 'Route responsible for creating a new user in the database.',
        tags: ['Users'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
              examples: {
                Users: {
                  value: {
                    name: 'Matheus Vinicius',
                    username: 'matheussvini',
                    email: 'matheus@gmail.com',
                    password: '123456',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '409': {
            description: 'Username or email already exists',
          },
        },
      },
    },
    '/users/login': {
      post: {
        summary: 'Login to mini-twitter',
        description: 'Route responsible for logging in a registered user.',
        tags: ['Users'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
              examples: {
                Users: {
                  value: {
                    email: 'matheus@gmail.com',
                    password: '123456',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User authenticated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '401': {
            description: 'Invalid email or password',
          },
        },
      },
    },
    '/users/follow/{id}': {
      post: {
        summary: 'Follow a user',
        description: 'Route responsible for following a user.',
        tags: ['Follow'],
        security: [{ bearerAuth: [] }] as any,
        parameters: [
          {
            in: 'path',
            name: 'id',
            type: 'number',
            description: 'Followed user ID',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'User followed successfully',
          },
          '401': {
            description: 'Invalid token',
          },
          '404': {
            description: 'User not found',
          },
          '409': {
            description: 'User already followed OR you trying to follow yourself',
          },
        },
      },
    },
    '/users/unfollow/{id}': {
      delete: {
        summary: 'Unfollow a user',
        description: 'Route responsible for unfollowing a user.',
        tags: ['Follow'],
        security: [{ bearerAuth: [] }] as any,
        parameters: [
          {
            in: 'path',
            name: 'id',
            type: 'number',
            description: 'Unfollowed user ID',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'User unfollowed successfully',
          },
          '401': {
            description: 'Invalid token',
          },
          '404': {
            description: 'User not found',
          },
          '409': {
            description: 'User not followed OR you trying to unfollow yourself',
          },
        },
      },
    },
    '/tweets/{page}': {
      get: {
        summary: 'Get tweets for feed',
        description: 'Route responsible for returning all tweets from who the user follows.',
        tags: ['Tweets'],
        security: [{ bearerAuth: [] }] as any,
        parameters: [
          {
            in: 'path',
            name: 'page',
            type: 'number',
            description: 'Page number',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Tweets returned successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalPages: {
                      type: 'integer',
                    },
                    tweets: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/TweetWithAttachments',
                      },
                    },
                  },
                },
                examples: {
                  WithAttachments: {
                    value: {
                      totalPages: 1,
                      tweets: [
                        {
                          id: 1,
                          content: 'Tweet 1',
                          author_id: 1,
                          created_at: '2021-03-19T20:00:00.000Z',
                          files_urls: [
                            'http://localhost:3000/uploads/1616193600000-1.jpg',
                            'http://localhost:3000/uploads/1616193600000-2.jpg',
                          ],
                        },
                        {
                          id: 2,
                          content: 'Tweet 2',
                          author_id: 2,
                          created_at: '2021-03-19T20:00:00.000Z',
                          files_urls: ['http://localhost:3000/uploads/1616193600000-3.jpg'],
                        },
                      ],
                    },
                  },
                  WithoutAttachments: {
                    value: {
                      totalPages: 1,
                      tweets: [
                        {
                          id: 1,
                          content: 'Tweet 1',
                          author_id: 1,
                          created_at: '2021-03-19T20:00:00.000Z',
                          files_urls: [] as any,
                        },
                        {
                          id: 2,
                          content: 'Tweet 2',
                          author_id: 2,
                          created_at: '2021-03-19T20:00:00.000Z',
                          files_urls: [] as any,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid token',
          },
        },
      },
    },
    '/tweets/upload': {
      post: {
        summary: 'Upload a attachment to tweet',
        description: 'Route responsible for uploading a attachment for tweet.',
        tags: ['Tweets'],
        security: [{ bearerAuth: [] }] as any,
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'File uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UploadAttachment',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid token',
            },
          },
        },
      },
    },
    '/tweets/': {
      post: {
        summary: 'Create a new tweet',
        description: 'Route responsible for creating a new tweet.',
        tags: ['Tweets'],
        security: [{ bearerAuth: [] }] as any,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: {
                    type: 'string',
                  },
                  files_urls: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'url',
                    },
                  },
                },
              },
              required: ['content'],
              examples: {
                WithFilesUrls: {
                  value: {
                    content: 'Hello World!',
                    files_urls: [
                      'https://mini-twitter-api.onrender.com/files/1622207445-1.jpg',
                      'https://mini-twitter-api.onrender.com/files/1622207445-2.jpg',
                    ],
                  },
                },
                WithoutFilesUrls: {
                  value: {
                    content: 'Hello World! This is a tweet with only text.',
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Tweet created successfully',
            },
            '400': {
              description: 'Invalid data',
            },
            '401': {
              description: 'Invalid token',
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      Tweet: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          user: {
            type: 'string',
          },
          likes: {
            type: 'number',
          },
          retweets: {
            type: 'number',
          },
          createdAt: {
            type: 'string',
          },
        },
      },
      TweetWithAttachments: {
        allOf: [
          {
            $ref: '#/components/schemas/Tweet',
          },
          {
            type: 'object',
            properties: {
              files_urls: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'url',
                },
              },
            },
          },
        ],
      },
      UploadAttachment: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          url: {
            type: 'string',
            format: 'url',
          },
          key: {
            type: 'string',
          },
        },
      },
    },
  },
};
