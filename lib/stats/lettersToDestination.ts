import { Letter } from "@prisma/client";

export const lettersToDestination = (letters: Letter[]) => letters.length;
