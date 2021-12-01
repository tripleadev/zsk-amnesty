import { Author, Letter } from "@prisma/client";

export const lettersOfClass = (authors: Author[], letters: Letter[], classId: String) => {
  const authorsOfClass = authors.filter((author) => author.classId === classId);

  const lettersOfClass = letters.filter((letter) => {
    return authorsOfClass.some((author) => author.id === letter.authorId);
  });

  return lettersOfClass.length;
};
