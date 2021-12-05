import { Letter, Author } from "@prisma/client";

export const lettersToDestination = (letters: Letter[], anons: Author[]) => {
  return letters.filter((letter) => !anons.some((author) => author.id === letter.authorId)).length;
};
