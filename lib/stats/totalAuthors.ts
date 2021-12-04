import { Author } from "@prisma/client";

export const totalAuthors = (authors: Author[]) => authors.length;
