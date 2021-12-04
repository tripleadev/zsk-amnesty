import { Letter } from "@prisma/client";

export const totalLetters = (letters: Letter[]) => letters.length;
