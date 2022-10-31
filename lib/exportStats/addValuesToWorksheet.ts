import { Author, Destination, Letter } from "@prisma/client";
import { getStats } from "../stats/stats";

type Props = {
  workbook: any;
  worksheet: any;
  data: {
    allLetters: Letter[];
    allAuthors: Author[];
    allDestinations: Destination[];
  };
};

const verifyString = (value: unknown): value is string => typeof value === "string";
const verifyNumber = (value: unknown): value is number => typeof value === "number";

// TODO: refactor after changing the generateStats/getStats function
export const addValuesToWorksheet = async ({ workbook, worksheet, data }: Props) => {
  const { allLetters, allAuthors, allDestinations } = data;
  const normalStyle = workbook.createStyle({
    font: {
      bold: false,
      size: 12,
    },
  });

  allLetters.forEach((letter, index) => {
    const author = allAuthors.find((author) => author.id === letter.authorId);
    const destination = allDestinations.find(
      (destination) => destination.id === letter.destinationId,
    );

    verifyString(author?.classId) &&
      worksheet
        .cell(index + 2, 1)
        .string(author?.classId)
        .style(normalStyle);
    verifyNumber(author?.registerNumber) &&
      worksheet
        .cell(index + 2, 2)
        .number(author?.registerNumber)
        .style(normalStyle);
    verifyString(destination?.name) &&
      worksheet
        .cell(index + 2, 3)
        .string(destination?.name)
        .style(normalStyle);
  });

  const allStats = await getStats();
  Object.entries(allStats).forEach(([k, v], i) => {
    verifyString(k) &&
      worksheet
        .cell(i + 2, 5)
        .string(k)
        .style(normalStyle);

    verifyString(Number(v).toString()) &&
      worksheet
        .cell(i + 2, 6)
        .string(Number(v).toString())
        .style(normalStyle);
  });
};
