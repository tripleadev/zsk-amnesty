import { prisma } from "../db";
import { excelFileSetup } from "./excelFileSetup";
import { addValuesToWorksheet } from "./addValuesToWorksheet";

export const convertStatsIntoExcel = async () => {
  const allLetters = await prisma.letter.findMany();
  const allAuthors = await prisma.author.findMany();
  const allDestinations = await prisma.destination.findMany();
  const data = {
    allLetters,
    allAuthors,
    allDestinations,
  };

  const { workbook, worksheet } = await excelFileSetup();
  await addValuesToWorksheet({ workbook, worksheet, data });

  return workbook;
};
