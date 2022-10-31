import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { PrismaClient as RegularPrismaClient } from "@prisma/client";
import { PrismaClient as EdgePrismaClient } from "@prisma/client/edge";

const PrismaClient = process.env.VERCEL ? EdgePrismaClient : RegularPrismaClient;

declare global {
  var prisma: PrismaClientType | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
