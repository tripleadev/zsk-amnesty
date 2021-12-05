import { prisma } from "../db";

import { totalLetters } from "./totalLetters";
import { totalAuthors } from "./totalAuthors";
import { totalDestinations } from "./totalDestinations";
import { lettersOfClass } from "./lettersOfClass";
import { lettersToDestination } from "./lettersToDestination";
import { anonymousLettersTo } from "./anonymousLettersTo";
import { topAuthors } from "./topAuthors";
import { Stats } from "@prisma/client";

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
  } as Record<string, string | number>;
};

export const updateStats = (newStats: object) => {
  return prisma.$transaction([
    prisma.stats.deleteMany({ where: {} }),
    prisma.stats.create({ data: { stats: JSON.stringify(newStats) } }),
  ]);
};

const EXPIRE_STATS_AFTER = 1000 * 10;

export const statsAreExpired = (stats: Stats | null) => {
  return !stats || stats.updatedAt < new Date(Date.now() - EXPIRE_STATS_AFTER);
};
