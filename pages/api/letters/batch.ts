import { number, object, string } from "yup";
import { withApiAuth } from "../../../lib/auth/withApiAuth";
import { withApiMethods } from "../../../lib/withApiMethods";
import { withApiValidation } from "../../../lib/withApiValidation";
import { prisma } from "../../../lib/db";

export default withApiAuth(
  withApiMethods({
    POST: withApiValidation(
      {
        body: object({
          destinationId: string().required("Destination ID is required"),
          classId: string().required("Class ID is required"),
          amount: number().required("Amount is required").min(1),
          registerNumber: number().default(null).nullable(),
        }),
      },
      async (req, res) => {
        const { destinationId, classId, amount, registerNumber } = req.body;

        try {
          let author = await prisma.author.findFirst({
            where: {
              classId,
              registerNumber: registerNumber,
            },
          });
          if (!author) {
            author = await prisma.author.create({
              data: {
                classId,
                registerNumber: registerNumber,
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

          const letters = await prisma.letter.createMany({
            data: new Array(amount).fill({
              authorId: author!.id,
              destinationId: destination.id,
            }),
          });

          return res.json({ message: "Letters created successfully", letters });
        } catch {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      },
    ),
  }),
);
