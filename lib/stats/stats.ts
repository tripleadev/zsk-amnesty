import { Destination } from "@prisma/client";
import { prisma } from "../db";
import { takeFirst } from "../utils/takeFirst";
import {
  AnonymousLettersByDestination,
  BasicStats,
  LettersByClass,
  LettersByDestination,
  Stats,
  TopAuthor,
} from "./types";

const getBasicStats = () =>
  takeFirst(prisma.$queryRaw<BasicStats[]>`SELECT * FROM public."BasicStats"`);

const getAnonymousLettersByDestination = () =>
  prisma.$queryRaw<
    AnonymousLettersByDestination[]
  >`SELECT * FROM public."AnonymousLettersByDestination" as l JOIN public."Destination" as d ON l."destinationId" = d.id`;

const getLettersByClass = () =>
  prisma.$queryRaw<LettersByClass[]>`SELECT * FROM public."LettersByClass"`;

const getLettersByDestination = () =>
  prisma.$queryRaw<
    (LettersByDestination & Destination)[]
  >`SELECT * FROM public."LettersByDestination" as l JOIN public."Destination" as d ON l."destinationId" = d.id`;

const getTopAuthors = () =>
  prisma.$queryRaw<TopAuthor[]>`SELECT * FROM public."TopAuthors" LIMIT 3`;

export const getStats = async (): Promise<Stats> => {
  const basicStats = await getBasicStats();
  const anonymousLettersByDestination = await getAnonymousLettersByDestination();
  const lettersByClass = await getLettersByClass();
  const lettersByDestination = await getLettersByDestination();
  const topAuthors = await getTopAuthors();

  return {
    ...basicStats,
    anonymousLettersByDestination,
    lettersByClass,
    lettersByDestination,
    topAuthors,
  };
};
