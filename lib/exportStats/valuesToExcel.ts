import { Author, Destination, Letter } from "@prisma/client";
import { Workbook, Worksheet } from "excel4node";

interface Props {
  workbook: Workbook;
  worksheet: Worksheet;
  data: {
    allLetters: Letter[];
    allAuthors: Author[];
    allDestinations: Destination[];
  };
}

export const valuesToExcel = async ({ workbook, worksheet, data }: Props) => {
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

    worksheet
      .cell(index + 2, 1)
      .string(author?.classId)
      .style(normalStyle);
    worksheet
      .cell(index + 2, 2)
      .number(author?.registerNumber)
      .style(normalStyle);
    worksheet
      .cell(index + 2, 3)
      .string(destination?.name)
      .style(normalStyle);
  });
};
