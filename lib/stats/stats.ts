import { prisma } from "../db";

import { totalLetters } from "./totalLetters";
import { totalAuthors } from "./totalAuthors";
import { totalDestinations } from "./totalDestinations";
import { lettersOfClass } from "./lettersOfClass";
import { lettersTo } from "./lettersTo";
import { anonymousLettersTo } from "./anonymousLettersTo";
import { topAuthors } from "./topAuthors";

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
        lettersTo(destination.letters),
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
