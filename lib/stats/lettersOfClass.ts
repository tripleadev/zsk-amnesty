import { Author, Letter } from "@prisma/client";

type AuthorWithLetters = Author & { letters: Letter[] };

export const lettersOfClass = (
  authors: AuthorWithLetters[],
  letters: Letter[],
  classId: String,
) => {
  const authorsOfClass = authors
    .filter((author) => author.classId === classId)
    .sort((a, b) => b.letters.length - a.letters.length);

  const lettersOfClass = letters.filter((letter) => {
    return authorsOfClass.some((author) => author.id === letter.authorId);
  });

  return lettersOfClass.length;
};
