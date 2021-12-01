import { object, string, number, Asserts } from "yup";
import { withApiAuth } from "../../../lib/auth/withApiAuth";
import { withApiMethods } from "../../../lib/withApiMethods";
import { withApiValidation } from "../../../lib/withApiValidation";
import { prisma } from "../../../lib/db";
import { DEFAULT_LETTERS_TAKE } from "../../../components/letters/LettersTable";

const createLetterSchema = object({
  classId: string().required("Class ID is required"),
  registerNumber: number().default(undefined),
  destinationId: string().required("Destination ID is required"),
});

export default withApiAuth(
  withApiMethods({
    GET: withApiValidation(
      {
        query: object({
          skip: number().default(0),
          take: number().default(DEFAULT_LETTERS_TAKE),
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
          orderBy: {
            createdAt: "desc",
          },
        });

        const allLettersCount = await prisma.letter.count();

        return res.json({
          letters,
          pagination: {
            allLettersCount,
          },
        });
      },
    ),
    POST: withApiValidation(
      {
        body: createLetterSchema,
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

          const destination = await prisma.destination.findUnique({
            where: {
              id: destinationId,
            },
          });
          if (!destination) {
            return res.status(400).json({ message: "Destination not found" });
          }

          const letter = await prisma.letter.create({
            data: {
              authorId: author.id,
              destinationId: destination.id,
            },
            include: {
              author: true,
              destination: true,
            },
          });

          return res.json({ message: "Letter has been added successfully", letter });
        } catch {
          return res.status(500).json({ message: "Internal server error" });
        }
      },
    ),
  }),
);
