import { prisma } from "../db";

import { totalLetters } from "./totalLetters";
import { totalAuthors } from "./totalAuthors";
import { totalDestinations } from "./totalDestinations";
import { lettersOfClass } from "./lettersOfClass";

export const generateStats = async () => {
  const letters = await prisma.letter.findMany();
  const authors = await prisma.author.findMany();
  const destinations = await prisma.destination.findMany();
  const classes = authors
    .map((author) => author.classId)
    .filter((value, index, self) => self.indexOf(value) === index);

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
  };
};
