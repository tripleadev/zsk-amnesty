import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
const excel = require("excel4node");

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      try {
        const allLetters = await prisma.letter.findMany();
        const allAuthors = await prisma.author.findMany();
        const allDestinations = await prisma.destination.findMany();

        console.log(allAuthors, allDestinations);
        const workbook = new excel.Workbook();
        const worksheet1 = workbook.addWorksheet("Letters");

        const headingStyle = workbook.createStyle({
          font: {
            bold: true,
            size: 14,
          },
        });

        const normalStyle = workbook.createStyle({
          font: {
            bold: false,
            size: 12,
          },
        });

        worksheet1.cell(1, 1).string("Class name").style(headingStyle);
        worksheet1.cell(1, 2).string("Register number").style(headingStyle);
        worksheet1.cell(1, 3).string("Destination").style(headingStyle);

        let i = 2;
        allLetters.forEach((letter) => {
          const author = allAuthors.find((author) => author.id === letter.authorId);
          const destination = allDestinations.find(
            (destination) => destination.id === letter.destinationId,
          );

          worksheet1.cell(i, 1).string(author?.classId).style(normalStyle);
          worksheet1.cell(i, 2).number(author?.registerNumber).style(normalStyle);
          worksheet1.cell(i, 3).string(destination?.name).style(normalStyle);

          i++;
        });

        workbook.write("zsk-amnesty.xlsx", res);
      } catch {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  }),
);
