import { Author, Letter } from "@prisma/client";

type AuthorWithLetters = Author & { letters: Letter[] };

export const topAuthors = (authors: AuthorWithLetters[], places: number) => {
  return Object.fromEntries(
    authors
      .filter((author) => !!author.registerNumber)
      .sort((a, b) => b.letters.length - a.letters.length)
      .slice(0, places)
      .map((author, i) => {
        return [
          `top.${i + 1}.${author.classId}.${author.registerNumber}`,
          String(author.letters.length),
        ];
      }),
  );
};
