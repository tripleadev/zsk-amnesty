import { prisma } from "../db";

import { totalLetters } from "./totalLetters";
import { totalAuthors } from "./totalAuthors";
import { totalDestinations } from "./totalDestinations";
import { lettersOfClass } from "./lettersOfClass";
import { lettersToDestination } from "./lettersToDestination";
import { anonymousLettersTo } from "./anonymousLettersTo";
import { topAuthors } from "./topAuthors";
import { Stat } from "@prisma/client";

export const generateStats = async () => {
  const letters = await prisma.letter.findMany();
  const authors = await prisma.author.findMany({ include: { letters: true } });
  const destinations = await prisma.destination.findMany({ include: { letters: true } });
  const classes = authors
    .map((author) => author.classId)
    .filter((value, index, self) => self.indexOf(value) === index);
  const anons = authors.filter((author) => author.classId === "Public");

  return {
    totalLetters: totalLetters(letters),
    totalAuthors: totalAuthors(authors),
    totalDestinations: totalDestinations(destinations),
    totalClasses: classes.length,
    ...Object.fromEntries(
      classes.map((classId) => [
        `lettersOfClass.${classId}`,
        lettersOfClass(authors, letters, classId),
      ]),
    ),
    ...Object.fromEntries(
      destinations.map((destination) => [
        `lettersTo.${destination.name}`,
        lettersToDestination(destination.letters),
      ]),
    ),
    ...Object.fromEntries(
      destinations.map((destination) => [
        `anonymous.lettersTo.${destination.name}`,
        anonymousLettersTo(destination.letters, anons),
      ]),
    ),
    ...topAuthors(authors, 3),
  };
};

export const updateStats = async (newStats: object) => {
  const upserts = Object.entries(newStats).map(([key, value]) =>
    prisma.stat.upsert({
      where: {
        id: key,
      },
      update: {
        value: String(value),
        updatedAt: new Date(Date.now()),
      },
      create: {
        id: key,
        value: String(value),
        updatedAt: new Date(Date.now()),
      },
    }),
  );

  await prisma.$transaction(upserts);
};

export const statsAreExpired = (stats: Stat[]) => {
  return !stats.length || stats[0]?.updatedAt < new Date(Date.now() - 1000 * 10);
};
