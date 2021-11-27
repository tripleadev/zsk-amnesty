import { PrismaClient, Author, Destination, Letter } from "@prisma/client";
import { hash } from "../lib/utils/bcryptHash";
import faker from "faker";
const prisma = new PrismaClient();

faker.locale = "pl";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

async function main() {
  const passwordHash = await hash(ADMIN_PASSWORD);
  const admin = await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      password: passwordHash,
    },
  });
  console.log({ admin });

  let authorsList = [];
  let destinationsList = [];
  let lettersList = [];

  for (let i = 1; i <= 20; i++) {
    const name = faker.name.firstName() + " " + faker.name.lastName();
    const destinationId = faker.datatype.uuid();

    destinationsList.push({
      id: destinationId,
      name,
    });
  }

  for (let i = 1; i <= 3; i++) {
    const classId = i + (i === 1 ? "A" : i === 2 ? "B" : "C");

    for (let i = 1; i <= 30; i++) {
      const registerNumber = i;
      const authorId = faker.datatype.uuid();
      const letterAmount = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < letterAmount; i++) {
        const letterId = faker.datatype.uuid();

        lettersList.push({
          id: letterId,
          authorId,
          destinationId: faker.random.arrayElement(destinationsList).id,
        });
      }

      authorsList.push({
        id: authorId,
        classId,
        registerNumber,
      });
    }
  }

  await prisma.author.createMany({
    data: authorsList,
  });

  await prisma.destination.createMany({
    data: destinationsList,
  });

  await prisma.letter.createMany({
    data: lettersList,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
