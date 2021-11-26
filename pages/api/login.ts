import { NextApiRequest, NextApiResponse } from "next";
import { withValidation } from "../../lib/withValidation";
import { LoginInputSchema } from "../../lib/schemas";
import { withMethods } from "../../lib/withMethods";
import { prisma } from "../../lib/db";
import { compare } from "../../lib/utils/bcryptHash";
import { safeRandomString } from "../../lib/utils/safeRandomString";

export default withMethods({
  POST: withValidation(LoginInputSchema, async (req, res) => {
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
      const sessionExpiry = new Date(Date.now() + 3600 * 1000 * 24);
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          id: safeRandomString(128),
          expiresAt: sessionExpiry,
        },
      });

      res.setHeader(
        "Set-Cookie",
        `Session=${session.id}; Expires=${sessionExpiry.toUTCString()}; Secure; HttpOnly`,
      );

      return res.redirect("/admin");
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
});
