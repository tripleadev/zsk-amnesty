import { Author, Letter } from "@prisma/client";

type AuthorWithLetters = Author & { letters: Letter[] };

export const topAuthors = (authors: AuthorWithLetters[], places: number) => {
  const res: { key: string; value: string }[];

  const topAuthors = authors.sort((a, b) => b.letters.length - a.letters.length);

  for (let i = 1; i <= places; i++) {
    res.push({
      key: `top.1.${topAuthors[i].classId}.${topAuthors[i].registerNumber}`,
      value: String(topAuthors[i].letters.length),
    });
  }

  return res;
};
