import { withApiValidation } from "../../lib/withApiValidation";
import { withApiMethods } from "../../lib/withApiMethods";
import { prisma } from "../../lib/db";
import { compare } from "../../lib/utils/bcryptHash";
import { safeRandomString } from "../../lib/utils/safeRandomString";
import { getSessionCookie, getSessionExpirationDate } from "../../lib/auth/auth";
import { Asserts, object, string } from "yup";

export const loginSchema = object({
  email: string().required("E-Mail is required").email("E-Mail must be valid"),
  password: string().required("Password is required"),
});

export type LoginSchemaType = Asserts<typeof loginSchema>;

export default withApiMethods({
  POST: withApiValidation({ body: loginSchema }, async (req, res) => {
    const { email, password } = req.body;

    let user;
    try {
      user = await prisma.admin.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error();
      }

      const passwordValid = await compare(password, user.password);

      if (!passwordValid) {
        throw new Error();
      }
    } catch {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    try {
      const sessionExpiry = getSessionExpirationDate();
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          id: safeRandomString(128),
          expiresAt: sessionExpiry,
        },
      });

      res.setHeader("Set-Cookie", getSessionCookie(session.id, sessionExpiry));

      return res.json({ message: "Logged in successfully", user });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
});
