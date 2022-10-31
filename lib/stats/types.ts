import { Author, Destination } from "@prisma/client";
import { Nullable } from "../utils/nullable";

export type BasicStats = Nullable<{
  totalAuthors: BigInt;
  totalLetters: BigInt;
  totalDestinations: BigInt;
  totalClasses: BigInt;
}>;

export type LettersByClass = Nullable<{
  classId: string;
  lettersCount: BigInt;
}>;

export type LettersByDestination = Nullable<{
  destinationId: string;
  lettersCount: BigInt;
}>;

export type AnonymousLettersByDestination = Nullable<{
  destinationId: string;
  anonymousLettersCount: BigInt;
}>;

export type TopAuthor = Author & {
  letters: BigInt | null;
};

export type Stats = {
  totalAuthors: BasicStats["totalAuthors"];
  totalLetters: BasicStats["totalLetters"];
  totalDestinations: BasicStats["totalDestinations"];
  totalClasses: BasicStats["totalClasses"];
  lettersByClass: LettersByClass[];
  lettersByDestination: (LettersByDestination & Destination)[];
  anonymousLettersByDestination: AnonymousLettersByDestination[];
  topAuthors: TopAuthor[];
};
