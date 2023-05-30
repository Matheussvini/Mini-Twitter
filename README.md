# Mini Twitter

Mini Twitter is a API REST for a small social media application built with Node.js, Express, Typescript, Prisma ORM and Jest.

## Table of Contents

- [Features](#features)
- [Deploy](#api-and-database-deployment)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- Following/unfollowing other users
- Posting tweets
- Posting static files on tweets
- Timeline to view tweets from followed users
- User profile management

# API and Database Deployment
The API and database for this project have been successfully deployed and are now live. You can access them using the following link:

https://mini-twitter-api.onrender.com

The integration between the API and the database allows seamless communication and data storage for the application. You can now interact with the API endpoints to perform various operations and utilize the functionality provided by the application.

Feel free to explore and make use of the deployed API and database. If you encounter any issues or have any feedback, please don't hesitate to reach out.

## Getting Started

To get a local copy up and running, follow these steps.

## Prerequisites

- Node.js (version ^16)
- PostgreSQL database

## Installation

1. Clone the repository.
2. Install the dependencies by running the following command:

   ```bash
   npm install
    ```

## Configuration
Configure the application by setting the following environment variables:

- `POSTGRES_USERNAME`: PostgreSQL database username
- `POSTGRES_PASSWORD`: PostgreSQL database password
- `POSTGRES_HOST`: PostgreSQL host
- `POSTGRES_PORT`: PostgreSQL port
- `POSTGRES_DATABASE`: PostgreSQL database name
- `JWT_SECRET`: Secret key for JWT authentication
- `DATABASE_URL`: URL for connecting to the PostgreSQL database
- `STORAGE_TYPE`: Storage type for file uploads (e.g., "local" or "s3")
- `AWS_BUCKET_NAME`: AWS S3 bucket name
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_DEFAULT_REGION`: AWS region

## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example` file (see "Running application locally or inside docker section" for details)
5. Run all migrations

```bash
npm run dev:migration:run
```

6. Seed db

```bash
npm run dev:seed
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

## How to run tests

1. Follow the steps in the last section
1. Configure the `.env.test` file using the `.env.example` file (see "Running application locally or inside docker" section for details)
1. Run all migrations

```bash
npm run migration:run
```

3. Run test:
   (locally)

```bash
npm run test
```

## Building and starting for production

```bash
npm run build
npm start
```

## Running migrations or generate prisma clients

Before running migrations make sure you have a postgres db running based on `.env.development` or `.env.test` file for each environment. You can start a postgres instance by typing `npm run dev:postgres` or `npm run test:postgres`. The host name is the name of the postgres container inside docker-compose file if you are running the application inside a docker container or localhost if you are running it locally.

You can operate on databases for different environments, but it is necessary to populate correct env variables for each environment first, so in order to perform db operations type the following commands:

- `npm run dev:migration:run` - run migrations for development environment by loading envs from .env.development file. It uses [dotenv-cli](https://github.com/entropitor/dotenv-cli#readme) to load envs from .env.development file.
- `npm run test:migration:run` - the same, but for test environment

- `npm run dev:migration:generate -- --name ATOMIC_OPERATION_NAME` - generate and run migration and prisma client for development environment by loading envs from .env.development file. Replace `ATOMIC_OPERATION_NAME` by the name of the migration you want to generate.

## What to do when add new ENV VARIABLES

There are several things you need to do when you add new ENV VARIABLES:
- Add them to `.env.example` file
- Add them to your local `.env.development` and `.env.test` files
- Add them to your docker-compose.yml file (just the name, not the value). Only envs listed in the environment section will be exposed to your docker container.
- Add them (prod version) to your github repo secrets. They will be used to generate the `.env` file on deploy.
- Add them (prod version) to test.yml file on .github/workflows/test.yml.

## Contributing
Contributions are welcome! If you have any improvements or bug fixes, feel free to submit a pull request.

## License
This project is licensed under the Mozila License.



