import { withApiAuth } from "../../lib/auth/withApiAuth";
import { withApiMethods } from "../../lib/withApiMethods";
import { withApiValidation } from "../../lib/withApiValidation";
import { hash, compare } from "../../lib/utils/bcryptHash";
import { prisma } from "../../lib/db";
import { Asserts, object, string } from "yup";

export const changePasswordSchema = object({
  oldPassword: string().required("Old password is required"),
  newPassword: string().required("New password is required"),
  hashedOldPassword: string().required(),
  id: string().required("User id is required"),
});

export type ChangePasswordType = Asserts<typeof changePasswordSchema>;

export default withApiAuth(
  withApiMethods({
    POST: withApiValidation({ body: changePasswordSchema }, async (req, res) => {
      const { oldPassword, newPassword, hashedOldPassword, id } = req.body;

      try {
        if (await compare(oldPassword, hashedOldPassword)) {
          const hashedNewPassword = await hash(newPassword);

          const changedAdmin = await prisma.admin.update({
            where: { id },
            data: { password: hashedNewPassword },
          });

          return res.json({
            message: "Admin password has been changed successfully",
            changedAdmin,
          });
        } else {
          return res.status(420).json({ message: "Bad old password" });
        }
      } catch {
        return res.status(500).json({ message: "Internal server error" });
      }
    }),
  }),
);
