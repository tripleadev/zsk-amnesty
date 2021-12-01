<p align="center">
  <img src="./amnesty-logo.png" width="200" />
</p>
<h1 align="center">ZSK Amnesty</h1>

It's an app made for keeping track of all the letters which are written during the [Amnesty International](https://www.amnesty.org/en/) marathon at [our school](https://zsk.poznan.pl).
The system consists of a public statistics page and a dashboard for the admins to put the data in.

The main concepts and features of the app were put toghether on this board: https://miro.com/app/board/uXjVOf8j2IY=/?invite_link_id=98643837632

### Table of Contents

- [What's it made of?](#whats-it-made-of)
- [How to develop?](#how-to-develop)
  - [Modifying the database model](#modifying-the-database-model)
  - [Looking inside the DB](#looking-inside-the-db)
  - [Seeding the DB](#seeding-the-db)
  - [Summary](#summary)
- [Deployment](#deployment)
  - [Environments](#environments)
  - [Summary](#summary-1)
- [How do I deploy the app on my own?](#how-do-i-deploy-the-app-on-my-own)

## What's it made of?

- Next.js
- Prisma
- PostgreSQL
- Docker (for development)
- Material UI
- React Query
- react-hook-form

## How to develop?

The development process is designed to be as simple to start as possible. The database is automatically created and maintained using Docker Compose, so you don't have to care about it while developing!

Clone the repo and switch to the `dev` branch. You'll be checking out all the branches from the `dev` branch.

Be sure to have Docker, Node.js and yarn installed on your machine (I recommend to install Node using NVM and use the version defined in the .nvmrc file).

Copy the contents of `.env.sample` into `.env`

Then, just launch the following command in your terminal:

```
yarn dev
```

It will create and launch the development database, do all the required migrations and start the development server.

### Modifying the database model

Modify the prisma schema in the `prisma/schema.prisma` file, and restart the development server.

### Looking inside the DB

Use the PGAdmin launched automatically alongside the database, available at `localhost:5050` with the following credentials:

```
Emial: admin@admin.com
Password: admin
```

If the database is not visible inside the PGAdmin, add it manually with the following data:

```
host: amnesty_db
port: 5432
username: postgres
password: postgres
```

Another option is using Prisma Studio, which you can launch via the following command, being sure that the development process (DB and app) is running concurrently:

```
yarn dev:start:studio
```

### Seeding the DB

Be sure to have the development process running concurrently, and launch:

```
yarn db:seed
```

### Summary

For any more database operations, check out the [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) and [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference) documentation.

For more context about the development process, check out the [docker-compose.yml](./docker-compose.yml) and [package.json](./package.json) files.

## Deployment

Currently, the app is deployed using:

- [Vercel](https://vercel.com/)

  Vercel is responsible for hosting the Next.js app.

- [Prisma Cloud](https://cloud.prisma.io/)

  Prisma Cloud acts as a database proxy between the app hosted on Vercel, and the PostgreSQL database hosted on Heroku. The data proxy is needed for deployments in serverless environments, in order to have a bigger connection pool for the database, without affecting its reliability and/or performance.

- [Heroku](https://heroku.com/)

  We use Heroku Postgres to keep our data in a safe and reliable place.

### Environments

The app has two environments set up - Preview and Production. Each of them has its own database.

Production is deployed automatically from the `main` branch, whereas a new instance of Preview is deployed on every commit to the `dev` branch, and every PR to the `main` or `dev` branch.

Important thing to note are the database migrations. For that, we use the Prisma's built-in `prisma migrate` module. We run the migrations on the databases during the deployment phase on Vercel, if the commit is made on the `main` branch (and then, the migration is run on the production database) or on the `dev` branch (in that case, we run the migration on the staging/preview database). If the deployment is made in any other case (for example, is made from a PR), the migrations won't be run.

### Summary

For more context about the whole CI/CD process, check out the [package.json](./package.json) and [prod-migrate.sh](./prod-migrate.sh) files.

## How do I deploy the app on my own?

If you want to deploy this app on your own (we are not planning on transfering ownership of this repo to anyone else), you can use the following steps:

1. Fork or clone this repo
2. Set up a a deployment of your own choice - all you need to provide is a hosting for the Next.js app, and the following environment variables:
   - DATABSE_URL: the connection string/url of the PostgreSQL database. You can also use the [Prisma Cloud Data Proxy](https://www.prisma.io/docs/concepts/components/prisma-data-platform). You can always inspire from the way [how we deployed the app](#deployment) 😄

Our suggestion for the simpliest and fastest deployment setup is just using Heroku for both deploying the App and Database, without having to worry about Prisma Cloud. But the limitation is a harder setup of multiple environments.
