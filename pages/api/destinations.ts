import { withApiMethods } from "../../lib/withApiMethods";
import { withApiValidation } from "../../lib/withApiValidation";
import { prisma } from "../../lib/db";
import { object, string } from "yup";

export const destinationSchema = object({
  name: string().required("Destination name is required"),
});

export interface DestinationType {
  id: string;
  name: string;
}

export default withApiMethods({
  GET: async (req, res) => {
    const allDestinations = await prisma.destination.findMany();
    res.json({ allDestinations });
  },
  POST: withApiValidation(destinationSchema, async (req, res) => {
    const { name } = req.body;

    try {
      const newDestination = await prisma.destination.create({
        data: {
          name,
        },
      });

      return res.json({ message: "Destination has been added successfully", newDestination });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
});
