import { prisma } from "../../lib/db";
import { excelSetup } from "./excelSetup";
import { valuesToExcel } from "./valuesToExcel";

export const createExcel = async () => {
  const allLetters = await prisma.letter.findMany();
  const allAuthors = await prisma.author.findMany();
  const allDestinations = await prisma.destination.findMany();
  const data = {
    allLetters,
    allAuthors,
    allDestinations,
  };

  const { workbook, worksheet } = await excelSetup();
  await valuesToExcel({ workbook, worksheet, data });

  return workbook;
};
