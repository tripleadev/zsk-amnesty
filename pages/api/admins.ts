import { withApiValidation } from "../../lib/withApiValidation";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { Asserts, object, string } from "yup";
import { hash } from "../../lib/utils/bcryptHash";
import { withApiAuth } from "../../lib/auth/withApiAuth";

export const adminSchema = object({
  email: string().required("E-Mail is required").email("This is not an email"),
  password: string().required("Password is required"),
});

export type AdminSchemaType = Asserts<typeof adminSchema>;

export default withApiAuth(
  withApiMethods({
    GET: async (req, res) => {
      const allAdmins = await prisma.admin.findMany();
      res.json({ allAdmins });
    },
    POST: withApiValidation(adminSchema, async (req, res) => {
      const { email, password } = req.body;

      try {
        const passwordHash = await hash(password);

        const newAdmin = await prisma.admin.create({
          data: {
            email,
            password: passwordHash,
          },
        });

        return res.json({ message: "Admin has been added successfully", newAdmin });
      } catch {
        return res.status(500).json({ message: "Internal server error" });
      }
    }),
  }),
);
