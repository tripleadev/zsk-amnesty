# ZSK Amnesty

## What is it?

It's an app made for keeping track of all the letters which are written durimg the Amnesty International marathon at our school.
The system consists of a public statistics page and a dashboard for the admins to put the data in.

https://miro.com/app/board/uXjVOf8j2IY=/?invite_link_id=98643837632

## What's it made of?

- Next.js
- Prisma
- PostgreSQL
- Docker
- Material UI

## How to develop?

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

### Commiting changes

- Use the [Conventional Commits methodology](https://conventionalcommits.org/)
- Commit on the branch with the name of your ticket
- Create pull requests on the `dev` branch
- Wait for code reviews!
