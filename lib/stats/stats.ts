import { prisma } from "../db";

import { totalLetters } from "./totalLetters";

export const generateStats = async () => {
  const letters = await prisma.letter.findMany();

  return {
    totalLetters: totalLetters(letters),
  };
};
