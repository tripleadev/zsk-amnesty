import { withApiValidation } from "../../lib/withApiValidation";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { Asserts, object, string } from "yup";
import { hashSync } from "bcrypt";

export const adminScheme = object({
  email: string().required("E-Mail is required").email("This is not an email"),
  password: string().required("Password is required"),
});

export type AdminSchemeType = Asserts<typeof adminScheme>;

export default withApiMethods({
  GET: async (req, res) => {
    const allAdmins = await prisma.admin.findMany();
    res.json({ allAdmins });
  },
  POST: withApiValidation(adminScheme, async (req, res) => {
    const { email, password } = req.body;

    try {
      const saltRounds = 10;
      const passwordHash = hashSync(password, saltRounds);
      console.log(passwordHash);

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
});