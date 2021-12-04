import { withApiValidation } from "../../lib/withApiValidation";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { Asserts, object, string, array } from "yup";
import { hash } from "../../lib/utils/bcryptHash";
import { withApiAuth } from "../../lib/auth/withApiAuth";

export const adminSchema = object({
  email: string().required("E-Mail is required").email("This is not an email"),
  password: string().required("Password is required"),
});

export const deleteAdminSchema = object({
  ids: array(string()).required(),
});

export type AdminSchemaType = Asserts<typeof adminSchema>;

export default withApiAuth(
  withApiMethods({
    GET: async (_req, res) => {
      const allAdmins = await prisma.admin.findMany();
      res.json({ allAdmins });
    },
    POST: withApiValidation({ body: adminSchema }, async (req, res) => {
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
    DELETE: withApiValidation({ body: deleteAdminSchema }, async (req, res) => {
      const { ids } = req.body;

      try {
        await prisma.$transaction(
          ids.map((adminId) =>
            prisma.admin.delete({
              where: { id: adminId },
            }),
          ),
        );

        return res.json({ message: "Admin has been deleted successfully" });
      } catch {
        return res.status(500).json({ message: "Internal server error" });
      }
    }),
  }),
);
