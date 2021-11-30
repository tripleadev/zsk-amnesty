import { object, string, number } from "yup";
import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { withApiValidation } from "../../lib/withApiValidation";
import { prisma } from "../../lib/db";

export default withApiAuth(
  withApiMethods({
    GET: withApiValidation(
      {
        query: object({
          skip: number().default(0),
          take: number().default(20),
        }).required(),
      },
      async (req, res) => {
        const { skip, take } = req.query;
        const letters = await prisma.letter.findMany({
          skip,
          take,
          include: {
            destination: true,
            author: true,
          },
        });

        return res.json({ letters });
      },
    ),
    POST: withApiValidation(
      {
        body: object({
          classId: string().required("Class ID is required"),
          registerNumber: number().default(undefined),
          destinationId: string().required("Destination ID is required"),
        }),
      },
      async (req, res) => {
        const { classId, registerNumber, destinationId } = req.body;

        try {
          let author = await prisma.author.findFirst({
            where: {
              classId,
              registerNumber,
            },
          });

          if (!author) {
            author = await prisma.author.create({
              data: {
                classId,
                registerNumber,
              },
            });
          }
        } catch {}
      },
    ),
  }),
);
